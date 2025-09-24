---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
ótima pergunta. Não existe “o” padrão universal, mas há **boas práticas de mercado** que a maioria de [[sre|SREs]] usa para ter **p90/p95/p99** bem precisos sem explodir cardinalidade:

# Regras que funcionam

1. **Densidade de buckets perto do que importa**  
    Quanto **mais estreitos** os buckets ao redor do p90/p95/p99 (e do seu [[sli-slo-sla|SLO]]), **menor o erro** da interpolação do `histogram_quantile`.  
    → regra prática: se você quer erro ≤ **±20 ms** no p95, garanta bucket com **largura ≤ 40 ms** próximo ao p95.
    
2. **Escala geométrica (progressão)**  
    Use um **fator constante** (1.5–2.0) entre limites, mas **quebre a regra** e ponha **buckets extras** onde você quer precisão (p.ex., ao redor de 300 ms e 1 s).
    
3. **Inclua o SLO como bucket exato**  
    Sempre tenha um `le` **exatamente no valor do SLO** (ex.: `0.300` s). Isso facilita SLI “≤ SLO”.
    
4. **Poucos buckets (8–12)**  
    Normalmente é o “sweet spot”. Mais que isso só se você realmente precisa de precisão alta no p99.
    
5. **Cubra o pior caso e deixe `+Inf`**  
    Um `le` bem acima do p99 esperado (ex.: 3–5×) evita que p99 caia no `+Inf`.
    

---

# Kits prontos (latência HTTP)

## A) APIs muito rápidas (SLO 100 ms; foco p95)

```
10ms, 20ms, 40ms, 60ms, 80ms, 100ms, 150ms, 200ms, 300ms, 500ms, 1s
```

- Alta densidade < 100 ms → p95/p99 bem precisos em serviços low-latency.
    

## B) Web/API típica (SLO 300 ms; foco p95 e p99)

```
50ms, 100ms, 200ms, 300ms, 400ms, 500ms, 700ms, 1s, 1.5s, 2s
```

- Buckets “apertados” entre 200–500 ms; rastro até 2 s p/ p99.
    

## C) Endpoints pesados (SLO 1 s; foco p99)

```
100ms, 200ms, 400ms, 700ms, 1s, 1.5s, 2s, 3s, 5s
```

- Cauda mais longa; precisão concentrada entre 700 ms–1.5 s.
    

> Dica: se seu p99 costuma ficar acima do maior bucket, **adicione um ponto logo acima** (ex.: 2.5 s entre 2 e 3 s).

---

# Como aplicar no [[micrometer|Spring Boot/Micrometer]]

(usar **`slo`**, não `sla`)

**Exemplo para o caso B (SLO 300 ms):**

```properties
# mantenha o histograma automático desativado (padrão)
management.metrics.distribution.percentiles-histogram.http.server.requests=false

# buckets SLO (em Duration; no /prometheus aparecerão em segundos)
management.metrics.distribution.slo.http.server.requests=50ms,100ms,200ms,300ms,400ms,500ms,700ms,1s,1.5s,2s
```

Você pode ter **conjuntos diferentes por métrica**:

```properties
management.metrics.distribution.slo.http.client.requests=50ms,100ms,200ms,300ms,500ms,1s
management.metrics.distribution.slo.jdbc.connections.acquire=5ms,10ms,20ms,50ms,100ms,200ms
```

---

# Validação rápida no Prometheus/Grafana

**p95 por rota (mantendo `le`):**

```promql
histogram_quantile(
  0.95,
  sum by (le, uri) (rate(http_server_requests_seconds_bucket[5m]))
)
```

**% ≤ SLO (300 ms):**

```promql
sum by (uri) (rate(http_server_requests_seconds_bucket{le="0.3"}[5m]))
/
sum by (uri) (rate(http_server_requests_seconds_count[5m]))
```

**Ver se p99 cai no `+Inf`:**

```promql
histogram_quantile(
  0.99,
  sum by (le) (rate(http_server_requests_seconds_bucket[15m]))
)
```

Se voltar ~`+Inf` ou muito perto do maior bucket, **adapte os limites**.

---

# Atalho mental para desenhar buckets

1. escolha o **SLO T**.
    
2. ponha **dois pontos abaixo** de T (~T/2 e ~T/1.5) e **dois acima** (T_1.5, T_2).
    
3. complete a cauda com 1–2 pontos para cobrir p99 (T_3, T_5).
    
4. mantenha o total em ~10 buckets.
    