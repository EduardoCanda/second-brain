---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Claro! No `kube-prometheus-stack`, a sessão `prometheus:` do `values.yaml` controla **dois níveis**:

1. **Ajudas do chart** (service/ingress, secrets, extras).
    
2. **`prometheus.prometheusSpec`** → vira o **[[prometheus-crd|CRD Prometheus]]** do Operator (é aqui que estão _replicas_, _retention_, _selectors_, _storage_, _remoteWrite_, etc.). O Operator lê esse CRD e gera/atualiza o [[statefulset|StatefulSet]]/[[secret|Secrets]]/[[configmap|ConfigMaps]] do Prometheus. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    

Abaixo, um guia “campo a campo” com exemplos práticos.

---

# Visão de alto nível da chave `prometheus:`

- `enabled`: liga/desliga a criação do Prometheus gerenciado.
    
- `service`, `servicePerReplica`: tipo da Service, portas, e (opcional) uma Service por réplica para cenários de sharding/HA.
    
- `ingress`: expõe a UI do Prometheus (normalmente você protege com OIDC/OAuth2 proxy).
    
- `additionalServiceMonitors` / `additionalPodMonitors`: azuizinhos do chart para criar SM/PM direto via values (útil para pequenos alvos).
    
- `additionalScrapeConfigs`: injeta _blocos_ extras de scrape além dos `ServiceMonitor/PodMonitor/Probe`. (No CRD moderno, recomenda-se usar `spec.additionalScrapeConfigs` em vez do antigo modo “config não gerenciada”.) ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- `prometheusSpec`: **núcleo** — mapeia 1:1 para o `spec` do CRD `Prometheus` (HA, retenção, storage, selectors, etc.). ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    

---

# O que mais importa em `prometheus.prometheusSpec` (com exemplos)

```yaml
prometheus:
  enabled: true

  # Ex.: Service/Ingress (camada Helm)
  service:
    type: ClusterIP
    port: 9090
  ingress:
    enabled: false  # habilite se for expor

  prometheusSpec:
    # HA e distribuição
    replicas: 2                # nº de pods por shard
    shards: 1                  # nº de StatefulSets (sharding horizontal)
    externalLabels:
      cluster: cluster-a       # ótimo para Thanos/multi-cluster

    # Janela de dados
    retention: 15d             # ou...
    retentionSize: 150GB       # (Prometheus respeita o que for "limitante" primeiro)

    # Desempenho e limites
    walCompression: true
    scrapeInterval: 30s
    evaluationInterval: 30s
    scrapeTimeout: 10s
    sampleLimit: 0             # 0 = sem limite global por scrape
    targetLimit: 0

    # Storage (PVC)
    storageSpec:               # mapeado para 'storage' no CRD do Operator
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 200Gi    # tamanho do TSDB por réplica

    # Descoberta via CRDs (escopo!)
    serviceMonitorSelector: {}            # {} = pega todos com SM
    serviceMonitorNamespaceSelector:
      matchLabels: { monitoring: "enabled" }
    podMonitorSelector: {}
    podMonitorNamespaceSelector:
      matchLabels: { monitoring: "enabled" }
    probeSelector: {}
    probeNamespaceSelector:
      matchLabels: { monitoring: "enabled" }

    # Regras e Alertmanager
    ruleSelector: {}                       # quais PrometheusRule entram
    ruleNamespaceSelector:
      matchLabels: { monitoring: "enabled" }
    alerting:
      alertmanagers:
        - namespace: monitoring
          name: kube-prometheus-stack-alertmanager
          port: reloader-web # ou "web", conforme o chart/versão

    # Remote Write (ex.: Mimir, Grafana Cloud, Victoria)
    remoteWrite:
      - url: https://<endpoint>/api/v1/push
        sendExemplars: true
        # auth via Secret referenciado
        basicAuth:
          username:
            name: kubepromsecret
            key: username
          password:
            name: kubepromsecret
            key: password

    # Segurança / runtime
    enableAdminAPI: false
    resources:
      requests: { cpu: "1", memory: "4Gi" }
      limits:   { cpu: "4", memory: "12Gi" }
    nodeSelector: { "kubernetes.io/os": linux }
    tolerations: []
    affinity: {}
```

**Notas importantes (comportamento do CRD):**

- `replicas` e `shards`: o Operator cria **1 StatefulSet por shard**; `replicas` é o tamanho de cada shard (HA intra-shard). ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- `serviceMonitor*/podMonitor*/probe*`: os _selectors_ e _namespaceSelectors_ definem **o escopo de scraping**. `{} = pega tudo`, `null = não pega nada`, seletor vazio é poderoso — use com cuidado em clusters multi-tenant. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- `additionalScrapeConfigs`: recomendado quando você precisa de _jobs_ que **não cabem** em ServiceMonitor/PodMonitor/Probe (ex.: targets externos, file_sd, http_sd) — há inclusive o CRD **ScrapeConfig** para esses casos. ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/?utm_source=chatgpt.com "ScrapeConfig CRD - Prometheus Operator"))
    
