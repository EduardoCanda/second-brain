---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Beleza! Aqui vai um guia **opinado e passo a passo** para instalar o [[prometheus-operator|Prometheus Operator]] via [[Helm]] usando o chart **kube-prometheus-stack** (prometheus-community). Já inclui dicas de HA, segurança, multi-cluster e integração com [[Linkerd]]/[[Micrometer]].

---

# 0) Pré-requisitos e decisões

- **Helm v3** instalado e acesso admin ao cluster.
    
- **Namespace** dedicado (ex.: `monitoring`).
    
- **StorageClass** disponível para PVC ([[Prometheus]]/[[Alertmanager]]/[[Grafana]]).
    
- Defina:
    
    - **Retenção** (tempo/tamanho),
        
    - **Alta disponibilidade** (réplicas),
        
    - **Escopo de scraping** (quais namespaces/targets),
        
    - **Rótulos** para descobrir ServiceMonitor/PodMonitor (evite “pegar tudo” em clusters multi-tenant),
        
    - **Integração longa duração** (Thanos/Mimir/VictoriaMetrics) e/ou **federation/remote_write**,
        
    - **Ingress/autenticação** (Grafana/Prometheus/Alertmanager),
        
    - **NetworkPolicies** (permitir scraping somente do Prometheus).
        

---

# 1) Preparar o [[namespace]] e o repositório Helm

```bash
kubectl create namespace monitoring

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# (opcional) gere um esqueleto de values para editar
helm show values prometheus-community/kube-prometheus-stack > values.yaml
```

---

# 2) Values.yaml (opiniões de produção)

Use como base; ajuste para seu cluster.

```yaml
global:
  scrape_interval: 30s
  scrape_timeout: 10s
  evaluation_interval: 30s

## Prometheus
prometheus:
  ingress:
    enabled: false  # habilite se quiser expor
  prometheusSpec:
    replicas: 2                       # HA em par
    replicaExternalLabelName: replica
    externalLabels:
      cluster: cluster-a              # MUITO útil p/ multi-cluster e Thanos
    retention: 15d                    # ou defina retenção por tamanho
    retentionSize: 150GB
    walCompression: true
    enableAdminAPI: false
    resources:
      requests: { cpu: "1", memory: "4Gi" }
      limits:   { cpu: "4", memory: "12Gi" }
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3        # troque pela sua StorageClass
          accessModes: ["ReadWriteOnce"]
          resources: { requests: { storage: 200Gi } }

    ## Escopo de descoberta (recomendado explícito em multi-tenant)
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false
    probeSelectorNilUsesHelmValues: false
    serviceMonitorSelector:
      matchLabels:
        monitoring: "metrics"
    podMonitorSelector:
      matchLabels:
        monitoring: "metrics"
    probeSelector:
      matchLabels:
        monitoring: "metrics"

    ## Descobrir objetos em namespaces com essa label
    serviceMonitorNamespaceSelector:
      matchLabels:
        monitoring: "enabled"
    podMonitorNamespaceSelector:
      matchLabels:
        monitoring: "enabled"
    probeNamespaceSelector:
      matchLabels:
        monitoring: "enabled"

    ## (opcional) Remote write para long-term storage
    # remoteWrite:
    #   - url: https://mimir.example/api/v1/push
    #     sendExemplars: true
    #     queue_config: { capacity: 5000, max_shards: 10 }

## Alertmanager
alertmanager:
  alertmanagerSpec:
    replicas: 3
    resources:
      requests: { cpu: "100m", memory: "256Mi" }
      limits:   { cpu: "500m", memory: "1Gi" }
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: ["ReadWriteOnce"]
          resources: { requests: { storage: 10Gi } }

  config:
    route:
      receiver: "default"
      group_by: ["alertname","cluster","namespace"]
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 4h
    receivers:
      - name: "default"
        # Exemplo Slack:
        # slack_configs:
        #   - api_url: "<webhook>"
        #     channel: "#alerts"

## Grafana
grafana:
  adminPassword: "troque-isto"
  defaultDashboardsEnabled: true
  persistence:
    enabled: true
    size: 10Gi
    storageClassName: gp3
  ingress:
    enabled: false  # habilite e proteja com OIDC/OAuth2
  sidecar:
    dashboards:
      enabled: true
    datasources:
      enabled: true

## Exporters e componentes básicos
kubeStateMetrics: { enabled: true }
nodeExporter:     { enabled: true }
prometheus-node-exporter: { hostRootfs: true }

## (opcional) Thanos Sidecar (para longo prazo/consulta global)
# thanosRuler: { enabled: false }
# prometheus:
#   prometheusSpec:
#     thanos:
#       image: quay.io/thanos/thanos:v0.36.0
#       objectStorageConfig:  # Secret com credenciais do bucket
#         existingSecret: thanos-objstore
```

> Estratégia de seleção: só serão coletados `ServiceMonitor/PodMonitor/Probe` em **namespaces** com `monitoring=enabled` e **objetos** com `monitoring=metrics`. Isso dá controle fino em multi-tenant.

---

# 3) Instalar

