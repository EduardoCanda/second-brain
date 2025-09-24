---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Vamos por partes. O **Prometheus CRD** (do Prometheus Operator) descreve, em YAML, _como_ você quer que um [[Prometheus]] rode no cluster. O Operator observa esse objeto e **gera StatefulSets, Services e a configuração do Prometheus** automaticamente — inclusive seleciona [[servicemonitor-crd|_ServiceMonitors]], [[podmonitor-crd|PodMonitors]], [[probe-crd|Probes]], [[scrapping|ScrapeConfigs]] e [[prometheus-rule-crd|PrometheusRules_]] via _label/namespace selectors_. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"))

# O que o Prometheus CRD faz

- **Implanta e atualiza** o Prometheus (StatefulSet) conforme o `spec` do CR. Você controla versão/imagen, réplicas, sharding, intervalos de scrape, storage, etc. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- **Seleciona alvos** via `serviceMonitorSelector`, `podMonitorSelector`, `probeSelector` (e seus pares `*NamespaceSelector`) e, para regras, `ruleSelector`/`ruleNamespaceSelector`. “{}” (objeto vazio) significa **selecionar tudo**; **null** significa **selecionar nada**. Sem `*NamespaceSelector`, busca apenas no **mesmo [[namespace**]] do Prometheus. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- **Gera e guarda** a configuração final em um Secret `prometheus-<nome>`, que você pode inspecionar (útil para debug). ([Prometheus Operator](https://prometheus-operator.dev/docs/platform/troubleshooting/?utm_source=chatgpt.com "Troubleshooting - Prometheus Operator"))
    

# Campos importantes do `spec` (resumo)

- `replicas`: réplicas por _shard_.
    
- `shards`: número de _shards_ para distribuir targets (HA horizontal). Total de pods = `replicas × shards`. Por padrão `replicas=1`, `shards=1`. Scrape interval padrão: **30s**. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- `externalUrl`/`routePrefix`: URLs corretas quando há Ingress/Proxy. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- `storage`: define PVC/Retention (também dá para usar `retention`/`retentionSize` quando exposto). ([Prometheus Operator](https://prometheus-operator.dev/docs/platform/storage/ "Storage - Prometheus Operator"), [kubespec.dev](https://kubespec.dev/prometheus-operator/monitoring.coreos.com/v1/Prometheus?utm_source=chatgpt.com "Prometheus Operator Spec"))
    
- `remoteWrite`: envia métricas para TSDB externo (Grafana Cloud, Thanos Receiver, etc.). ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- `additionalScrapeConfigs`: anexa _scrape jobs_ em YAML a partir de um Secret (útil para targets fora do Kubernetes). Hoje também existe o **ScrapeConfig CRD** com `scrapeConfigSelector`, preferível para cenários mais complexos. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- `thanos`: ativa o **sidecar do Thanos** e (opcionalmente) envia blocos a _object storage_. ([Prometheus Operator](https://prometheus-operator.dev/docs/platform/thanos/ "Thanos - Prometheus Operator"))
    

---

## Exemplos práticos

### 1) Prometheus com seleção de _monitors_ e regras (multi-namespace) + HA básico

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: platform
  namespace: observability
spec:
  version: v2.53.0
  replicas: 2              # 2 réplicas por shard (HA)
  shards: 1
  scrapeInterval: 30s
  externalUrl: https://prometheus.example.com
  storage:
    volumeClaimTemplate:
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 100Gi

  # Seleciona TODOS os ServiceMonitors com label team=platform em QUALQUER namespace
  serviceMonitorSelector:
    matchLabels:
      team: platform
  serviceMonitorNamespaceSelector: {}

  # Seleciona PodMonitors com a mesma label, mas só no mesmo namespace (sem *NamespaceSelector)
  podMonitorSelector:
    matchLabels:
      team: platform

  # Seleciona PrometheusRules com duas labels, em namespaces que tenham label env=prod
  ruleSelector:
    matchLabels:
      team: platform
      role: alerts
  ruleNamespaceSelector:
    matchLabels:
      env: prod

  # Enviar alertas a um Alertmanager (ex.: o operated service)
  alerting:
    alertmanagers:
      - namespace: observability
        name: alertmanager-operated
        port: web

  # Labels externos (úteis para federation/Thanos/remoteWrite)
  externalLabels:
    cluster: production-a
```

- Note como `serviceMonitorNamespaceSelector: {}` abre a seleção para **todos os namespaces**, enquanto `podMonitorSelector` (sem namespace selector) fica **restrito ao mesmo namespace**. E `ruleSelector`/`ruleNamespaceSelector` controlam **quais PrometheusRules** entram. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    

### 2) Acrescentar _scrape_ “manual” (fora de K8s) com `additionalScrapeConfigs`

Crie o Secret com o YAML dos jobs:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: extra-scrapes
  namespace: observability
stringData:
  additional-scrape-configs.yaml: |
    - job_name: blackbox-external
      metrics_path: /probe
      params:
        module: [http_2xx]
      static_configs:
      - targets:
        - https://meu-servico-externo.com
      relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter.observability.svc:9115
```

E referencie no CR:

```yaml
spec:
  additionalScrapeConfigs:
    name: extra-scrapes
    key: additional-scrape-configs.yaml
```

O Operator **anexa** esses jobs ao que foi gerado via [[Service]]/[[podmonitor-crd]]/Probe. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))

> Alternativa moderna: usar **[[scrape-config-crd|ScrapeConfig CRD]]** e selecionar com `scrapeConfigSelector`, especialmente para `http_sd`, `file_sd`, `kubernetes_sd` etc. ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"))

### 3) Ativar Thanos Sidecar (upload para objeto)

```yaml
spec:
  thanos:
    image: quay.io/thanos/thanos:v0.28.1
    objectStorageConfig:
      name: thanos-objstore-config
      key: thanos.yaml
```

O sidecar envia blocos a cada ~2h para o bucket e desabilita a compactação local (o **Thanos Compactor** assume). ([Prometheus Operator](https://prometheus-operator.dev/docs/platform/thanos/ "Thanos - Prometheus Operator"))

---

## Fluxo de seleção (mental model)

1. O Operator lê seu `Prometheus` **e** todos os `ServiceMonitors/PodMonitors/Probes/PrometheusRules/ScrapeConfigs`.
    
2. Aplica os _label selectors_ (`matchLabels`/`matchExpressions`).
    
3. Aplica os _namespace selectors_: sem eles → **mesmo namespace**; `{}` → **todos os namespaces**; com `matchLabels` → **namespaces filtrados por label**.
    
4. Gera `prometheus.yaml` e injeta no Secret `prometheus-<nome>`; o [[StatefulSet]] é atualizado se necessário. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    

---

## Dicas e pegadinhas de produção

- **Nil vs `{}`**:
    
    - `serviceMonitorSelector: null` → **não seleciona nada**;
        
    - `serviceMonitorSelector: {}` → **seleciona todos** (respeitando `*NamespaceSelector`). Mesma lógica para `podMonitorSelector`, `probeSelector`, `ruleSelector`. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
        
- **Somente este namespace por padrão**: quer “cluster-wide”? Use `serviceMonitorNamespaceSelector: {}` (idem para `scrapeConfigNamespaceSelector` e `ruleNamespaceSelector`). ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- **kube-prometheus-stack (Helm)**: por padrão, o chart costuma amarrar os selectors aos rótulos do _release_, o que faz o Prometheus enxergar apenas _monitors_ com esses rótulos. Desative/ajuste (ex.: `serviceMonitorSelectorNilUsesHelmValues: false`) se quiser captar _monitors_ fora do release. _Essa é uma convenção do chart, não do Operator._ ([Stack Overflow](https://stackoverflow.com/questions/66875139/how-to-configure-kube-prometheus-stack-helm-installation-to-scrape-a-kubernetes?utm_source=chatgpt.com "How to configure kube-prometheus-stack helm installation ..."), [GitHub](https://github.com/prometheus-community/helm-charts/issues/1727?utm_source=chatgpt.com "[prometheus-kube-stack] confusion in service discovery ..."))
    
- **Debug**: ver se um ServiceMonitor entrou mesmo:
    
    ```bash
    kubectl -n observability get secret prometheus-platform -ojson \
      | jq -r '.data["prometheus.yaml.gz"]' | base64 -d | gunzip | grep my-service-monitor
    ```
    
    Ou faça `port-forward` no `prometheus-operated` e cheque **Status → Targets**. ([Prometheus Operator](https://prometheus-operator.dev/docs/platform/troubleshooting/?utm_source=chatgpt.com "Troubleshooting - Prometheus Operator"))
    
- **Escala e sharding**: `replicas` dá HA; `shards` divide targets entre pods (sem _resharding_ automático de dados ao mudar shards). Para consulta global, use Thanos ou centralize via `remoteWrite`. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    

Se quiser, adapto um `values.yaml` do **kube-prometheus-stack** para o seu cenário (Linkerd, Gateway API e scrapes de múltiplos namespaces) e te devolvo um exemplo pronto pra aplicar.