- `storageSpec`: no values do chart é `prometheusSpec.storageSpec` (o Operator aplica como `storage` no CRD) — é aqui que você define o PVC. ([GitHub](https://github.com/prometheus-community/helm-charts/issues/2816?utm_source=chatgpt.com "[kube-prometheus-stack] how to use persistent volumes ..."))
    
- `remoteWrite`: o caminho no values é `prometheus.prometheusSpec.remoteWrite` (exemplo oficial da Grafana). ([Grafana Labs](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/kubernetes-monitoring/configuration/config-other-methods/prometheus/remote-write-helm-operator/?utm_source=chatgpt.com "Configure remote_write with Helm and kube-prometheus- ..."))
    

---

## “Checklist” prático por tema

**Alta disponibilidade**

- `replicas: 2` (mínimo para HA).
    
- Considere `topologySpreadConstraints` via `affinity`/`tolerations` para espalhar pods entre zonas.
    
- `servicePerReplica` (nível Helm) pode expor cada réplica individualmente para **sharding externo**/Thanos sidecar.
    

**Retenção & Storage**

- Defina **um** limite primário: _tempo_ (`retention`) **ou** _tamanho_ (`retentionSize`).
    
- Habilite `walCompression: true`.
    
- PVC via `storageSpec.volumeClaimTemplate` (classe, modo, tamanho). ([GitHub](https://github.com/prometheus-community/helm-charts/issues/2816?utm_source=chatgpt.com "[kube-prometheus-stack] how to use persistent volumes ..."))
    

**Escopo de scraping**

- Prefira _namespaces_ com label (`monitoring=enabled`) + `ServiceMonitor/PodMonitor` com uma label (“monitoring=metrics”) — fica previsível e evita dupla raspagem. (Selectors e namespaceSelectors são a base do CRD.) ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    

**Regras & Alertas**

- Coloque regras em `PrometheusRule` e use `ruleSelector`/`ruleNamespaceSelector`.
    
- Configure `alerting.alertmanagers` para apontar pro serviço do Alertmanager.
    

**Longo prazo**

- `remoteWrite` para backend (Mimir/Victoria/Grafana Cloud), ou use Thanos Sidecar (campo `thanos` no `prometheusSpec`) para histórico barato/consulta global. (Thanos é suportado oficialmente pelo Operator.) ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    

**Segurança**

- `enableAdminAPI: false` por padrão.
    
- Use `ingress` do chart + OIDC/OAuth2 proxy se precisar expor a UI.
    

---

## Mini-exemplos prontos

### 1) Produção enxuta (HA, escopo controlado, 15d ou 150 GB)

```yaml
prometheus:
  enabled: true
  prometheusSpec:
    replicas: 2
    shards: 1
    externalLabels: { cluster: cluster-a }
    retention: 15d
    retentionSize: 150GB
    walCompression: true
    scrapeInterval: 30s
    evaluationInterval: 30s
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: ["ReadWriteOnce"]
          resources: { requests: { storage: 200Gi } }
    serviceMonitorSelector: {}
    serviceMonitorNamespaceSelector: { matchLabels: { monitoring: "enabled" } }
    podMonitorSelector: {}
    podMonitorNamespaceSelector: { matchLabels: { monitoring: "enabled" } }
    ruleSelector: {}
    ruleNamespaceSelector: { matchLabels: { monitoring: "enabled" } }
    alerting:
      alertmanagers:
        - namespace: monitoring
          name: kube-prometheus-stack-alertmanager
          port: web
    enableAdminAPI: false
```

### 2) Adicionando um job “manual” (alvo externo)

```yaml
prometheus:
  prometheusSpec:
    additionalScrapeConfigs:
      name: extra-scrape
      key: prometheus-additional.yaml
```

…onde o Secret `extra-scrape` tem a key `prometheus-additional.yaml` com os blocos `scrape_config` (ou use o CRD **ScrapeConfig**). ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/?utm_source=chatgpt.com "ScrapeConfig CRD - Prometheus Operator"))

### 3) Remote write (exemplo oficial Grafana)

```yaml
prometheus:
  prometheusSpec:
    remoteWrite:
      - url: https://<endpoint>/api/v1/push
        basicAuth:
          username: { name: kubepromsecret, key: username }
          password: { name: kubepromsecret, key: password }
```

([Grafana Labs](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/kubernetes-monitoring/configuration/config-other-methods/prometheus/remote-write-helm-operator/?utm_source=chatgpt.com "Configure remote_write with Helm and kube-prometheus- ..."))

---

## Dica final

Os **nomes exatos** de alguns campos do _values_ podem variar ligeiramente por versão do chart, mas o “miolo” (`prometheus.prometheusSpec.*`) segue o **CRD oficial do Operator** — consulte a referência para entender o efeito de cada campo (selectors, shards, storage, etc.). ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))

Se quiser, eu pego seu `values.yaml` atual e te devolvo uma versão “produção” com: HA, PVC certo, escopo de scraping por labels (para seus namespaces), e _remote_write_ (se você já tem Mimir/VM/Grafana Cloud).