---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
# 0) Descubra o endpoint do [[Loki]]

Veja quais [[service|Services]] existem no namespace do Loki:

```bash
kubectl -n loki get svc
```

- Se existir **`loki-gateway`** (recomendado): use `http://loki-gateway.loki.svc.cluster.local`
    
- Se **não** houver gateway, no modo SingleBinary use: `http://loki.loki.svc.cluster.local:3100`
    

Nos exemplos abaixo vou usar o **gateway**. Se não tiver, troque pela URL do seu Service.

---

# 1) [[fluentbit|Fluent Bit]] → Loki (chart oficial `fluent/fluent-bit`)

Se você já tem uma release do Fluent Bit, é só fazer `upgrade` com este `values`.  
Crie `values-fluent-bit-to-loki.yaml` (formato do chart **fluent/fluent-bit**):

```yaml
# Ajuste o namespace conforme usa (a release abaixo será instalada em "logging")
# Este arquivo envia logs de /var/log/containers para o Loki via gateway.

config:
  service: |
    [SERVICE]
        Flush         5
        Daemon        Off
        Log_Level     info

  inputs: |
    [INPUT]
        Name                tail
        Tag                 kube.*
        Path                /var/log/containers/*.log
        Parser              cri
        Mem_Buf_Limit       50MB
        Skip_Long_Lines     On
        Refresh_Interval    10

  filters: |
    [FILTER]
        Name                kubernetes
        Match               kube.*
        Kube_URL            https://kubernetes.default.svc:443
        Kube_Tag_Prefix     kube.var.log.containers.
        Labels              On
        Annotations         Off

    # (Opcional) dropar logs do próprio stack para evitar ruído
    # [FILTER]
    #     Name    grep
    #     Match   kube.*
    #     Exclude $kubernetes['labels']['app']  ^(loki|grafana|prometheus|fluent-bit)$

  outputs: |
    [OUTPUT]
        Name        loki
        Match       kube.*
        Host        loki-gateway.loki.svc.cluster.local
        Port        80
        URI         /loki/api/v1/push

        # Se o Loki usa multitenancy (auth_enabled=true):
        Tenant_ID   1

        # Labels estáveis (baixa cardinalidade)
        Labels      job=fluentbit, \
                    namespace=$kubernetes['namespace_name'], \
                    app=$kubernetes['labels']['app'], \
                    pod=$kubernetes['pod_name'], \
                    container=$kubernetes['container_name']

        Auto_Kubernetes_Labels Off
        Line_Format json
```

Instalar/atualizar o Fluent Bit (se ainda não tem o repo, adicione):

```bash
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update

# escolha um namespace para o agent (ex.: logging)
kubectl create ns logging 2>/dev/null || true

helm upgrade -i fluent-bit fluent/fluent-bit \
  -n logging -f values-fluent-bit-to-loki.yaml
```

> Usa outro chart do Fluent Bit (por ex. `grafana/fluent-bit`)? Posso te mandar o mesmo conteúdo no formato daquele chart (em chaves `service:`, `input.tail:`, `filters.kubernetes:` etc.). Mas este acima (blocos `[INPUT]/[FILTER]/[OUTPUT]`) funciona direto no **fluent/fluent-bit**.

---

# 2) Smoke tests rápidos

- **Loki pronto?**
    

```bash
kubectl -n loki port-forward svc/loki-gateway 3100:80 >/dev/null 2>&1 &
sleep 1
curl -fsS http://127.0.0.1:3100/ready && echo "Loki OK"
```

- **Fluent Bit enviando?**
    

```bash
kubectl -n logging logs ds/fluent-bit | tail -n +1 | head
# Procure por mensagens de "loki: HTTP status=204" ou ausência de erros 4xx/5xx
```

- **Grafana Explore → Query inicial:**
    

```
{job="fluentbit"} | json
```

ou por app:

```
{namespace="default", app="contas"} |= "ERROR"
```

---

## Notas e pegadinhas comuns

- **URL errada**: se não tem `loki-gateway`, use o Service `loki` na porta **3100**:  
    `url: http://loki.loki.svc.cluster.local:3100` (Grafana)  
    e no Fluent Bit: `Host loki.loki.svc.cluster.local` + `Port 3100`
    
- **Tenant header**: se no seu `values` do Loki `auth_enabled` estiver **false**, remova `Tenant_ID` (Fluent Bit) e os cabeçalhos no data source do Grafana.
    
- **NetworkPolicy**: se houver NP bloqueando tráfego entre namespaces, permita `logging → loki` e `monitoring → loki`.
    
- **Cardinalidade**: mantenha as labels do output enxutas (cluster/namespace/app/pod/container). Evite colocar `request_id` etc. como label.
    