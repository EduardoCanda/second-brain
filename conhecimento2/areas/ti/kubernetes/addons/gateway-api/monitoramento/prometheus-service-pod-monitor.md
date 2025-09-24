---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
ferramenta: gatewayapi
categoria: metricas
---
bora — aqui vai um passo-a-passo enxuto para **coletar métricas do [[funcionamento-ngf|NGINX Gateway Fabric (NGF)]]** com [[prometheus-operator|Prometheus (Operator)]], usando **[[servicemonitor-crd|ServiceMonitor]]** (ou **[[podmonitor-crd|PodMonitor]]** se você preferir raspar direto dos [[pod|pods]]).

# TL;DR

- Habilite o **endpoint `/metrics`** no NGF e **exponha a porta** (geralmente `9113`). ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-architecture/?utm_source=chatgpt.com "Gateway architecture | NGINX Documentation"))
    
- Se o chart criar/expuser um **[[Service]]** com a porta `metrics`, use **ServiceMonitor**; se não houver Service, use **PodMonitor**. ([docs.nginx.com](https://docs.nginx.com/nginx-ingress-controller/logging-and-monitoring/prometheus/?utm_source=chatgpt.com "Enable Prometheus metrics | NGINX Documentation"), [docs.rackspacecloud.com](https://docs.rackspacecloud.com/prometheus-nginx-gateway/?utm_source=chatgpt.com "NGINX Gateway Fabric Monitoring - Rackspace OpenStack Flex"))
    
- O endpoint padrão é `/metrics` e o porto típico é `9113` (ajustável por valores do chart/exporter). ([docs.nginx.com](https://docs.nginx.com/nginx-ingress-controller/logging-and-monitoring/prometheus/?utm_source=chatgpt.com "Enable Prometheus metrics | NGINX Documentation"), [GitHub](https://github.com/nginx/nginx-prometheus-exporter?utm_source=chatgpt.com "NGINX Prometheus Exporter for NGINX and NGINX Plus"))
    

---

## 0) Pré-requisitos

- Você está usando **Prometheus Operator** (CRDs `ServiceMonitor`/`PodMonitor` instaladas) e o seu `Prometheus` está configurado para **selecionar** esses monitores (ex.: `serviceMonitorSelector: {}` e/ou `podMonitorSelector: {}`). ([docs.nginx.com](https://docs.nginx.com/nginx-ingress-controller/logging-and-monitoring/prometheus/?utm_source=chatgpt.com "Enable Prometheus metrics | NGINX Documentation"))
    

---

## 1) Habilite métricas no NGF e exponha a porta

No Helm values do **NGINX Gateway Fabric**, habilite métricas e exponha a porta `metrics` no Service. (Os nomes variam um pouco por versão; exemplo abaixo segue o padrão visto na comunidade.)

```yaml
# values-ngf.yaml
metrics:
  enable: true            # habilita o /metrics no data plane

service:
  create: true
  ports:
    - name: http
      port: 80
      targetPort: 80
    - name: https
      port: 443
      targetPort: 443
    - name: metrics        # <— nome que o ServiceMonitor vai usar
      port: 9113           # <— típico; ajuste se mudou no chart
      targetPort: 9113
```

> Notas  
> • O NGF expõe métricas no **`/metrics`**; a porta padrão costuma ser **`9113`**, mas é configurável no chart. ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-architecture/?utm_source=chatgpt.com "Gateway architecture | NGINX Documentation"))  
> • Exemplo real (discussão do projeto) usa `metrics.enable: true` + porta `9113` no Service. ([GitHub](https://github.com/nginx/nginx-gateway-fabric/discussions/3171?utm_source=chatgpt.com "How to display HTTPRoute requests status on Grafana ..."))

Aplicar/atualizar:

```bash
helm upgrade -i nginx-gateway oci://ghcr.io/nginx/charts/nginx-gateway-fabric \
  -n nginx-gateway --create-namespace -f values-ngf.yaml
```

Teste rápido do endpoint:

```bash
kubectl -n nginx-gateway port-forward svc/nginx-gateway 9113:9113 &
curl -sf localhost:9113/metrics | head
```

---

## 2) ServiceMonitor (recomendado quando há Service de métricas)

Crie um **ServiceMonitor** que aponte para o **Service** do NGF, porta `metrics`. Ajuste os selectors para o seu ambiente (rótulos do Service e namespaces).

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: ngf-metrics
  namespace: ${PROM_NAMESPACE:=monitoring}
  labels:
    release: prometheus        # <— combine com o seu Prometheus (se ele filtra por label)
spec:
  namespaceSelector:
    matchNames: ["nginx-gateway"]   # ns onde está o Service do NGF
  selector:
    matchLabels:
      app.kubernetes.io/name: nginx-gateway-fabric   # labels do Service do NGF
  endpoints:
    - port: metrics          # <— DEVE bater com o nome da porta do Service
      path: /metrics
      interval: 30s
      scrapeTimeout: 10s
      scheme: http
```

> Dica: alguns charts/instalações expõem o Service com rótulos como `app.kubernetes.io/name=nginx-gateway-fabric` e `app.kubernetes.io/instance=<release>`. Ajuste o `matchLabels` conforme o seu Service. (A ideia e uso do **ServiceMonitor** são os mesmos que os recomendados pela doc NGINX/Prometheus Operator.) ([docs.nginx.com](https://docs.nginx.com/nginx-ingress-controller/logging-and-monitoring/prometheus/?utm_source=chatgpt.com "Enable Prometheus metrics | NGINX Documentation"))

---

## 3) Alternativa: PodMonitor (quando você prefere raspar direto dos pods)

Se você **não** criou um Service de métricas (ou prefere mirar nos pods), use **PodMonitor**:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: ngf-pods
  namespace: ${PROM_NAMESPACE:=monitoring}
  labels:
    release: prometheus
spec:
  namespaceSelector:
    matchNames: ["nginx-gateway"]         # ns dos pods do data plane do NGF
  selector:
    matchLabels:
      app.kubernetes.io/name: nginx-gateway-fabric  # labels do Deployment/Pods
  podMetricsEndpoints:
    - port: metrics            # nome da porta no contêiner/pod, se nomeada
      path: /metrics
      interval: 30s
      scrapeTimeout: 10s
      scheme: http
```

> Vários guias mostram **PodMonitor** para NGF quando não há Service dedicado às métricas. ([docs.rackspacecloud.com](https://docs.rackspacecloud.com/prometheus-nginx-gateway/?utm_source=chatgpt.com "NGINX Gateway Fabric Monitoring - Rackspace OpenStack Flex"))

---

## 4) Verificação no Prometheus

- Em **Status → Targets**, você deve ver algo como `ngf-metrics/0 (up)` com **endpoint `/metrics`**.
    
- Se aparecer `down` com `connection refused`, confirme: porta `9113` exposta, `metrics.enable` ligado e rótulos/namespace do selector. (O endpoint e a porta padrão são `/metrics` e `9113`.) ([docs.nginx.com](https://docs.nginx.com/nginx-ingress-controller/logging-and-monitoring/prometheus/?utm_source=chatgpt.com "Enable Prometheus metrics | NGINX Documentation"))
    

---

## 5) Queries de fumaça (PromQL)

Dependendo se você está em NGINX OSS + exporter ou NGINX Plus, as séries variam. Exemplos comuns:

```promql
# Conexões ativas no NGINX (exporter/OSS)
nginx_connections_active

# Requests por segundo (delta curto)
rate(nginx_http_requests_total[1m])

# Latência (quando disponível via métricas do proxy/controller)
histogram_quantile(0.95, sum by (le) (rate(nginx_ingress_controller_request_duration_seconds_bucket[5m])))
```

> NGF com **NGINX Plus** expõe métricas adicionais; o blog/notes destacam ganhos de observabilidade. ([F5, Inc.](https://www.f5.com/company/blog/nginx/announcing-nginx-gateway-fabric-release-1-2-0?utm_source=chatgpt.com "Announcing NGINX Gateway Fabric Release 1.2.0"))

---

### Dicas finais

- **Nome da porta** no Service/Pod tem que bater com o `port:` / `podMetricsEndpoints.port:` do monitor.
    
- Se o Prometheus **filtra por labels** nos selectors (`serviceMonitorSelector`/`podMonitorSelector`), lembre de **etiquetar** o monitor com os rótulos exigidos (ex.: `release: prometheus`). ([docs.nginx.com](https://docs.nginx.com/nginx-ingress-controller/logging-and-monitoring/prometheus/?utm_source=chatgpt.com "Enable Prometheus metrics | NGINX Documentation"))
    
- O **endpoint `/metrics`** fica no **pod do data plane do NGF** (o NGINX Worker); é isso que você está raspando. ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-architecture/?utm_source=chatgpt.com "Gateway architecture | NGINX Documentation"))
    

Se quiser, me manda um `kubectl get svc -n nginx-gateway -l app.kubernetes.io/name=nginx-gateway-fabric -o yaml` e eu te devolvo o **ServiceMonitor** já com os `matchLabels` corretos pro seu cluster.