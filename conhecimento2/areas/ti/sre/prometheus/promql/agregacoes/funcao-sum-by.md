---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
ótima! Em [[promql]] **`sum by(...)` não são duas funções** separadas.

- **`sum`** é um **[[operadores-agregacao|operador de agregação]]**.
    
- **`by (...)`** (ou **`without (...)`**) é um **[[modificadores-agregacao|modificador do agregador]]** que diz **como agrupar** as séries antes de somar.
    

A “gramática” é:

```promql
<agregador> [by|without] (<lista_de_labels>) ( <expressão> )
```

# Como pensar

1. A expressão interna (ex.: `rate(...)`) produz **várias séries**, cada uma com um conjunto de [[labels-prometheus|labels]].
    
2. O agregador **forma grupos** de séries que têm **os mesmos valores** para os labels listados no `by(...)` (ou para **todos exceto** os do `without(...)`).
    
3. Para cada grupo, aplica a operação (**soma**, no caso) e **mantém só os labels do agrupamento** no resultado.
    

# Exemplos rápidos

## 1) Somando instâncias, mantendo `job` e `route`

Entrada (resultado de `rate()` por instância):

```
{job="api", instance="api-0", route="/checkout"} 60
{job="api", instance="api-1", route="/checkout"} 70
{job="api", instance="api-0", route="/cart"}     15
{job="api", instance="api-1", route="/cart"}     16
```

Query:

```promql
sum by (job, route) (
  rate(http_requests_total[5m])
)
```

Saída:

```
{job="api", route="/checkout"} 130
{job="api", route="/cart"}      31
```

👉 Agrupou por `(job, route)`, **descartou `instance`** e somou valores dentro de cada grupo.

## 2) Mesmo efeito usando `without`

Quando há muitos labels e você só quer **remover alguns** (ex.: `instance`, `pod`):

```promql
sum without (instance, pod) (
  rate(http_requests_total[5m])
)
```

👉 Mantém **todos os outros labels** automaticamente (job, route, method, etc.) e soma sobre `instance`/`pod`.

## 3) Sem `by/without` (agrega tudo)

```promql
sum(rate(http_requests_total[5m]))
```

👉 **Uma única série**: soma de todas as séries de entrada.

# Dicas práticas

- **`by(...)` = diga exatamente quais labels quer manter.** Bom quando você sabe o recorte (ex.: `by (job, route)`).
    
- **`without(...)` = diga o que quer descartar.** Útil quando a métrica tem muitos labels voláteis (ex.: `instance`, `pod`, `container`).
    
- Para **histogramas**, ao agregar buckets, **mantenha `le`**:
    
    ```promql
    sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))
    ```
    
- **Faça `rate()` primeiro, agregue depois.** O `rate()` precisa operar **por série** para corrigir resets.
    

Se quiser, me manda uma métrica sua (com os labels) e eu te mostro como o resultado muda com `sum by(...)`, `sum without(...)` e sem modificador.