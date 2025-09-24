---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Bora! O **Probe** é um CRD do Prometheus Operator pensado para **“blackbox checks”** (HTTP, TCP, ICMP, DNS, gRPC etc.) via **[[blackbox-exporter|blackbox-exporter]]**. Você descreve _o que_ quer sondar (targets) e _quem_ fará a sondagem (o prober), e o Operator gera o job de scrape para o Prometheus. ([Prometheus Operator](https://prometheus-operator.dev/kube-prometheus/kube/blackbox-exporter/?utm_source=chatgpt.com "Blackbox Exporter - Prometheus Operator"), [docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/probe-monitoring-coreos-com-v1.html?utm_source=chatgpt.com "Probe [monitoring.coreos.com/v1] - Monitoring APIs ..."))

# Como o Probe CRD funciona (visão geral)

1. Você **instala um blackbox-exporter** no cluster.
    
2. Cria um **`Probe`** apontando o `spec.prober.url` para o serviço do blackbox-exporter (`/probe`), define o `module` (http_2xx, icmp, dns, …) e diz **quais alvos** testar (estáticos ou descobertos via Ingress).
    
3. Sua instância de **Prometheus** precisa **selecionar** esses `Probe`s com `spec.probeSelector`/`probeNamespaceSelector` no **Prometheus CRD**. ([Prometheus Operator](https://prometheus-operator.dev/kube-prometheus/kube/blackbox-exporter/?utm_source=chatgpt.com "Blackbox Exporter - Prometheus Operator"))
    

> Dica: o Probe CRD é **para blackbox-exporter** (não para node-exporter ou scrapes “normais” — para isso use ServiceMonitor/PodMonitor). ([GitHub](https://github.com/prometheus-operator/prometheus-operator/issues/4026?utm_source=chatgpt.com "Improvement wanted to use the \"Probe\" crd #4026"))

---

# Campos importantes do `Probe`

- **`spec.prober`**: onde está o **blackbox-exporter** (`url` obrigatório) + `scheme`, `path` (default `/probe`), `proxyUrl`. ([Red Hat Docs](https://docs.redhat.com/en/documentation/openshift_container_platform/4.12/html/monitoring_apis/probe-monitoring-coreos-com-v1?utm_source=chatgpt.com "Chapter 5. Probe [monitoring.coreos.com/v1] | ..."))
    
- **`spec.module`**: qual módulo do blackbox usar (ex.: `http_2xx`, `icmp`). Os módulos são definidos na config do blackbox-exporter. ([docs.okd.io](https://docs.okd.io/4.10/rest_api/monitoring_apis/probe-monitoring-coreos-com-v1.html?utm_source=chatgpt.com "Probe [monitoring.coreos.com/v1] - Monitoring APIs ..."))
    
- **`spec.targets`**:
    
    - `staticConfig.static`: lista de hosts/URLs fixos (com `relabelingConfigs` opcionais);
        
    - `ingress`: descobre **Ingress** por label selector; dá para reescrever rótulos e montar a URL usando `tmp_prometheus_ingress_address`. Se ambos forem definidos, **`staticConfig` prevalece**. ([docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/probe-monitoring-coreos-com-v1.html "Probe [monitoring.coreos.com/v1] - Monitoring APIs | API reference | OKD 4"))
        
- **Autenticação/TLS**: o Probe CRD tem `basicAuth`, `authorization`/`oauth2`, `bearerTokenSecret`, `tlsConfig`, _para a chamada ao prober_ (ou seja, para acessar o **blackbox-exporter**). **Não** configuram TLS do alvo — isso vem do **módulo** do blackbox. ([docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/probe-monitoring-coreos-com-v1.html "Probe [monitoring.coreos.com/v1] - Monitoring APIs | API reference | OKD 4"), [GitHub](https://github.com/prometheus-operator/prometheus-operator/issues/5036?utm_source=chatgpt.com "`Probe` config ignored · Issue #5036 · prometheus- ..."))
    
- **Limites e ajustes**: `interval`, `metricRelabelings`, e limites como `sampleLimit`, `label*Limit`, `keepDroppedTargets`. ([docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/probe-monitoring-coreos-com-v1.html "Probe [monitoring.coreos.com/v1] - Monitoring APIs | API reference | OKD 4"))
    

---

# Exemplos práticos

### 1) HTTP 2xx em alvos externos (estático)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Probe
metadata:
  name: http-external
  namespace: observability
  labels: { team: plataforma }
spec:
  # quem vai sondar: seu blackbox-exporter
  prober:
    url: http://blackbox-exporter.observability.svc:19115
    path: /probe
    scheme: http
  module: http_2xx
  interval: 30s
  jobName: blackbox-http
  targets:
    staticConfig:
      static:
        - https://meusite.com
        - https://api.externa.com/health
      relabelingConfigs:
        - action: replace
          sourceLabels: [__address__]
          targetLabel: __param_target   # passa o alvo para o blackbox como ?target=
```

Isso cria um job onde o Prometheus **scrapa o blackbox-exporter**, que por sua vez sonda os targets e expõe métricas como `probe_success`, `probe_duration_seconds`, etc. ([docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/probe-monitoring-coreos-com-v1.html?utm_source=chatgpt.com "Probe [monitoring.coreos.com/v1] - Monitoring APIs ..."))

### 2) Descobrir **Ingress** automaticamente e montar a URL https://

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Probe
metadata:
  name: http-ingress
  namespace: observability
spec:
  prober:
    url: http://blackbox-exporter.observability.svc:19115
  module: http_2xx
  interval: 1m
  targets:
    ingress:
      namespaceSelector: { any: true }          # todos os namespaces
      selector:
        matchLabels:
          monitor: "true"                        # pega só Ingress com esse label
      relabelingConfigs:
        # Constrói a URL final da sonda usando o host do Ingress
        - action: replace
          regex: (.*)
          sourceLabels: [tmp_prometheus_ingress_address]
          replacement: https://$1
          targetLabel: __param_target
```

O campo especial `tmp_prometheus_ingress_address` traz o host/endereço do Ingress para você construir a URL do teste. ([docs.okd.io](https://docs.okd.io/latest/rest_api/monitoring_apis/probe-monitoring-coreos-com-v1.html "Probe [monitoring.coreos.com/v1] - Monitoring APIs | API reference | OKD 4"))

### 3) ICMP (ping) para IPs internos/externos

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Probe
metadata:
  name: icmp-probe
  namespace: observability
spec:
  prober:
    url: http://blackbox-exporter.observability.svc:19115
  module: icmp
  interval: 15s
  targets:
    staticConfig:
      static:
        - 1.1.1.1
        - 8.8.8.8
```

> Lembre-se de habilitar o módulo `icmp` no blackbox-exporter e as capacidades de rede necessárias (ICMP pode requerer privilégios específicos). ([DevOps.dev](https://blog.devops.dev/prometheus-blackbox-exporter-with-kube-prometheus-stack-23a045ccbab2?utm_source=chatgpt.com "Prometheus Blackbox Exporter with kube-prometheus-stack"))

---

# Como o Prometheus “admite” seus Probes

No **Prometheus CRD**, habilite a seleção:

```yaml
spec:
  probeSelector:
    matchLabels:
      team: plataforma
  probeNamespaceSelector: {}   # olha em todos os namespaces
```

Sem isso, os `Probe`s **não entram** na config do Prometheus. (Helm charts como o kube-prometheus-stack às vezes exigem um label tipo `release: <nome>` — ajuste os rótulos para casar.) ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"))

---

# Troubleshooting rápido

- **`up == 0` no job do Probe** → o Prometheus não conseguiu chegar ao **blackbox-exporter**. Revise `spec.prober.url` e se o Service do exporter está “Ready”. ([Appuio Cloud](https://docs.appuio.cloud/user/how-to/monitor-http-endpoints.html?utm_source=chatgpt.com "Monitor HTTP(S) Endpoints Using Blackbox Exporter"))
    
- **Auth/TLS “não funcionam” no alvo** → lembre que `basicAuth`/`tlsConfig` do Probe valem para falar com o **prober**, não com o destino; para regras de TLS/certs do alvo, configure o **módulo** do blackbox. ([GitHub](https://github.com/prometheus-operator/prometheus-operator/issues/5036?utm_source=chatgpt.com "`Probe` config ignored · Issue #5036 · prometheus- ..."))
    
- **Nada aparece em `/targets`** → verifique `probeSelector`/`probeNamespaceSelector` no Prometheus e labels do seu `Probe`. ([Prometheus Operator](https://prometheus-operator.dev/docs/api-reference/api/?utm_source=chatgpt.com "API reference - Prometheus Operator"))
    

---

# Quando escolher **Probe** (vs ServiceMonitor/PodMonitor)

- **Endpoints “de fora”** (SaaS, domínios públicos), _liveness_ HTTP de LB, checagens ICMP/DNS, validação de certificados — tudo **blackbox**.
    
- **ServiceMonitor/PodMonitor** continuam sendo o caminho para **scrapes “brancos”** (exporters e apps que já expõem `/metrics`). ([Prometheus Operator](https://prometheus-operator.dev/kube-prometheus/kube/blackbox-exporter/?utm_source=chatgpt.com "Blackbox Exporter - Prometheus Operator"))
    

Se você quiser, adapto um `Probe` específico para seus Gateways/Ingress (Gateway API + Linkerd) com relabeling certinho e um `values.yaml` do kube-prometheus-stack que já seleciona esses Probes.