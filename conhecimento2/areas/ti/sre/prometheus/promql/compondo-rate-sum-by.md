---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
ótima pergunta — a “cola” entre `rate()` e `sum by()` confunde mesmo no começo. pensa no fluxo em **3 passos**:

## 1) De [[instant-vector|instant]] → [[range-vector|range]] → [[funcao-rate|taxa]]

- Você parte de um **counter** (ex.: `http_requests_total`), que é uma **série por instância**.
    
- Quando escreve `metric[5m]`, você transforma cada série em um **[[range-vector|range vector]]** (um “pacote” com várias amostras dos últimos 5 min).
    
- `rate(metric[5m])` **pega cada série individualmente** e calcula a **taxa média por segundo naquele período**, já **corrigindo resets**.
    

Resultado: você ainda tem **uma série por instância**, só que agora o valor é **RPS** (ou eventos/s), não mais um contador acumulado.

```
Antes (counter):   http_requests_total{job="api", instance="A"}
Depois  (rate):    rate(http_requests_total{job="api", instance="A"}[5m])  # RPS da instância A
```

## 2) Agregar séries (várias instâncias) com `sum by`

Agora que cada instância tem sua taxa, você **agrega** para obter o total por algum recorte (job, rota, etc.).  
Exemplo: total de RPS do serviço inteiro (somando instâncias):

```promql
sum by (job) (
  rate(http_requests_total[5m])
)
```

- O `sum by (job)` **soma todas as séries** que compartilham o mesmo `job` e **descarta os outros labels** (como `instance`).
    
- Se você quer **manter** mais dimensões (ex.: por rota), inclua na lista:
    
    ```promql
    sum by (job, route) (rate(http_requests_total[5m]))
    ```
    

> Regra de ouro: **faça `rate()` primeiro, agregue depois.** O `rate()` precisa ver a série **por instância**, com o histórico (range) intacto.

## 3) Por que não “somar antes”?

- Sintaticamente, você **não consegue** fazer `rate(sum(...)[5m])` porque o seletor `[5m]` só pode ir direto numa **métrica**, não no resultado de uma agregação.
    
- Conceitualmente, mesmo que desse, você perderia a correção de **resets por instância** (misturaria contadores que podem ter reiniciado em momentos diferentes).
    

Se você realmente precisa do mesmo efeito “somar e depois dividir pelo tempo”, há uma forma equivalente para counters:

```promql
sum by (job) (increase(http_requests_total[5m])) / 300
```

- `increase()` dá o total de eventos no período; dividir por **300** (segundos em 5m) ≈ taxa média.
    
- Na prática, `sum(rate(...))` e `sum(increase(...))/janela` dão resultados muito próximos.  
    `rate()` é preferível para **dashboards/SLIs** (suaviza e extrapola bordas), `increase()` é ótimo para **totais**.
    

---

## Mini exemplo concreto

Suponha `http_requests_total`:

- `api/A`: subiu **600** em 5 min → `rate` ≈ **2 req/s**
    
- `api/B`: subiu **900** em 5 min → `rate` ≈ **3 req/s**
    

Então:

```promql
sum by (job) (rate(http_requests_total[5m]))  # => api = 2 + 3 = 5 req/s
```

Se o pod B reiniciou no meio (contador resetou), `rate()` **corrige**; a soma continua representando bem o throughput total.

---

## Histogramas: lembre do `le`

Para latência p95 por rota:

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))
)
```

- **Importantíssimo**: ao somar buckets, **mantenha `le`** no `by`, senão o quantil quebra.
    

---

## Cheats de composição

- **RPS por serviço**  
    `sum by (job) (rate(http_requests_total[5m]))`
    
- **Erro % por serviço**
    
    ```promql
    sum(rate(http_requests_total{status=~"5.."}[5m]))
    /
    sum(rate(http_requests_total[5m]))
    ```
    
- **RPS por rota**  
    `sum by (route) (rate(http_requests_total[5m]))`
    
- **Média de latência**
    
    ```promql
    sum(rate(http_request_duration_seconds_sum[5m]))
    /
    sum(rate(http_request_duration_seconds_count[5m]))
    ```
    

---

## Dicas práticas

- **Janela**: use algo como **≥ 4×** o `scrape_interval` (15s → 1–5m).
    
- **Agregue depois do rate** e **liste no `by(...)` todos os labels que você quer preservar**.
    
- **Baixo volume?** Aumente a janela ou use `increase()` para totais.
    
- **Cortes por labels**:
    
    - “Somar ignorando instância”: `sum without (instance) (...)`
        
    - “Somar por job e rota”: `sum by (job, route) (...)`
        

Se quiser, posso pegar **uma query sua** e “desmontar” passo a passo (o que entra, o que sai de cada estágio) até virar o gráfico final. Quer tentar com alguma métrica real do seu cluster?