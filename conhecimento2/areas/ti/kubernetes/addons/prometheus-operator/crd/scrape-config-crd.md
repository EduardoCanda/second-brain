---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Ótima! O **ScrapeConfig CRD** é a peça do [[prometheus-operator|Prometheus Operator]] para criar **jobs de [[scrapping|scrape]] “genéricos”** (alvos externos ao cluster, SDs não cobertas por [[servicemonitor-crd]]/[[podmonitor-crd|PodMonitor]]/[[probe-crd|Probe]], ou configs mais avançadas) **sem** editar `prometheus.yml` “na mão”. Você cria objetos `ScrapeConfig`; a(s) sua(s) instância(s) de Prometheus os **selecionam** e o Operator gera a config final. ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"))

# Como o ScrapeConfig entra no Prometheus

No `Prometheus` (ou `PrometheusAgent`) você habilita a coleta desses CRDs via:

```yaml
spec:
  scrapeConfigSelector:
    matchLabels:
      prometheus: meu-prom
  scrapeConfigNamespaceSelector: {}   # todos os namespaces (opcional)
```

- `scrapeConfigSelector` filtra **quais ScrapeConfigs** entram.
    
- `scrapeConfigNamespaceSelector` controla **de quais namespaces** eles podem ser lidos (vazio `{}` = todos; nulo = só o mesmo namespace). ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"), [Manifests.io](https://www.manifests.io/prometheus%20operator/0.71.2/com.coreos.monitoring.v1.PrometheusSpecScrapeconfignamespaceselector?linked=Prometheus.spec.scrapeConfigNamespaceSelector&utm_source=chatgpt.com "Prometheus.spec - . - scrapeConfigNamespaceSelector"))
    

> Pré-requisitos: Operator **> v0.65.1** e o CRD `ScrapeConfig` instalado (reinicie o operator após instalar/atualizar o CRD). ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"))

# O que dá para fazer com ScrapeConfig

Hoje ele suporta vários mecanismos de descoberta, como **static**, **file_sd**, **http_sd**, **kubernetes_sd**, **consul_sd**, além de **dns_sd**, **ec2**, **azure**, **gce**, **openstack**, **docker**, etc. Veja a lista completa no API reference. ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"))

> Nota: o Operator controla o `job_name` para evitar duplicatas; você personaliza o rótulo `job` via relabelings (não por `job_name`). ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))

---

## Exemplos de uso (YAML)

### 1) `static_config` – alvo externo simples

```yaml
apiVersion: monitoring.coreos.com/v1alpha1
kind: ScrapeConfig
metadata:
  name: ext-prom
  labels: { prometheus: meu-prom }
spec:
  staticConfigs:
    - labels: { job: external-prom }
      targets: [ "prometheus.example.com:9090" ]
```

([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"))

### 2) `http_sd` – descoberta dinâmica por HTTP

```yaml
apiVersion: monitoring.coreos.com/v1alpha1
kind: ScrapeConfig
metadata:
  name: http-sd
  labels: { prometheus: meu-prom }
spec:
  httpSDConfigs:
    - url: http://discovery.internal/sd
      refreshInterval: 15s
```

Sem ConfigMap: o endpoint retorna a lista de alvos. ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"))

### 3) `file_sd` – alvos via arquivo montado

Crie um ConfigMap e **monte** no Prometheus (`spec.configMaps`) — depois referencie o caminho:

```yaml
apiVersion: monitoring.coreos.com/v1alpha1
kind: ScrapeConfig
metadata:
  name: file-sd
  labels: { prometheus: meu-prom }
spec:
  fileSDConfigs:
    - files:
        - /etc/prometheus/configmaps/targets/targets.yaml
```

(onde o `Prometheus.spec.configMaps` inclui `targets` para montar o arquivo.) ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"))

### 4) `kubernetes_sd` – descobrir endpoints no K8s (sem SM/PM)

```yaml
apiVersion: monitoring.coreos.com/v1alpha1
kind: ScrapeConfig
metadata:
  name: k8s-endpoints
  labels: { prometheus: meu-prom }
spec:
  kubernetesSDConfigs:
    - role: endpoints
      namespaces:
        names: ["apps","payments"]
  relabelings:
    # mantenha só Services com label app=api
    - action: keep
      sourceLabels: [ __meta_kubernetes_service_label_app ]
      regex: api
```

([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))

---

## Boas práticas / gotchas

- **Seletores corretos**: se os seus ScrapeConfigs “não aparecem”, normalmente é `scrapeConfigSelector`/`scrapeConfigNamespaceSelector` faltando (ou labels que não batem). ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"), [GitHub](https://github.com/prometheus-operator/prometheus-operator/issues/6404?utm_source=chatgpt.com "unclear documentation about ..."))
    
- **File SD** no Operator: lembre de montar o ConfigMap no `Prometheus.spec.configMaps` além do `ScrapeConfig.fileSDConfigs`. ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeconfig/ "ScrapeConfig CRD - Prometheus Operator"))
    
- **Relabelings**: use para filtrar/renomear labels e reduzir cardinalidade (ex.: manter só certas rotas/serviços). (Ver campos `relabelings`/`metricRelabelings` no API.) ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/ "API reference - Prometheus Operator"))
    
- **ScrapeClasses (novo)**: defina **padrões reutilizáveis** (TLS, auth, relabelings) no `Prometheus.spec.scrapeClasses` e aplique em `ServiceMonitor/PodMonitor/ScrapeConfig` via `spec.scrapeClass`. Ajuda muito em cenários com mTLS (Istio/Linkerd). ([Prometheus Operator](https://prometheus-operator.dev/docs/developer/scrapeclass/ "Scrape Classes - Prometheus Operator"))
    