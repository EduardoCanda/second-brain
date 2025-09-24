---
tags:
  - SRE
  - NotaPermanente
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
beleza! vamos direto ao ponto sobre a **`rate()`** no [[prometheus]] — o canivete suíço para transformar contadores em “por segundo”.

# O que a `rate()` faz (sem enrolação)

- **Converte um _counter_ em taxa por segundo** dentro de uma janela (ex.: `[5m]`).
    
- **Detecta e corrige resets** (quando o contador volta a zero numa troca de versão/restart).
    
- **Extrapola bordas** da janela para não subestimar a taxa se a janela não está “cheia”.
    

> Use `rate()` **apenas** com _counters_ (sempre crescentes). Para _gauges_, use `deriv()`/`delta()`.

# Por que usar

- **Mede throughput** (RPS, eventos/s) de forma estável.
    
- **Compara instâncias** sem sofrer com resets individuais.
    
- **Base para SLIs** (erro %, latência via histogram), alertas e capacidade.
    

# Como aproveitar melhor (boas práticas)

1. **Escolha bem a janela**
    
    - Regra prática: **≥ 4× o `scrape_interval`** (típico: 15s → janelas de 1–5 min).
        
    - **Curta** (1–2 min): mais responsiva, mais ruidosa. **Longa** (10–30 min): mais suave, menos responsiva.
        
2. **Agregue _depois_ da `rate()`**
    
    ```promql
    sum by (job) (rate(http_requests_total[5m]))
    ```
    
    (Somar antes não faz sentido com range vector e ainda mascararia resets por instância.)
    
3. **Counters com baixo volume**  
    Use janela maior (ex.: `[30m]`) ou **`increase()`** se você quer o total no período:
    
    ```promql
    increase(my_counter_total[30m])  # total de eventos em 30 min
    ```
    
4. **Spikes instantâneos**  
    Para alertas super reativos, considere **`irate()`** (usa só os 2 últimos pontos); para dashboards/SLIs, **prefira `rate()`**.
    
5. **Negativos/ruído**  
    Às vezes, por jitter, surgem negativos pequenos. Você pode “cortar”:
    
    ```promql
    clamp_min(rate(my_counter_total[5m]), 0)
    ```
    
6. **Scrape e step coerentes (Grafana)**  
    Deixe o `step` proporcional à janela (ex.: janela 5m → step 15–30s ou use `$__interval`).
    

# Receitas prontas (copiar/colar)

**RPS por serviço**

```promql
sum by (job) (rate(http_requests_total[5m]))
```

**Erro %**

```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
```

**CPU por pod (segundos de CPU/seg)**

```promql
sum by (pod) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))
```

**Latência p95 com _histogram_**

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))
)
```

**Média de latência (via summary ou hist)**

```promql
sum(rate(http_request_duration_seconds_sum[5m]))
/
sum(rate(http_request_duration_seconds_count[5m]))
```

# Aplicando nas suas métricas (Linkerd)

Você mencionou métricas como:

- `outbound_http_route_request_statuses_total`
    
- `outbound_http_route_request_duration_seconds_{sum,count,bucket}`  
    Então:
    

**RPS por rota**

```promql
sum by (route) (rate(outbound_http_route_request_statuses_total[5m]))
```

**Erro % por rota**

```promql
sum by (route) (rate(outbound_http_route_request_statuses_total{status=~"5.."}[5m]))
/
sum by (route) (rate(outbound_http_route_request_statuses_total[5m]))
```

**p95 por rota**

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (rate(outbound_http_route_request_duration_seconds_bucket[5m]))
)
```

**Média por rota**

```promql
sum by (route) (rate(outbound_http_route_request_duration_seconds_sum[5m]))
/
sum by (route) (rate(outbound_http_route_request_duration_seconds_count[5m]))
```

# Dicas de depuração

- **Reset acontecendo?**
    
    ```promql
    resets(my_counter_total[1h]) > 0
    ```
    
- **Taxa “zerada” com tráfego baixo?** aumente a janela.
    
- **Consulta cara repetida?** crie **recording rules** para materializar `rate()` e reutilizar.
    

Se quiser, mando sugestões de **alertas** baseados em `rate()` para erro %, queda de RPS e burn rate de [[sli-slo-sla|SLO]]. Quer?