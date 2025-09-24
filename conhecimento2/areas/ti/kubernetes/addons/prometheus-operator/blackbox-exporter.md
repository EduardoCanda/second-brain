---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
ferramenta: prometheus-operator
categoria: metricas
---
Ótima pergunta! **Blackbox Exporter** é um _exporter_ do [[Prometheus]] que faz **sondagens “de fora” (blackbox)** em alvos — [[protocolo-https|HTTP/HTTPS]], [[protocolo-dns|DNS]], [[introducao-protocolo-tcp|TCP]], [[protocolo-icmp|ICMP]] e **gRPC** — e expõe métricas sobre disponibilidade, latência e erros. Em vez de coletar `/metrics` do próprio serviço (whitebox), ele testa o **comportamento do endpoint** (status HTTP, handshake TLS, ping, resolução DNS etc.). ([GitHub](https://github.com/prometheus/blackbox_exporter?utm_source=chatgpt.com "prometheus/blackbox_exporter: Blackbox prober exporter"))

## Como ele funciona (em 3 passos)

1. Você roda o **blackbox_exporter** (binário, contêiner ou no Kubernetes). ([GitHub](https://github.com/prometheus/blackbox_exporter?utm_source=chatgpt.com "prometheus/blackbox_exporter: Blackbox prober exporter"))
    
2. Ele é configurado por **módulos** no `blackbox.yml` (ex.: `http_2xx`, `icmp`, `tcp_connect`, `dns`, `grpc`). Cada módulo define o tipo da sonda e opções (método HTTP, verificação TLS, timeouts, etc.). ([GitHub](https://github.com/prometheus/blackbox_exporter?utm_source=chatgpt.com "prometheus/blackbox_exporter: Blackbox prober exporter"))
    
3. O **Prometheus** chama o endpoint do exporter (`/probe`) passando `?module=...&target=...`. O exporter executa a sonda e retorna métricas `probe_*` como `probe_success` e `probe_duration_seconds` (e, no caso de HTTPS, coisas como `probe_http_status_code` ou `probe_ssl_earliest_cert_expiry`). ([Prometheus](https://prometheus.io/docs/guides/multi-target-exporter/?utm_source=chatgpt.com "Understanding and using the multi-target exporter pattern"), [Appuio Cloud](https://docs.appuio.cloud/user/how-to/monitor-http-endpoints.html?utm_source=chatgpt.com "Monitor HTTP(S) Endpoints Using Blackbox Exporter - APPUiO Cloud for Users"), [PromLabs](https://promlabs.com/blog/2024/02/06/monitoring-tls-endpoint-certificate-expiration-with-prometheus/?utm_source=chatgpt.com "Blog - Monitoring TLS Endpoint Certificate Expiration with Prometheus"))
    

---

## Configuração mínima

### `blackbox.yml` (módulos)

```yaml
modules:
  http_2xx:
    prober: http
    timeout: 5s
    http:
      preferred_ip_protocol: "ip4"
  icmp:
    prober: icmp
    timeout: 3s
  tcp_connect:
    prober: tcp
    timeout: 5s
```

(Os módulos e chaves variam por prober; veja o README para a lista completa.) ([GitHub](https://github.com/prometheus/blackbox_exporter?utm_source=chatgpt.com "prometheus/blackbox_exporter: Blackbox prober exporter"))

### Job no Prometheus (padrão “multi-target exporter”)

```yaml
- job_name: blackbox-http
  metrics_path: /probe
  params:
    module: [http_2xx]
  static_configs:
    - targets:
      - https://example.com
      - https://api.example.com/health
  relabel_configs:
    - source_labels: [__address__]      # alvo original
      target_label: __param_target      # vira ?target=
    - source_labels: [__param_target]
      target_label: instance            # rótulo humano
    - target_label: __address__         # endereço do exporter
      replacement: blackbox-exporter.monitoring.svc:9115
```

Esse padrão é o recomendado para exporters “multi-alvo” (inclui o Blackbox). ([Prometheus](https://prometheus.io/docs/guides/multi-target-exporter/?utm_source=chatgpt.com "Understanding and using the multi-target exporter pattern"))

### Teste rápido

```bash
curl 'http://blackbox-exporter:9115/probe?module=http_2xx&target=https://example.com'
# espere ver: probe_success 1
```

([Network Startup Resource Center](https://nsrc.org/workshops/2022/rwnog/nmm/netmgmt/en/prometheus/ex-blackbox-exporter.html?utm_source=chatgpt.com "Install blackbox_exporter"))

---

## Principais métricas e alertas

- **Disponibilidade:** `probe_success` (0/1) e `up` do job; **latência total:** `probe_duration_seconds`. ([Appuio Cloud](https://docs.appuio.cloud/user/how-to/monitor-http-endpoints.html?utm_source=chatgpt.com "Monitor HTTP(S) Endpoints Using Blackbox Exporter - APPUiO Cloud for Users"))
    
- **HTTP:** `probe_http_status_code`, tempos por fase; **TLS:** `probe_ssl_earliest_cert_expiry` (ótimo para alerta de expiração). ([Appuio Cloud](https://docs.appuio.cloud/user/how-to/monitor-http-endpoints.html?utm_source=chatgpt.com "Monitor HTTP(S) Endpoints Using Blackbox Exporter - APPUiO Cloud for Users"), [PromLabs](https://promlabs.com/blog/2024/02/06/monitoring-tls-endpoint-certificate-expiration-with-prometheus/?utm_source=chatgpt.com "Blog - Monitoring TLS Endpoint Certificate Expiration with Prometheus"))
    

Exemplos de alertas:

```promql
# Endpoints fora por 5m
probe_success == 0
```

```promql
# Certificado expira em <14 dias
(time() > probe_ssl_earliest_cert_expiry - 14*24*3600)
```

([PromLabs](https://promlabs.com/blog/2024/02/06/monitoring-tls-endpoint-certificate-expiration-with-prometheus/?utm_source=chatgpt.com "Blog - Monitoring TLS Endpoint Certificate Expiration with Prometheus"))

---

## Kubernetes (opcional): integrando com o **Probe CRD**

No K8s, você geralmente instala o blackbox-exporter e cria **`Probe` CRDs** (Prometheus Operator) para gerenciar _targets_ e módulos de forma declarativa; sua instância de Prometheus “admite” esses Probes via `probeSelector`. Há guias prontos de referência. ([Prometheus Operator](https://prometheus-operator.dev/kube-prometheus/kube/blackbox-exporter/?utm_source=chatgpt.com "Blackbox Exporter - Prometheus Operator"))

---

## Casos de uso comuns

- **Uptime/SLO externo** de APIs e sites.
    
- **Expiração de certificados** TLS. ([PromLabs](https://promlabs.com/blog/2024/02/06/monitoring-tls-endpoint-certificate-expiration-with-prometheus/?utm_source=chatgpt.com "Blog - Monitoring TLS Endpoint Certificate Expiration with Prometheus"))
    
- **Ping/TCP/DNS** para checar rede/rota/egress. ([GitHub](https://github.com/prometheus/blackbox_exporter?utm_source=chatgpt.com "prometheus/blackbox_exporter: Blackbox prober exporter"))
    
- **gRPC health** e checagens por trás de balanceadores. ([GitHub](https://github.com/prometheus/blackbox_exporter?utm_source=chatgpt.com "prometheus/blackbox_exporter: Blackbox prober exporter"))
    

---

## Dicas & pegadinhas

- Se `up==0` no alvo do job, o Prometheus **não está alcançando o exporter** (endereço/Service/porta). Se `probe_success==0`, a sonda rodou mas **o alvo falhou**. ([Appuio Cloud](https://docs.appuio.cloud/user/how-to/monitor-http-endpoints.html?utm_source=chatgpt.com "Monitor HTTP(S) Endpoints Using Blackbox Exporter - APPUiO Cloud for Users"))
    
- ICMP pode exigir capacidades elevadas no contêiner (ou usar módulo alternativo). ([GitHub](https://github.com/prometheus/blackbox_exporter?utm_source=chatgpt.com "prometheus/blackbox_exporter: Blackbox prober exporter"))
    
- Para _self-signed_ em HTTPs, ajuste `tls_config` do módulo (ou valide CA). ([GitHub](https://github.com/prometheus/blackbox_exporter?utm_source=chatgpt.com "prometheus/blackbox_exporter: Blackbox prober exporter"))
    

Se quiser, eu já te deixo um pacote K8s com Deployment + Service do blackbox-exporter, um `Probe` HTTP e regras de alerta prontas — é só colar no cluster.