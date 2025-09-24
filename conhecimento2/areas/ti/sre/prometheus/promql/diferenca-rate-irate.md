---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
ótima! resumindo bem:

# Diferença prática

- **[[funcao-rate|rate]](X[W])** → usa **todas as amostras** na janela `W` para estimar a **taxa média por segundo** do _counter_ `X`, corrigindo **resets** e **bordas** da janela. Resultado **suavizado**.
    
- **`irate(X[W])`** → usa **apenas os 2 últimos pontos** da janela para estimar a **taxa “instantânea”**. Resultado **super responsivo** (e mais ruidoso).
    

> Ambas funcionam **só com counters** (sempre crescentes). Para _gauge_, use `deriv()`/`delta()`.

# Quando usar qual

- **Dashboards, [[sli-slo-sla|SLIs/SLOs]], histogramas (p95/p99)** → **`rate`** (estável e agrega melhor).
    
- **Painéis “em tempo quase real”**, detectar **picos rápidos** por instância, debug de spikes → **`irate`** (reage no próximo scrape).
    
- **Alertas**: na maioria dos casos **`rate`** (evita flaps). Use `irate` só quando você quer mesmo reagir a variações **entre dois scrapes**.
    

# Exemplo com números

Suponha `scrape_interval=30s` e a série (counter) por instância:

```
t-120s: 1000
t-90s : 1120
t-60s : 1240
t-30s : 1360
t     : 1600   ← pico entre t-30 e t
```

**`rate(x_total[2m])`**  
≈ (1600 − 1000) / 120s = **5,0/s** (suaviza o pico no contexto dos 2 min)

**`irate(x_total[2m])`**  
≈ (1600 − 1360) / 30s = **8,0/s** (reflete o salto do último intervalo)

# Mesmas consultas, efeitos diferentes

**RPS por instância (suave)**

```promql
rate(http_requests_total[5m])
```

**RPS por instância (reativo)**

```promql
irate(http_requests_total[5m])
```

**RPS total por serviço (suave)**

```promql
sum by (job) (rate(http_requests_total[5m]))
```

**Erro % (suave)**

```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
```

**p95 (histograma) — sempre com `rate`**

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))
)
```

> Evite `irate` em buckets: o ruído quebra o quantil.

# Regrinhas rápidas

- Janela: **≥ 4×** o `scrape_interval` (ex.: 15s → 1–5m).
    
- Tráfego baixo? aumente a janela do `rate`.
    
- Viu valores negativos pequenos? pode usar `clamp_min(rate(...), 0)`.
    
- Quer ver “picos” de um pod específico? teste **`irate(...[2m])`** no painel de debug.
    

Se quiser, mando versões **lado a lado** (rate vs irate) das suas métricas do Linkerd pra você ver a diferença no seu Grafana.