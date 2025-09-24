---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
bora! um **histograma** no [[prometheus]] é um tipo de métrica que registra _distribuições_ (durações, tamanhos, etc.) em **baldes (buckets)**. Ele sempre exporta **três** séries:

- `…_bucket{le="X"}` → contagem acumulada de observações **≤ X**
    
- `…_count` → número total de observações
    
- `…_sum` → soma dos valores observados
    

> O bucket é **acumulativo** (sempre “≤ le”) e sempre existe um bucket `le="+Inf"`.

# Como usar (na prática)

**p95/p99 (latência, tamanho, …)**

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))
)
```

- Use **[[funcao-rate|rate()]]** nos buckets (porque são counters).
    
- **Some por `le`** e pelas dimensões que quer manter (ex.: `route`).
    
- A função **certa** é `histogram_quantile` (não confundir com `quantile`!).
    

**média**

```promql
sum(rate(http_request_duration_seconds_sum[5m]))
/
sum(rate(http_request_duration_seconds_count[5m]))
```

**[[sli-slo-sla|SLI]] “latência abaixo de X ms” (ótimo para SLO/alerta/burn rate)**

```promql
sum(rate(http_request_duration_seconds_bucket{le="0.5"}[5m]))
/
sum(rate(http_request_duration_seconds_count[5m]))
```

> Aqui X = **0.5 s** (ajuste para seu alvo: 100ms, 300ms, 1s…).

**Com [[linkerd]] (por rota)**

```promql
# p95 por rota
histogram_quantile(
  0.95,
  sum by (le, route) (
    rate(outbound_http_route_request_duration_seconds_bucket[5m])
  )
)

# média por rota
sum by (route) (rate(outbound_http_route_request_duration_seconds_sum[5m]))
/
sum by (route) (rate(outbound_http_route_request_duration_seconds_count[5m]))
```

# Onde brilha no dia a dia

- **Latência de HTTP/gRPC/DB** (p95/p99 por serviço/rota).
    
- **Tamanho de payload/resposta** (bucket em bytes).
    
- **Durações de jobs e filas** (tempo de espera/execução).
    
- **SLOs** baseados em _threshold_ (“95% das requisições ≤ 300ms”).
    

# Escolha de buckets (regra de bolso)

1. **Alinhe com SLOs**: inclua _explicitamente_ um bucket no valor do SLO (ex.: `300ms`).
    
2. **Escala geométrica** é um bom começo (ex.: `50ms,100ms,200ms,400ms,800ms,1.6s,…`).
    
3. **10–15 buckets** por métrica costuma equilibrar custo × precisão.
    
4. Cubra o **pior caso** e deixe o `+Inf`.
    
5. **Tráfego baixo?** use janelas maiores em `rate()`/`histogram_quantile` (ex.: `[30m]`).
    

# Resumo vs. Histograma (quando usar qual)

- **Histogram**: permite **agregar entre instâncias/pods** (somar buckets) e calcular pXX global → ideal para **serviços distribuídos** e SLOs.
    
- **Summary**: calcula quantis **no cliente** (alto acerto), porém **não agrega** entre séries — bom localmente, ruim para visão global.
    

# Armadilhas comuns

- Esqueceu `le` no `sum by` → **quantil sai errado**.
    
- Usou `quantile()` (entre séries) em vez de `histogram_quantile()` (entre buckets).
    
- Buckets mal escolhidos → p95 “grudado” em um degrau.
    
- Janela muito curta com pouco tráfego → quantis instáveis (aumente `[range]`).
    

# Dica para Spring Boot + Micrometer (seu stack)

No `application.properties`:

```properties
# habilita histogram para http server
management.metrics.distribution.percentiles-histogram.http.server.requests=true
# define SLAs (cria buckets nesses pontos)
management.metrics.distribution.sla.http.server.requests=100ms,300ms,500ms,1s,2s
```

Depois é só consultar as séries `http_server_requests_seconds_bucket|sum|count`.

Se quiser, mando um “kit” de queries prontas para seu Grafana (p95, p99, erro%, SLI <300ms e alertas de burn rate) usando suas métricas do Linkerd.