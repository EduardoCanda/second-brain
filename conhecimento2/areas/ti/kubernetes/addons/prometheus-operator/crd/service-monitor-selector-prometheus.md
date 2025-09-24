---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Perfeito — você está falando do **seletor que fica no [[prometheus-crd|Prometheus CRD]]** (do Prometheus Operator), que decide **quais [[servicemonitor-crd]] serão “admitidos”** por uma instância de Prometheus. Esse controle é feito por **dois campos**:

1. `spec.serviceMonitorSelector` — _LabelSelector_ aplicado aos **próprios ServiceMonitors**
    
2. `spec.serviceMonitorNamespaceSelector` — _LabelSelector_ aplicado aos **[[namespace|namespaces]]** onde os ServiceMonitors serão buscados
    

### Regras exatas (importantes)

- `serviceMonitorSelector: {}` (**objeto vazio**) ⇒ **seleciona todos** os ServiceMonitors (limitados pelos namespaces definidos no item 2).
    
- `serviceMonitorSelector: null` (**nulo**) ⇒ **não seleciona nenhum** ServiceMonitor (modo “desligado”). ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- `serviceMonitorNamespaceSelector: {}` (**objeto vazio**) ⇒ busca ServiceMonitors em **todos os namespaces**.
    
- `serviceMonitorNamespaceSelector: null` (**nulo**, default) ⇒ busca **somente no mesmo namespace** do `Prometheus` CR. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"))
    

> Observação: deixar **todos** os seletores como `null` coloca o Prometheus em modo de **configuração não gerenciada** (você teria de fornecer o `prometheus.yaml.gz` manualmente). Esse comportamento existe, mas é **deprecated**. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))

---

## Exemplos rápidos

### A) Pegar **todos** os ServiceMonitors do cluster

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prom
  namespace: monitoring
spec:
  serviceMonitorSelector: {}                 # todos os SMs
  serviceMonitorNamespaceSelector: {}        # em todos os namespaces
```

(“{} seleciona tudo” para objetos; e “{}” em _NamespaceSelector_ significa todos os namespaces.) ([Stack Overflow](https://stackoverflow.com/questions/52991038/how-to-create-a-servicemonitor-for-prometheus-operator/70453961?utm_source=chatgpt.com "How to create a ServiceMonitor for prometheus-operator?"))

### B) Só ServiceMonitors com `team=payments` em **todos** os namespaces

```yaml
spec:
  serviceMonitorSelector:
    matchLabels:
      team: payments
  serviceMonitorNamespaceSelector: {}
```

Repare que você filtra por rótulo do **ServiceMonitor**, não do Service.

---

## Helm/kube-prometheus-stack (gotchas comuns)

O chart costuma **amarrar** o Prometheus aos ServiceMonitors que têm o rótulo `release: <nome-do-release>`. É frequente ver algo assim no `Prometheus` gerado pelo chart:

```yaml
spec:
  serviceMonitorNamespaceSelector: {}     # todos os NS
  serviceMonitorSelector:
    matchLabels:
      release: prometheus                 # precisa bater no ServiceMonitor
```

Se o seu ServiceMonitor não tiver esse rótulo, ele **não será admitido**. ([GitHub](https://github.com/prometheus-community/helm-charts/issues/3131?utm_source=chatgpt.com "[kube-prometheus-stack] Grafana missing label release"))

Há também a flag de valores do chart:

```yaml
prometheus:
  prometheusSpec:
    serviceMonitorSelectorNilUsesHelmValues: false
```

Definir `...NilUsesHelmValues: false` é uma forma comum de **liberar seleção ampla** sem depender dos rótulos do release do chart. ([GitHub](https://github.com/prometheus-community/helm-charts/issues/1911?utm_source=chatgpt.com "[kube-prometheus-stack] How to configure ..."))

---

## Checklist para diagnosticar “por que meu ServiceMonitor não entra?”

1. **Veja os seletores da sua instância de Prometheus**
    
    ```bash
    kubectl -n monitoring get prometheus -o yaml | yq '.items[].spec | {serviceMonitorSelector, serviceMonitorNamespaceSelector}'
    ```
    
    Confirme se estão `{}` (abrangentes) ou filtrando por `matchLabels`. (Regras acima.) ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
2. **Compare labels**
    
    ```bash
    kubectl get servicemonitors -A -L release,team -o wide
    ```
    
    Garanta que os labels do seu ServiceMonitor **batem** com `serviceMonitorSelector` do Prometheus (ex.: `release: prometheus` quando o chart exige). ([GitHub](https://github.com/prometheus-community/helm-charts/issues/3131?utm_source=chatgpt.com "[kube-prometheus-stack] Grafana missing label release"))
    
3. **Namespaces incluídos**  
    Se o ServiceMonitor está fora do namespace do Prometheus e o `serviceMonitorNamespaceSelector` está **nulo**, ele **não será visto**. Use `{}` (todos) ou um `matchLabels/matchNames` que incluam o namespace desejado. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"), [GitHub](https://github.com/prometheus-operator/prometheus-operator/issues/1331?utm_source=chatgpt.com "serviceMonitorNamespaceSelect..."))
    
4. **Verifique se o SM apareceu na config do Prometheus**  
    O Operator embute o nome do ServiceMonitor na configuração. Você pode “grepar” no Secret de config para confirmar presença. ([Prometheus Operator](https://prometheus-operator.dev/docs/platform/troubleshooting/?utm_source=chatgpt.com "Troubleshooting - Prometheus Operator"))
    

---

Se quiser, me diga como está o seu `Prometheus.spec` hoje (só os campos `serviceMonitor*`) e os labels do seu `ServiceMonitor` que eu monto os valores exatos pra casar.