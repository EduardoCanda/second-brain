---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
perfeito — aqui vão **5 casos típicos de erro** com _match_ em [[PromQL]]. Em cada um eu mostro as **séries de entrada** (esquerda/direita), a **query que falha**, o **motivo**, e a **correção**.

---

# 1) many-to-many por rótulo extra no RHS (`method`)

**Objetivo:** erro% por instância/rota.

**Esquerda (LHS)** – `rate(http_requests_total{status=~"5.."}[5m])`

```
{job="api", instance="api-0", route="/checkout", status="5xx"}  0.30
{job="api", instance="api-1", route="/checkout", status="5xx"}  0.60
```

**Direita (RHS)** – `rate(http_requests_total[5m])` (tem `method`)

```
{job="api", instance="api-0", route="/checkout", method="GET"}   10
{job="api", instance="api-0", route="/checkout", method="POST"}   2
{job="api", instance="api-1", route="/checkout", method="GET"}   15
{job="api", instance="api-1", route="/checkout", method="POST"}   3
```

**Query que falha**

```promql
rate(http_requests_total{status=~"5.."}[5m])
/
rate(http_requests_total[5m])
```

**Erro:** _many-to-many matching not allowed_.  
**Por quê?** Sem modificadores, a chave comum é `{job,instance,route}`. O RHS tem **duas séries** por essa chave (GET/POST), então cada LHS encontra **>1** RHS.

**Correção (agregue o RHS por method)**

```promql
rate(http_requests_total{status=~"5.."}[5m])
/
sum by (job, instance, route) (rate(http_requests_total[5m]))
```

_(ou agregue ambos por `route` se quiser erro% por rota)_

---

# 2) zero-match por rótulo errado no `on(...)`

**Objetivo:** juntar por rota, mas labels não batem.

**LHS**

```
sum by (uri) (rate(http_server_requests_seconds_count[5m]))
# ex.: {uri="/checkout"}  30
```

**RHS**

```
route_capacity_rps
# ex.: {route="/checkout"}  50
```

**Query que falha (resultado vazio)**

```promql
sum by (uri) (rate(http_server_requests_seconds_count[5m]))
/ on(route) route_capacity_rps
```

**Erro:** sem erro de execução, mas **nenhum match** → resultado **vazio**.  
**Por quê?** LHS usa `uri`, RHS usa `route`.

**Correções**

- Alinhar o label:
    

```promql
... / on(uri) route_capacity_rps{route=~".+"}  # se houver ambos
```

- Ou **renomear** via `label_replace`:
    

```promql
label_replace(
  sum by (uri) (...) , "route", "$1", "uri", "(.*)"
)
/ on(route) route_capacity_rps
```

---

# 3) many-to-one sem `group_left`

**Objetivo:** dividir RPS por **capacidade da rota**.

**LHS** – `rate(http_requests_total[5m])`

```
{instance="api-0", route="/checkout"}  12
{instance="api-1", route="/checkout"}  18
```

**RHS** – `route_capacity_rps`

```
{route="/checkout"}  50
```

**Query que falha**

```promql
rate(http_requests_total[5m]) / on(route) route_capacity_rps
```

**Erro:** _many-to-many matching not allowed_.  
**Por quê?** Várias séries do **LHS** para **1** do RHS por `route`.

**Correção (permita N:1 e mantenha labels da esquerda)**

```promql
rate(http_requests_total[5m])
/ on(route) group_left route_capacity_rps
```

_(se quiser copiar labels do RHS: `group_left(team)` e torne o RHS único por `route` com `max by (route, team)(...)`)_

---

# 4) one-to-many sem `group_right`

**Objetivo:** anexar `team` (por rota) às séries detalhadas de RPS (instância+rota).

**LHS** – tabela de donos

```
service_route_owner_info:
{route="/checkout", team="core-api"}  1
{route="/cart",     team="growth"}    1
```

**RHS** – `rate(http_requests_total[5m])`

```
{instance="api-0", route="/checkout"}  12
{instance="api-1", route="/checkout"}  18
{instance="api-0", route="/cart"}       5
{instance="api-1", route="/cart"}       5
```

**Query que falha**

```promql
service_route_owner_info * on(route) rate(http_requests_total[5m])
```

**Erro:** _many-to-many matching not allowed_.  
**Por quê?** 1 série no LHS para **várias** no RHS por `route`.

**Correção (permita 1:N e mantenha labels da direita)**

```promql
service_route_owner_info
* on(route) group_right(team)
rate(http_requests_total[5m])
```

---

# 5) `ignoring(...)` “demais” → many-to-many

**Objetivo:** comparar duas métricas por `job`, mas você ignorou labels demais.

**LHS**

```
sum by (job, route) (rate(a_total[5m]))
# {job="api", route="/checkout"}  20
# {job="api", route="/cart"}      10
```

**RHS**

```
sum by (job, route) (rate(b_total[5m]))
# {job="api", route="/checkout"}  25
# {job="api", route="/cart"}      12
```

**Query que falha**

```promql
sum by (job, route) (rate(a_total[5m]))
/
ignoring(route) sum by (job, route) (rate(b_total[5m]))
```

**Erro:** _many-to-many_.  
**Por quê?** Ao **ignorar `route`**, a chave vira só `job`; existem **várias** séries por `job` em ambos os lados.

**Correções**

- Não ignore `route`:
    

```promql
sum by (job, route) (rate(a_total[5m]))
/
sum by (job, route) (rate(b_total[5m]))
```

- Ou **agregue por `job`** dos dois lados:
    

```promql
sum by (job) (rate(a_total[5m])) / sum by (job) (rate(b_total[5m]))
```

---

## Checklist rápido para evitar erros

1. **Defina a chave**: use `on(...)`/`ignoring(...)` conscientemente.
    
2. **Teste unicidade** de cada lado antes do match:
    
    ```promql
    count by (<chave>) (<expr>) > 1
    ```
    
    Se der `>1`, **agregue** (`sum/max by (<chave>)`) ou use `group_left/right`.
    
3. **Prefira agregar** quando possível; _joins_ ficam 1:1 e mais estáveis.
    
4. Em `group_left/right`, torne o lado “1” **único** por chave (`max by (...)`, `sum by (...)`) e **liste** os labels que quer **copiar**.
    

Se quiser, me manda duas queries suas que deram erro e eu te mostro essa análise “antes/depois” com as suas séries reais.