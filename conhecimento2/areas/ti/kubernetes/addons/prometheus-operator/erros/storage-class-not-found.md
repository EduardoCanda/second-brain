---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Esse erro costuma significar: **o [[prometheus-operator|Operator]] não encontrou (ou não conseguiu criar) o StatefulSet** que deveria existir para o seu `Prometheus` CR. Abaixo vai um **checklist rápido** e as **causas + correções** mais comuns.

---

## Checklist de 60s

1. **Operator está rodando?**
    

```bash
kubectl -n monitoring get deploy,pods | egrep 'prometheus.*operator|kube-prometheus-stack-operator'
```

Se não houver Deployment/Pod do operator, ele **não** vai reconciliar nada.

2. **Logs do Operator (erros de RBAC/PSA/validação):**
    

```bash
kubectl -n monitoring logs deploy/kube-prometheus-stack-operator | egrep -i 'forbidden|denied|error|failed|webhook|statefulset'
```

3. **O CR está no namespace que o Operator observa?**  
    Se você configurou `prometheusOperator.namespaces.releaseNamespace: true`, o Operator **só** enxerga o namespace do release.  
    Coloque o `Prometheus` CR **no mesmo namespace** (ex.: `monitoring`) **ou** adicione seus namespaces em:
    

```yaml
prometheusOperator:
  namespaces:
    releaseNamespace: true
    additional:
      - minha-app
      - outro-ns
```

4. **Existe o StatefulSet esperado?**
    

```bash
kubectl -n monitoring get sts | grep prometheus-
kubectl -n monitoring describe prometheus <nome>   # veja Conditions/Events
```

---

## Causas típicas → Como corrigir

### 1) **Só os CRDs foram instalados (operator ausente)**

Sintoma: `Prometheus` CR existe, mas **nenhum** StatefulSet é criado e não há logs do operator.  
**Correção (Helm)** – garanta o Operator habilitado:

```yaml
kube-prometheus-stack:
  enabled: true
  prometheusOperator:
    enabled: true
  prometheus:
    enabled: true   # (ou false, se vai criar o CR manualmente)
```

> Se você usa um “umbrella chart”, confira se não deixou `kube-prometheus-stack.prometheusOperator.enabled=false`.

---

### 2) **Operator sem permissão / escopo errado**

Sintoma: logs com `forbidden` ao criar `statefulsets.apps`.  
**Correção:** não restrinja demais o escopo. Use o release no `monitoring` e ponha o CR no mesmo ns **ou** liste `additional` namespaces (ver snippet acima). O chart cria os RBACs necessários cluster-wide por padrão; evitar customizações muito restritivas.

---

### 3) **Conflito de nomes com outro StatefulSet**

Sintoma: Operator tenta criar `prometheus-<nome>` e já existe um STS com mesmo nome (ex.: de uma instalação antiga).  
**Correção:** renomeie o CR (`metadata.name`) **ou** remova/renomeie o STS antigo. Evite “adotar” recursos criados fora do Operator.

---

### 4) **`storageSpec`/StorageClass inválida**

Sintoma: Events no namespace mostram erro ao criar PVC/STS (`storageClassName` inexistente, quotas, etc.).  
**Correção:** ajuste o `prometheus.prometheusSpec.storageSpec`:

```yaml
prometheus:
  prometheusSpec:
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: <sua-storage-class>
          accessModes: ["ReadWriteOnce"]
          resources: { requests: { storage: 200Gi } }
```

---

### 5) **PSA/Policies bloqueando o Pod**

Sintoma: logs/eventos com `denied by PodSecurity` ou admission webhooks.  
**Correção:** use o namespace `monitoring` com nível PSA adequado (ex.: `baseline`), ou aplique labels/NetworkPolicies conforme sua política.

---

## Manifesto “mínimo-válido” para testar

Coloque no **mesmo namespace** do Operator (ex.: `monitoring`):

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: test
  namespace: monitoring
spec:
  replicas: 2
  retention: 15d
  walCompression: true
  serviceMonitorSelector: {}
  serviceMonitorNamespaceSelector:
    matchLabels: { monitoring: "enabled" }
  storage:
    volumeClaimTemplate:
      spec:
        storageClassName: <sua-storage-class>
        accessModes: ["ReadWriteOnce"]
        resources:
          requests: { storage: 50Gi }
```

Após aplicar:

```bash
kubectl -n monitoring get sts,pods -l app.kubernetes.io/name=prometheus
kubectl -n monitoring describe prometheus test
```

---

## Se ainda aparecer “StatefulSetNotFound”

- Cole aqui o resultado de:
    
    - `kubectl -n monitoring get prometheus -o yaml`
        
    - `kubectl -n monitoring logs deploy/kube-prometheus-stack-operator | tail -n 200`
        
    - `kubectl -n monitoring get events --sort-by=.lastTimestamp | tail -n 50`
        
- Com isso, eu aponto exatamente qual dos casos acima está te atingindo e mando o patch (values/manifestos) pronto pra aplicar.