---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Bora! O **PodMonitor** é um CRD do [[prometheus-operator|Prometheus Operator]] que diz ao [[Prometheus]] **como descobrir e coletar métricas diretamente de [[pod|Pods]]**, sem depender de [[service]]. Ele seleciona Pods por rótulos, define endpoints/portas dentro do Pod e permite autenticação, [[protocolo-tls|TLS]] e (metric) [[relabeling|relabelings]] — o Operator então traduz tudo isso para a configuração de scrape do Prometheus. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"))

# Quando usar PodMonitor (vs ServiceMonitor)

- **Sem Service:** você quer scrapear Pods que não têm (ou não precisam de) um Service.
    
- **Múltiplos containers/portas por Pod:** quer escolher portas específicas de containers (por nome), ou expor _sidecars_ (ex.: exporters, proxies).
    
- **Mais controle por Pod:** precisa de `metricRelabelings`, `relabelings`, `honorLabels`, `honorTimestamps`, etc., aplicados diretamente na descoberta `role: pod`. ([Documentação Red Hat](https://docs.redhat.com/en/documentation/openshift_container_platform/4.12/html/monitoring_apis/podmonitor-monitoring-coreos-com-v1?utm_source=chatgpt.com "Chapter 4. PodMonitor [monitoring.coreos.com/v1] | ..."))
    

# Como o Prometheus “enxerga” os PodMonitors

Um PodMonitor só é considerado por uma instância de Prometheus se ela **selecionar** esse objeto via `podMonitorSelector` e `podMonitorNamespaceSelector` no **Prometheus CRD** (os seletores do Prometheus podem filtrar por labels e namespaces). Isso é importante em instalações via Helm ([[instalacao-prometheus-kube-stack|kube-prometheus-stack]]), que muitas vezes exigem um label como `release: <nome>`. ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/getting-started/?utm_source=chatgpt.com "Getting Started - Prometheus Operator"), [Stack Overflow](https://stackoverflow.com/questions/68085831/add-podmonitor-or-servicemonitor-outside-of-kube-prometheus-stack-helm-values?utm_source=chatgpt.com "Add PodMonitor or ServiceMonitor outside of kube- ..."))

---

## Campos-chave do `PodMonitor`

- **`.spec.selector`**: LabelSelector para escolher **Pods** (e não Services).
    
- **`.spec.namespaceSelector`**: onde procurar esses Pods; se **omitido**, busca **só no mesmo namespace do PodMonitor**; você pode abrir para todos (`any: true`) ou listar nomes. ([docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/podmonitor-monitoring-coreos-com-v1.html?utm_source=chatgpt.com "PodMonitor [monitoring.coreos.com/v1] - Monitoring APIs ..."))
    
- **`.spec.podMetricsEndpoints[]`**: lista de endpoints a scrappear (cada item pode ter `port`, `path`, `interval`, `scheme`, `tlsConfig`, `authorization`/`oauth2`, `relabelings`, `metricRelabelings`, `honorLabels`, `honorTimestamps`, etc.). ([Documentação Red Hat](https://docs.redhat.com/en/documentation/openshift_container_platform/4.15/html/monitoring_apis/podmonitor-monitoring-coreos-com-v1?utm_source=chatgpt.com "Chapter 6. PodMonitor [monitoring.coreos.com/v1] | ..."))
    
- **Porta:** use **`port`** (nome da porta do container). O antigo `targetPort` está **deprecated** para PodMonitor; prefira `port`. ([Manifests.io](https://www.manifests.io/prometheus%20operator/0.71.2/com.coreos.monitoring.v1.PodMonitorSpecPodmetricsendpoints?linked=PodMonitor.spec.podMetricsEndpoints&utm_source=chatgpt.com "PodMonitor.spec.podMetricsEndpoints - Manifests.io"))
    
- **`podTargetLabels`**: “puxa” certos labels do Pod para as métricas (útil para `pod`, `namespace`, `app`, `version` etc.). ([Manifests.io](https://www.manifests.io/prometheus%20operator/0.71.2/com.coreos.monitoring.v1.PodMonitorSpecPodtargetlabels?linked=PodMonitor.spec.podTargetLabels&utm_source=chatgpt.com "PodMonitor.spec.podTargetLabels - Manifests.io"))
    
- **`attachMetadata.node`**: opcionalmente anexa metadados do Node aos alvos (requer Prometheus ≥ 2.35 e permissões para listar/watch Nodes). ([docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/podmonitor-monitoring-coreos-com-v1.html?utm_source=chatgpt.com "PodMonitor [monitoring.coreos.com/v1] - Monitoring APIs ..."))
    

> Extras úteis: `sampleLimit`, `targetLimit`, `labelLimit`, `labelNameLengthLimit`, `labelValueLengthLimit` (por PodMonitor) e seus equivalentes **enforced*** no Prometheus CR (limites globais). ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"))

---

## Exemplo 1 — Básico (um endpoint no mesmo namespace)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: minha-app-pods
  namespace: apps
  labels:
    team: plataforma
spec:
  selector:
    matchLabels:
      app: minha-app
  podMetricsEndpoints:
    - port: metrics         # nome da porta do container
      path: /metrics
      interval: 30s
```

> Aqui o Prometheus precisa **selecionar** este PodMonitor (via `podMonitorSelector`) e estar autorizado a olhar o namespace `apps` (via `podMonitorNamespaceSelector`, se o Prometheus estiver em outro namespace).

## Exemplo 2 — Multi-namespace + relabeling

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: http-apis
  namespace: observability
spec:
  namespaceSelector:
    matchNames: ["apps", "payments"]   # busca Pods nesses namespaces
  selector:
    matchExpressions:
      - key: metrics
        operator: In
        values: ["enabled"]
  podTargetLabels: ["app", "version"]
  podMetricsEndpoints:
    - port: http-metrics
      path: /metrics
      interval: 15s
      honorLabels: true
      relabelings:                       # exemplo: expondo o nome do container
        - action: replace
          sourceLabels: ["__meta_kubernetes_pod_container_name"]
          targetLabel: "container"
      metricRelabelings:                 # dropa métricas ruidosas
        - action: drop
          regex: "go_.+|process_.+"
          sourceLabels: ["__name__"]
```

Esse modelo funciona muito bem para [[daemonset|DaemonSets]]/[[deployment|Deployments]] com _sidecar_ exporter, ou quando você quer padronizar rótulos vindos direto do Pod. ([Documentação Red Hat](https://docs.redhat.com/en/documentation/openshift_container_platform/4.15/html/monitoring_apis/podmonitor-monitoring-coreos-com-v1?utm_source=chatgpt.com "Chapter 6. PodMonitor [monitoring.coreos.com/v1] | ..."), [Manifests.io](https://www.manifests.io/prometheus%20operator/0.71.2/com.coreos.monitoring.v1.PodMonitorSpecPodtargetlabels?linked=PodMonitor.spec.podTargetLabels&utm_source=chatgpt.com "PodMonitor.spec.podTargetLabels - Manifests.io"))

## Exemplo 3 — TLS e bearer token (moderno)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: secure-svc
  namespace: apps
spec:
  selector:
    matchLabels:
      app: secure-svc
  podMetricsEndpoints:
    - port: https-metrics
      scheme: https
      tlsConfig:
        insecureSkipVerify: false
      authorization:                # use authorization/oauth2 em vez de bearerTokenSecret legacy
        type: Bearer
        credentials:
          name: metrics-token
          key: token
      interval: 30s
```

Os campos de auth/TLS ficam dentro do próprio endpoint. (O `bearerTokenSecret` legado ainda existe, mas a recomendação atual é `authorization`/`oauth2`.) ([Documentação Red Hat](https://docs.redhat.com/en/documentation/openshift_container_platform/4.12/html/monitoring_apis/podmonitor-monitoring-coreos-com-v1?utm_source=chatgpt.com "Chapter 4. PodMonitor [monitoring.coreos.com/v1] | ..."))

---

## Boas práticas e pegadinhas

- **Labels & seletores do [[Prometheus]]:** se o seu PodMonitor “não aparece” em `/targets`, quase sempre é falta de match entre labels (`podMonitorSelector`) e/ou falta de permissão de namespace (`podMonitorNamespaceSelector`). ([Stack Overflow](https://stackoverflow.com/questions/68085831/add-podmonitor-or-servicemonitor-outside-of-kube-prometheus-stack-helm-values?utm_source=chatgpt.com "Add PodMonitor or ServiceMonitor outside of kube- ..."))
    
- **Porta por nome:** nomeie `containerPort` e use esse **nome** em `podMetricsEndpoints[].port` (evita ambiguidade e o uso de `targetPort` deprecado). ([Manifests.io](https://www.manifests.io/prometheus%20operator/0.71.2/com.coreos.monitoring.v1.PodMonitorSpecPodmetricsendpoints?linked=PodMonitor.spec.podMetricsEndpoints&utm_source=chatgpt.com "PodMonitor.spec.podMetricsEndpoints - Manifests.io"))
    
- **[[relabeling|Relabelings]] com parcimônia:** use `metricRelabelings` para reduzir cardinalidade (dropar métricas genéricas ou labels explosivas). ([Documentação Red Hat](https://docs.redhat.com/en/documentation/openshift_container_platform/4.12/html/monitoring_apis/podmonitor-monitoring-coreos-com-v1?utm_source=chatgpt.com "Chapter 4. PodMonitor [monitoring.coreos.com/v1] | ..."))
    
- **Attach node metadata:** habilite `attachMetadata.node: true` se precisar correlacionar métricas com o Node (lembre das permissões). ([docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/podmonitor-monitoring-coreos-com-v1.html?utm_source=chatgpt.com "PodMonitor [monitoring.coreos.com/v1] - Monitoring APIs ..."))
    

Se quiser, me mostre um [[Pod]]/[[Deployment]] real seu (labels + ports) e eu te devolvo o PodMonitor exato, já com relabelings para [[Linkerd]]/[[Micrometer]] do seu cenário.