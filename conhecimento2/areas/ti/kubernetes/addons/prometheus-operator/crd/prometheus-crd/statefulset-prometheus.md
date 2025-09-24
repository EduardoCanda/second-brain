---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Ótima! Quando você cria um **[[prometheus-crd|Prometheus]]** (CRD) com o [[prometheus-operator|Prometheus Operator]], ele reconcilia **um ou mais [[statefulset|StatefulSets]]** que rodam o Prometheus “de verdade”. Eis como isso funciona na prática:

## O que o Operator cria e por quê

- **StatefulSet(s) do Prometheus** no mesmo namespace do CR. Se você usar `shards > 1`, o Operator cria **um StatefulSet por shard** (1 por padrão). O total de pods = `shards × replicas`. ([kubespec.dev](https://kubespec.dev/prometheus-operator/monitoring.coreos.com/v1/Prometheus?utm_source=chatgpt.com "Prometheus Operator Spec"), [GitHub](https://github.com/prometheus-operator/prometheus-operator/issues/3130?utm_source=chatgpt.com "Horizontal scaling via sharding · Issue #3130 · prometheus ..."), [Grafana Labs](https://grafana.com/docs/agent/latest/operator/architecture/?utm_source=chatgpt.com "Architecture | Grafana Agent documentation"))
    
- Um **[[service-headless|Service headless]] “governante”** para o(s) StatefulSet(s). Se você **não** definir `spec.serviceName`, o Operator cria **`prometheus-operated`** e usa esse Service como `serviceName` do StatefulSet (DNS estável, identidade de rede). Você pode fornecer seu próprio Service se quiser. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"), [Stack Overflow](https://stackoverflow.com/questions/69561623/what-does-prometheus-operated-service-do?utm_source=chatgpt.com "What does \"prometheus-operated\" service do?"))
    
