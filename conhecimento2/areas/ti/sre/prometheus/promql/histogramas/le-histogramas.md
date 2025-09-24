---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
`le` é um **label especial** dos _histograms_ no [[prometheus]] e significa **“less than or equal”** (≤).  
Cada série `…_bucket{le="X"}` guarda **quantas observações ficaram ≤ X** dentro daquele bucket acumulativo.

## Como fica na métrica

Para uma métrica de latência em **segundos**:

```
http_request_duration_seconds_bucket{le="0.1"}    1234
http_request_duration_seconds_bucket{le="0.25"}   4500
http_request_duration_seconds_bucket{le="0.5"}    7200
http_request_duration_seconds_bucket{le="+Inf"}   8000  # todas as observações
http_request_duration_seconds_count               8000  # igual ao +Inf
http_request_duration_seconds_sum                 1560  # soma das durações
```

- Note que os valores **só aumentam** com `le` maior (são **cumulativos**).
    
- Sempre existe o bucket `le="+Inf"`.
    

## Por que o `le` é crítico

- Para **percentis** (`histogram_quantile`), você **precisa** somar **por `le`** (e pelas dimensões desejadas) antes de calcular:
    
    ```promql
    histogram_quantile(
      0.95,
      sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))
    )
    ```
    
    Se você não mantiver `le` no `sum by`, o quantil sai errado.
    

## Dicas rápidas de uso

- **Taxa no bucket até 300 ms**:
    
    ```promql
    sum by (job) (
      rate(http_request_duration_seconds_bucket{le="0.3"}[5m])
    )
    /
    sum by (job) (
      rate(http_request_duration_seconds_count[5m])
    )
    ```
    
    (fração de requisições ≤ 300 ms)
    
- **Contagem no intervalo (0.25s, 0.5s]**  
    Como os buckets são cumulativos, subtraia:
    
    ```promql
    sum by (job) (rate(http_request_duration_seconds_bucket{le="0.5"}[5m]))
    ```
    
- sum by (job) (rate(http_request_duration_seconds_bucket{le="0.25"}[5m]))
    
- **Média (não precisa de `le`)**:
    
    ```promql
    sum(rate(http_request_duration_seconds_sum[5m]))
    /
    sum(rate(http_request_duration_seconds_count[5m]))
    ```
    

## Coisinhas que pegam

- O valor de `le` é um **texto**, mas os clientes exportam números (e `+Inf`), então dá tudo certo.
    
- Unidades: em métricas de duração, `le` é em **segundos**. Se pensar em ms, converta (300 ms = **0.3**).
    
- `summary` **não** usa `le`; ele exporta quantis diretamente e **não agrega** entre instâncias. _Histogram_ agrega.
    

Se quiser, te ajudo a revisar os buckets atuais (ex.: 100ms/300ms/500ms/1s…) para alinhar com seus SLOs.