```bash
helm install kube-prometheus-stack \
  prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  -f values.yaml
```

**Verificar:**

```bash
kubectl get pods -n monitoring
kubectl get crds | grep monitoring.coreos.com
```

---

# 4) Habilitar scraping dos seus apps (Micrometer/Spring)

1. **Rotule o namespace** do app:
    

```bash
kubectl label ns minha-app monitoring=enabled
```

2. **Exponha Service com porta/rota de métricas** (ex.: `/actuator/prometheus`):
    

```yaml
apiVersion: v1
kind: Service
metadata:
  name: minha-app
  namespace: minha-app
  labels:
    app.kubernetes.io/name: minha-app
spec:
  selector:
    app.kubernetes.io/name: minha-app
  ports:
    - name: http-metrics
      port: 8080
      targetPort: 8080
```

3. **Crie o ServiceMonitor** (note as labels de seleção):
    

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: minha-app
  namespace: minha-app
  labels:
    monitoring: metrics
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: minha-app
  namespaceSelector:
    matchNames: ["minha-app"]
  endpoints:
    - port: http-metrics
      path: /actuator/prometheus
      interval: 30s
      scrapeTimeout: 10s
```

> Dica: padronize **nome da porta = `http-metrics`** e **path** nas apps para simplificar os manifests.

---

# 5) Integração com **Linkerd**

- Métricas do **proxy**: porta **4191**, path `/metrics`. Exemplo:
    

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: linkerd-proxy
  namespace: linkerd
  labels: { monitoring: metrics }
spec:
  namespaceSelector:
    matchNames: ["linkerd","linkerd-viz"]
  selector:
    matchExpressions:
      - key: linkerd.io/control-plane-ns
        operator: In
        values: ["linkerd"]
  podMetricsEndpoints:
    - port: linkerd-admin  # nome da porta do proxy
      path: /metrics
      interval: 30s
      scrapeTimeout: 10s
```

- **Cardinalidade**: cuidado — métricas por pod/route podem crescer rápido. Se já usa o **Linkerd Viz**, você pode **federar** só agregados ou escolher **não** raspar todos os proxies para evitar custo.
    

---

# 6) Segurança e acesso

- **NetworkPolicy**: permita tráfego **somente** do `namespace=monitoring` para pods que expõem métricas.
    
- **RBAC**: o chart já cria as permissões necessárias; evite alterações amplas.
    
- **Ingress**: se expor Grafana/Prometheus/Alertmanager, proteja com **OIDC**/OAuth2 proxy.
    
- **Secrets**: guarde senhas/tokens fora do values (SealedSecrets/External Secrets).
    

---

# 7) HA, upgrades e CRDs

- **Prometheus/Alertmanager** com réplicas (2/3) para **alta disponibilidade**.
    
- **CRDs**: ao atualizar o chart, CRDs podem mudar. Planeje **janela de manutenção** e aplique CRDs conforme release notes. Em GitOps (Argo CD), trate **CRDs** como **app separada** para evitar drift em hooks.
    
- **Recursos**: comece modesto e observe `tsdb_head_series`, `scrape_samples_scraped`, GC do Go e tempo de query para dimensionar CPU/RAM.
    

---

# 8) Longo prazo e multi-cluster

- **Thanos** (sidecar + Store + Compactor + Query/Query-Front) para histórico barato e **consulta global** (vários clusters).
    
- **Remote write** para **Mimir/VictoriaMetrics/Cortex** se preferir pipeline push.
    
- Sinalize `externalLabels.cluster=<nome>` em **todos** os clusters.
    

---

# 9) Dashboards e Alertas

- O chart já traz dashboards e regras base.
    
- Adicione suas **recording rules** (ex.: p95/p99) e **alertas de SLO** via `prometheusRule`.
    
- Padronize rótulos (service, job, app, env) para queries limpas no Grafana.
    

Exemplo de **PrometheusRule** simples:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: minha-app.rules
  namespace: minha-app
  labels: { monitoring: metrics }
spec:
  groups:
    - name: http-latency
      rules:
        - record: http_server_request_duration_seconds:p95
          expr: histogram_quantile(0.95, sum by (le, app, route, method) (
                  rate(http_server_requests_seconds_bucket[5m])
                ))
```

---

# 10) Verificação rápida

```bash
kubectl -n monitoring port-forward svc/kube-prometheus-stack-prometheus 9090 &
open http://localhost:9090/targets

kubectl -n monitoring port-forward svc/kube-prometheus-stack-grafana 3000 &
# login com admin / senha do values
```

---

## Problemas comuns (e como evitar)

- **Nada aparece em Targets**: confira labels do Service/ServiceMonitor e seletores no `values.yaml`.
    
- **Muito scrape** (alto custo): restrinja `NamespaceSelector` e `Selector` por labels.
    
- **CRD desatualizado**: aplique CRDs do chart antes do upgrade.
    
- **Series explode**: revise cardinalidade (labels como `path`, `user_id` etc.). Faça **aggregation**/`drop` no exportador ou `metric_relabel_configs` (via extraScrapeConfigs, se necessário).
    

[[valores-prometheus-operator-comentarios]]