- **[[persistent-volume-claim|PVC]] por [[pod]]**: o `spec.storage` do CR gera um `volumeClaimTemplate`; cada réplica recebe seu PVC e mantém dados estáveis através de reinícios. ([Prometheus Operator](https://prometheus-operator.dev/docs/platform/storage/?utm_source=chatgpt.com "Storage - Prometheus Operator"))
    

## O que vai dentro de cada Pod (containers e volumes)

- **Container `prometheus`**: o binário do Prometheus com flags/paths gerados pelo Operator. ([GitHub](https://github.com/prometheus-operator/prometheus-operator?utm_source=chatgpt.com "Prometheus Operator creates/configures/manages ..."))
    
- **Sidecar `prometheus-config-reloader`**: observa os arquivos montados de config/regra e chama `POST /-/reload` no Prometheus quando há mudança (hot-reload). É o mecanismo que torna alterações de [[servicemonitor-crd|ServiceMonitor]]/[[podmonitor-crd|PodMonitor]]/[[prometheus-rule-crd|Rules]] “ao vivo”, sem reiniciar pods. ([Prometheus](https://prometheus.io/docs/prometheus/latest/configuration/configuration/?utm_source=chatgpt.com "Configuration"), [Medium](https://nakamasato.medium.com/how-prometheus-operator-facilitates-prometheus-configuration-updates-a55844186e04?utm_source=chatgpt.com "How Prometheus Operator facilitates ... - Masato Naka"), [Prometheus Operator Runbooks](https://runbooks.prometheus-operator.dev/runbooks/prometheus-operator/configreloadersidecarerrors/?utm_source=chatgpt.com "Config Reloader Sidecar Errors - kube-prometheus runbooks"))
    
- (Opcional) **Thanos sidecar** quando `spec.thanos` está habilitado. ([GitHub](https://github.com/prometheus-operator/prometheus-operator/issues/3664?utm_source=chatgpt.com "Thanos sidecar does reject any requests through service ..."))
    

> Dica: em instalações típicas, o Operator **renderiza a configuração** do Prometheus num Secret e monta no Pod; o `config-reloader` detecta a mudança e aciona o reload. ([Medium](https://nakamasato.medium.com/how-prometheus-operator-facilitates-prometheus-configuration-updates-a55844186e04?utm_source=chatgpt.com "How Prometheus Operator facilitates ... - Masato Naka"), [SegmentFault](https://segmentfault.com/a/1190000040650706?utm_source=chatgpt.com "prometheus-operator源码分析-- prometheus配置自动更新 ..."))

## Como o Operator “alimenta” o StatefulSet

1. Você cria/atualiza **ServiceMonitor/PodMonitor/Probe/ScrapeConfig/PrometheusRule**.
    
2. O Operator reconcilia o **Prometheus CR**, re-gera o arquivo final do Prometheus (scrapes + regras) e atualiza o Secret/volumes.
    
3. O **`prometheus-config-reloader`** detecta a alteração e chama `/-/reload` no Prometheus. Se a config tiver erro, há logs/alertas do reloader (e a config inválida é ignorada). ([GitHub](https://github.com/prometheus-operator/prometheus-operator?utm_source=chatgpt.com "Prometheus Operator creates/configures/manages ..."), [Prometheus Operator Runbooks](https://runbooks.prometheus-operator.dev/runbooks/prometheus-operator/configreloadersidecarerrors/?utm_source=chatgpt.com "Config Reloader Sidecar Errors - kube-prometheus runbooks"))
    

## Shards, réplicas e HA (como se traduz no StatefulSet)

- **`replicas`**: número de pods **idênticos** por shard (HA). Usado para alta disponibilidade (mesmos targets). Combine com deduplicação (por ex., em Thanos/Mimir) ou **remote_write** com dedupe para não duplicar séries. ([GitHub](https://github.com/prometheus-operator/prometheus-operator/issues/3130?utm_source=chatgpt.com "Horizontal scaling via sharding · Issue #3130 · prometheus ..."), [Grafana Labs](https://grafana.com/docs/agent/latest/operator/architecture/?utm_source=chatgpt.com "Architecture | Grafana Agent documentation"))
    
- **`shards`**: **distribui** os targets entre múltiplos StatefulSets (cada shard tem seu próprio conjunto de targets). Ajuda a escalar horizontalmente a coleta. ([kubespec.dev](https://kubespec.dev/prometheus-operator/monitoring.coreos.com/v1/Prometheus?utm_source=chatgpt.com "Prometheus Operator Spec"))
    

## Serviços “operated”

- O **`prometheus-operated`** é **headless** e usado como `serviceName` do(s) StatefulSet(s), provendo identidade estável a cada pod (`A` por ordinal). Você pode trocar por um Service seu via `spec.serviceName`. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"))
    

## Exemplo mínimo (comentado)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: platform
  namespace: observability
spec:
  version: v2.53.0
  replicas: 2          # HA: duas réplicas por shard
  shards: 1            # 1 StatefulSet; aumente para sharding
  scrapeInterval: 30s
  serviceMonitorSelector: {}             # admite todos os ServiceMonitors...
  serviceMonitorNamespaceSelector: {}    # ...de todos os namespaces
  podMonitorSelector: {}                 # idem para PodMonitors (mesmo cuidado)
  ruleSelector: {}                       # todas as PrometheusRules permitidas
  ruleNamespaceSelector: {}
  storage:
    volumeClaimTemplate:
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 100Gi
  # Opcional: usar um Service seu como governante (em vez de prometheus-operated)
  # serviceName: prometheus-platform
```

Esse CRD resulta em **um StatefulSet** com **2 pods** (`replicas:2 × shards:1`) e um PVC por pod. O Operator ainda cria (ou usa) o Service governante. ([Prometheus Operator](https://prometheus-operator.dev/docs/platform/storage/?utm_source=chatgpt.com "Storage - Prometheus Operator"))

## Operação & depuração rápidas

- **Ver os pods/containers**: repare que cada Pod costuma ter `prometheus` + `config-reloader`. ([Medium](https://nakamasato.medium.com/how-prometheus-operator-facilitates-prometheus-configuration-updates-a55844186e04?utm_source=chatgpt.com "How Prometheus Operator facilitates ... - Masato Naka"))
    
- **Prometheus UI**: faça port-forward no Service governante e abra `/targets` para ver se seus SM/PM viraram jobs. ([Medium](https://nakamasato.medium.com/how-prometheus-operator-facilitates-prometheus-configuration-updates-a55844186e04?utm_source=chatgpt.com "How Prometheus Operator facilitates ... - Masato Naka"))
    
- **Erros de reload**: cheque os logs do `config-reloader` (mensagens claras quando a config está inválida). ([Prometheus Operator Runbooks](https://runbooks.prometheus-operator.dev/runbooks/prometheus-operator/configreloadersidecarerrors/?utm_source=chatgpt.com "Config Reloader Sidecar Errors - kube-prometheus runbooks"))
    

Se quiser, te ajudo a comparar o seu `Prometheus.spec` atual com o que o Operator gerou (StatefulSet/Service/PVCs), e ajusto `replicas`, `shards`, storage e selectors para o seu cenário (Linkerd + Gateway API).