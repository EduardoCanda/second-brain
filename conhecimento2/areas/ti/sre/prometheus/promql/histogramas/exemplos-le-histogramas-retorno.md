---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
perfeito — bora ver **queries + saídas de exemplo** lado a lado. Vou usar um cenário fictício mas consistente: rota **`/checkout`**, duas instâncias (`api-0`, `api-1`), janela de **5m**. No período ocorreram **500** requisições no total (240 na A e 260 na B).

# 1) [[instant-vector|Instant]] → [[funcao-rate|rate]]() → `sum by`

## (a) Instant (counter “cru”)

```promql
http_requests_total{job="api", route="/checkout"}
```

Exemplo de retorno:

```
{job="api", instance="api-0", route="/checkout"}  1_234_560
{job="api", instance="api-1", route="/checkout"}  1_235_820
```

> Valor acumulado desde o início do processo — **não é RPS**.

## (b) `rate()` (taxa por segundo por instância)

```promql
rate(http_requests_total{job="api", route="/checkout"}[5m])
```

Supondo aumentos de 240 e 260 no período:

- `api-0`: 240 / 300s = **0,800 rps**
    
- `api-1`: 260 / 300s = **0,867 rps**  
    Retorno:
    

```
{job="api", instance="api-0", route="/checkout"}  0.800
{job="api", instance="api-1", route="/checkout"}  0.867
```

## (c) [[funcao-sum-by|sum by]] (agregando as instâncias)

```promql
sum by (job, route) (
  rate(http_requests_total{job="api", route="/checkout"}[5m])
)
```

Soma: 0,800 + 0,867 = **1,667 rps**

```
{job="api", route="/checkout"}  1.667
```

---

# 2) [[histogramas-prometheus|Histogramas]] na prática (usando `le`)

Suponha, nos mesmos 5m, buckets cumulativos (A+B):

```
≤0.10s: 130   ≤0.20s: 260   ≤0.30s: 410   ≤0.50s: 470   ≤1s: 497   +Inf: 500
```

## (a) p95 com `histogram_quantile`

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (
    rate(http_request_duration_seconds_bucket{job="api", route="/checkout"}[5m])
  )
)
```

Cálculo (intuição): 95% de 500 = **475** → cai no bucket **(0.5, 1]** (porque ≤0.5=470 e ≤1=497).  
Interpolando, p95 ≈ **0,593 s** (≈ **593 ms**).

```
{route="/checkout"}  0.593
```

## (b) % de requisições **≤ 300 ms**

```promql
sum by (route) (
  rate(http_request_duration_seconds_bucket{route="/checkout", le="0.3"}[5m])
)
/
sum by (route) (
  rate(http_request_duration_seconds_count{route="/checkout"}[5m])
)
```

Taxas:

- Numerador: 410 / 300 = **1,367 rps**
    
- Denominador: 500 / 300 = **1,667 rps**  
    Fração: **1,367 / 1,667 = 0,82 → 82%**
    

```
{route="/checkout"}  0.820
```

## (c) Distribuição por **faixas** (ex.: (0.3, 0.5])

```promql
sum by (route) (rate(http_request_duration_seconds_bucket{route="/checkout", le="0.5"}[5m]))
-
sum by (route) (rate(http_request_duration_seconds_bucket{route="/checkout", le="0.3"}[5m]))
```

Contagem na faixa: 470 − 410 = **60** → 60 / 300s = **0,200 rps**

```
{route="/checkout"}  0.200
```

## (d) **Média** (usando `sum`/`count`)

Suponha soma de durações de **160 s** nos 5m (A=75 s, B=85 s).

```promql
sum by (route) (rate(http_request_duration_seconds_sum{route="/checkout"}[5m]))
/
sum by (route) (rate(http_request_duration_seconds_count{route="/checkout"}[5m]))
```

- `rate(sum)` = 160 / 300 = **0,533 s/s**
    
- `rate(count)` = 500 / 300 = **1,667 req/s**  
    Média = 0,533 / 1,667 = **0,320 s** (≈ **320 ms**)
    

```
{route="/checkout"}  0.320
```

---

# 3) Erro % (usando counters por status)

Suponha, nos 5m, `/checkout` teve: **2xx=470**, **4xx=25**, **5xx=5** (total **500**).

## (a) Taxa por status

```promql
sum by (route, status) (
  rate(outbound_http_route_request_statuses_total{route="/checkout"}[5m])
)
```

Retorno:

```
{route="/checkout", status="2xx"}  1.567   # 470/300
{route="/checkout", status="4xx"}  0.083   # 25/300
{route="/checkout", status="5xx"}  0.017   # 5/300
```

## (b) **Erro %** (5xx / total)

```promql
sum by (route) (rate(outbound_http_route_request_statuses_total{route="/checkout", status=~"5.."}[5m]))
/
sum by (route) (rate(outbound_http_route_request_statuses_total{route="/checkout"}[5m]))
```

- Numerador: 5 / 300 = **0,0167 rps**
    
- Denominador: 500 / 300 = **1,667 rps**  
    Erro% = 0,0167 / 1,667 = **0,010 = 1%**
    

```
{route="/checkout"}  0.010
```

---

# 4) Mesmas ideias com suas métricas do **Linkerd**

(ajuste os nomes exatos conforme expostos aí)

**p95 por rota**

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (
    rate(outbound_http_route_request_duration_seconds_bucket[5m])
  )
)
```

**Média por rota**

```promql
sum by (route) (rate(outbound_http_route_request_duration_seconds_sum[5m]))
/
sum by (route) (rate(outbound_http_route_request_duration_seconds_count[5m]))
```

**% ≤ 300 ms por rota**

```promql
sum by (route) (rate(outbound_http_route_request_duration_seconds_bucket{le="0.3"}[5m]))
/
sum by (route) (rate(outbound_http_route_request_duration_seconds_count[5m]))
```

**Erro % por rota**

```promql
sum by (route) (rate(outbound_http_route_request_statuses_total{status=~"5.."}[5m]))
/
sum by (route) (rate(outbound_http_route_request_statuses_total[5m]))
```

Se quiser, me passa os **labels exatos** que as suas métricas exportam e eu te devolvo as mesmas queries já “encaixadas” (e com saídas simuladas) para o teu ambiente.