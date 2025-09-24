---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
perfeito — vamos “ver” isso acontecendo em 3 passos ([[instant-vector|instant]] → [[funcao-rate]] → [[agregacao-sum-by]]) com **valores ilustrativos**, bem próximos do que você veria no [[prometheus]]/[[grafana]].

# Exemplo 1 — `http_requests_total` (por rota)

## 1) Instant (counter cru)

Consulta:

```promql
http_requests_total{job="api", route=~"/checkout|/cart"}
```

Saída (exemplo, 4 séries):

```
{job="api", instance="api-0", route="/checkout"}  1_234_560
{job="api", instance="api-1", route="/checkout"}  1_235_200
{job="api", instance="api-0", route="/cart"}        456_770
{job="api", instance="api-1", route="/cart"}        457_100
```

> É cumulativo e só cresce; ainda **não** é “req/s”.

## 2) `rate()` por instância (RPS)

Consulta:

```promql
rate(http_requests_total{job="api", route=~"/checkout|/cart"}[5m])
```

Saída (taxa média no período, por instância):

```
{job="api", instance="api-0", route="/checkout"}   60
{job="api", instance="api-1", route="/checkout"}   70
{job="api", instance="api-0", route="/cart"}       15
{job="api", instance="api-1", route="/cart"}       16
```

## 3) `sum by` (agregando instâncias)

Consulta:

```promql
sum by (job, route) (
  rate(http_requests_total{job="api", route=~"/checkout|/cart"}[5m])
)
```

Saída (RPS total por rota):

```
{job="api", route="/checkout"}  130   # 60 + 70
{job="api", route="/cart"}       31   # 15 + 16
```

---

# Exemplo 2 — Erro % por rota (usando `status`)

> Se no seu cluster o label for `status_code`/`code`, ajuste o nome.

## 1) Instant (counter por status)

```promql
outbound_http_route_request_statuses_total{
  route="/checkout",
  status=~"2..|5..",
  job="api"
}
```

Saída (exemplo):

```
{route="/checkout", status="2xx", job="api", instance="api-0"}  1_200_000
{route="/checkout", status="2xx", job="api", instance="api-1"}  1_170_000
{route="/checkout", status="5xx", job="api", instance="api-0"}      4_000
{route="/checkout", status="5xx", job="api", instance="api-1"}      6_000
```

## 2) `rate()` por instância e status

```promql
rate(outbound_http_route_request_statuses_total{
  route="/checkout", status=~"2..|5..", job="api"
}[5m])
```

Saída (exemplo):

```
{route="/checkout", status="2xx", instance="api-0"}  48.0
{route="/checkout", status="2xx", instance="api-1"}  45.0
{route="/checkout", status="5xx", instance="api-0"}   0.5
{route="/checkout", status="5xx", instance="api-1"}   0.3
```

## 3) `sum by` + razão (erro %)

```promql
sum by (route) (rate(outbound_http_route_request_statuses_total{route="/checkout", status=~"5.."}[5m]))
/
sum by (route) (rate(outbound_http_route_request_statuses_total{route="/checkout"}[5m]))
```

Cálculo com os números acima:

- Numerador (5xx): **0.5 + 0.3 = 0.8 req/s**
    
- Denominador (todas): **48 + 45 + 0.5 + 0.3 = 93.8 req/s**
    
- Erro % ≈ **0.8 / 93.8 = 0.85%**
    

Saída:

```
{route="/checkout"}  0.0085   # 0.85%
```

---

# Exemplo 3 — p95 de latência (histograma)

## 1) Instant (buckets do histograma)

```promql
http_request_duration_seconds_bucket{job="api", route="/checkout"}
```

(muitas séries por `le` e por instância)

## 2) `rate()` nos buckets (por instância)

```promql
rate(http_request_duration_seconds_bucket{job="api", route="/checkout"}[5m])
```

## 3) `sum by (le, route)` e quantil

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (
    rate(http_request_duration_seconds_bucket{job="api"}[5m])
  )
)
```

Saída (exemplo):

```
{route="/checkout"}  0.180   # p95 ≈ 180 ms
```

---

## Regras práticas que esses exemplos mostram

- **Sempre `rate()` primeiro**, **agregue depois**.
    
- No `sum by (...)`, **liste as dimensões que você quer manter** (ex.: `route`, `job`).
    
- Para **percentis de histograma**, **mantenha `le`** no `by`.
    