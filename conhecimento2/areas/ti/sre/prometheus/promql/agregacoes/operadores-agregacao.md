---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
boa! em PromQL “agregador” normalmente quer dizer os **operadores de agregação entre séries** — aqueles que aceitam `by(...)`/`without(...)`. Aqui vai o mapa:

# Agregadores entre séries (com `by/without`)

- **sum** – soma os valores.  
    `sum by (job) (rate(http_requests_total[5m]))`
    
- **min / max** – menor / maior valor.  
    `max by (route) (rate(rps_total[5m]))`
    
- **avg** – média.  
    `avg by (pod) (container_memory_working_set_bytes)`
    
- **count** – quantas séries existem no grupo.  
    `count by (job) (up == 1)`
    
- **stddev / stdvar** – desvio-padrão / variância dos valores.  
    `stddev by (job) (rate(http_requests_total[5m]))`
    
- **group** – “dedup”: retorna **1** por grupo, preservando labels.  
    `group by (service) (up)`
    
- **topk(k, …)** – k maiores séries pelo valor.  
    `topk(5, rate(http_requests_total[5m]))`
    
- **bottomk(k, …)** – k menores.  
    `bottomk(3, rate(http_requests_total[5m]))`
    
- **quantile(φ, …)** – quantil entre séries (≠ `histogram_quantile`).  
    `quantile(0.9, rate(queue_length[5m]))`
    
- **count_values("label", …)** – conta ocorrências de **valores** e grava em um label novo.  
    `count_values("code", http_requests_inflight)`
    

> Sintaxe geral:  
> `<agregador> [by|without] (label1, label2, …) ( <expressão> )`

# Agregadores “ao longo do tempo” (em range vectors)

Não usam `by/without`; agregam **no tempo**:  
**sum_over_time, avg_over_time, min_over_time, max_over_time, count_over_time, quantile_over_time, stddev_over_time, stdvar_over_time, last_over_time, present_over_time**.  
Ex.: `sum_over_time(rate(http_requests_total[1m])[1h:])` (total aproximado na última hora).

# Dicas rápidas

- Faça **`rate()` primeiro** (se for counter) e **agregue depois**: `sum by (...) (rate(...[5m]))`.
    
- Em histogramas, ao somar buckets, **mantenha `le`** no `by`:  
    `sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))`.
    
- Prefira `without(instance, pod)` quando sua métrica tem muitos labels voláteis.
    

Se quiser, mando uma tabelinha com exemplos de entrada/saída para cada agregador usando suas métricas do Linkerd. Quer?