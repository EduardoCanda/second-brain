---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
boa! vamos fixar o **`le`** com exemplos bem concretos, do “valor no balde” até queries úteis.

# 1) Brincando com números (um serviço, 5 minutos)

Suponha que, em 5 min, tivemos **500** requisições e os buckets (em **segundos**) registraram:

```promql
http_request_duration_seconds_bucket{le="0.10"}  = 120   # ≤ 100 ms
http_request_duration_seconds_bucket{le="0.20"}  = 260   # ≤ 200 ms
http_request_duration_seconds_bucket{le="0.30"}  = 410   # ≤ 300 ms
http_request_duration_seconds_bucket{le="0.50"}  = 480   # ≤ 500 ms
http_request_duration_seconds_bucket{le="1"}     = 499   # ≤ 1 s
http_request_duration_seconds_bucket{le="+Inf"}  = 500   # todas
http_request_duration_seconds_count              = 500
```

Observe: os valores **só aumentam** à medida que o `le` cresce (são cumulativos).

### “Qual % ficou ≤ 300 ms?”

- Cálculo: **410 / 500 = 0,82 → 82%**.
    

Query (em [[promql]]), por exemplo por `job`:

```promql
sum by (job) (increase(http_request_duration_seconds_bucket{le="0.3"}[5m]))
/
sum by (job) (increase(http_request_duration_seconds_count[5m]))
```

> Se preferir **taxa** em vez de total, troque `increase(...)` por `rate(...)`.

### “Quantas ficaram entre 300–500 ms?”

- Diferencie buckets: **480 − 410 = 70** → **14%** (70 / 500).
    

Query:

```promql
(
  sum by (job) (increase(http_request_duration_seconds_bucket{le="0.5"}[5m]))
-
  sum by (job) (increase(http_request_duration_seconds_bucket{le="0.3"}[5m]))
)
/
sum by (job) (increase(http_request_duration_seconds_count[5m]))
```

### “p95 de latência”

- 95% de 500 = **475**; esse ponto cai no bucket `le="0.5"` (porque 480 ≥ 475 e o anterior é 410).  
    O **`histogram_quantile(0.95, ...)`** interpola dentro desse bucket → p95 ~ **entre 300 e 500 ms** (bem perto de 500 ms nesse exemplo).
    

Query correta:

```promql
histogram_quantile(
  0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)
```

> Repare que **mantemos `le`** no `sum by`. Sem o `le`, o quantil sai errado.

---

# 2) Mesma lógica, agora **agregando instâncias**

Suponha `/checkout` com **duas instâncias** nos últimos 5 min (totais por instância):

```
inst A (≤0.3): 200     inst B (≤0.3): 210      → soma ≤0.3 = 410
inst A (≤0.5): 230     inst B (≤0.5): 250      → soma ≤0.5 = 480
inst A (count): 240    inst B (count): 260     → soma total = 500
```

### p95 **agregado por rota**

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (
    rate(http_request_duration_seconds_bucket{route="/checkout"}[5m])
  )
)
```

### “Qual % ≤ 300 ms por rota?”

```promql
sum by (route) (rate(http_request_duration_seconds_bucket{route="/checkout", le="0.3"}[5m]))
/
sum by (route) (rate(http_request_duration_seconds_count{route="/checkout"}[5m]))
```

---

# 3) Versões equivalentes com suas métricas do **[[linkerd]]**

(ajuste os nomes conforme expostos no seu cluster)

### p95 por rota

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (
    rate(outbound_http_route_request_duration_seconds_bucket[5m])
  )
)
```

### Média por rota

```promql
sum by (route) (rate(outbound_http_route_request_duration_seconds_sum[5m]))
/
sum by (route) (rate(outbound_http_route_request_duration_seconds_count[5m]))
```

### % ≤ 300 ms por rota (ótimo para SLI/SLO)

```promql
sum by (route) (rate(outbound_http_route_request_duration_seconds_bucket{le="0.3"}[5m]))
/
sum by (route) (rate(outbound_http_route_request_duration_seconds_count[5m]))
```

### Distribuição por faixas (0.1–0.2, 0.2–0.3, …) — “não cumulativa”

Você pode montar _barras_ por faixa fazendo diferenças:

```promql
# Faixa (0.2s, 0.3s]
sum by (route) (rate(outbound_http_route_request_duration_seconds_bucket{le="0.3"}[5m]))
-
sum by (route) (rate(outbound_http_route_request_duration_seconds_bucket{le="0.2"}[5m]))
```

(Repita para cada par de limites.)

---

# 4) Regras de bolso (para não esquecer)

- **`le` = “≤ X”**. Buckets são **cumulativos** e incluem sempre `+Inf`.
    
- Para **quantis**, use **`histogram_quantile`** e **some por `le`** (e pelas dimensões que quer manter).
    
- Para **percentual abaixo de um alvo** (ex.: 300 ms), consulte **direto o bucket `le` daquele alvo** e divida pelo total.
    
- Para **faixas**, faça **diferença entre buckets vizinhos**.
    

Se quiser, mando um painel do [[grafana]] com esses 4 blocos prontos (p95/p99, ≤ alvo, distribuição por faixa e média) usando suas métricas.