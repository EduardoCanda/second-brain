---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
Em [[promql|PromQL]] os **modificadores de agregação** são os sufixos **`by(...)`** e **`without(...)`** que acompanham _[[operadores-agregacao|operadores de agregação]]_ (`sum`, `avg`, `max`, `count`, `quantile`, `topk`, etc.). Eles dizem **como agrupar as séries** antes de aplicar a agregação.

# Como funciona (mental model rápido)

1. Sua expressão (ex.: `rate(http_requests_total[5m])`) produz **várias séries** com labels (`job`, `instance`, `route`, …).
    

    - **`by(a,b,…)`** → mantém **somente** esses labels como chave do grupo.
        
    - **`without(a,b,…)`** → remove esses labels e mantém **todos os demais** como chave do grupo.
        
3. Para **cada grupo**, aplica a operação (soma, média, …).
    
4. O **resultado** tem exatamente os labels do agrupamento (com `by`) ou “todos menos” (com `without`).
    

Gramática:

```
<agregador> [parâmetro] [by|without] (labels) ( <expressão> )
```

> `parâmetro` aparece em agregadores como `topk(5, ...)`, `quantile(0.9, ...)`.

---

## Exemplos práticos

### 1) Somar instâncias, preservando serviço e rota

```promql
sum by (job, route) (
  rate(http_requests_total[5m])
)
```

→ “RPS total por `job` e `route`”, **descarta `instance`**.

### 2) Mesmo objetivo usando `without` (útil com muitas tags)

```promql
sum without (instance, pod) (
  rate(http_requests_total[5m])
)
```

→ Mantém todos os labels, exceto `instance` e `pod`.

### 3) Histogramas (regra de ouro: mantenha `le`)

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (
    rate(http_request_duration_seconds_bucket[5m])
  )
)
```

→ Se você esquecer `le` no `by`, o quantil sai errado.

### 4) Erro % (atenção: mesmo agrupamento no numerador e denominador)

```promql
sum by (route) (rate(http_requests_total{status=~"5.."}[5m]))
/
sum by (route) (rate(http_requests_total[5m]))
```

→ Se os agrupamentos não forem idênticos, você pode ter “many-to-many matching not allowed”.

### 5) `topk` com agregação (duas formas corretas)

Top 5 rotas por RPS do serviço:

```promql
# (a) agregue por rota e depois faça topk
topk(5, sum by (route) (rate(http_requests_total{job="api"}[5m])))

# (b) topk por grupo (menos comum, mas válido)
topk by (route) (5, rate(http_requests_total{job="api"}[5m]))
```

### 6) Quantidade de pods “up” por serviço

```promql
count by (job) (up == 1)
```

---

## Quando usar `by` vs `without`

- **Prefira `by(...)`** quando você **sabe exatamente** quais dimensões quer manter (ex.: relatórios “por serviço e rota”). Resultado estável e explícito.
    
- **Use `without(...)`** quando quer se livrar de labels de **alta cardinalidade**/voláteis (`instance`, `pod`, `container`, `node`) e **manter o resto** sem listar tudo.
    
- Para **histogramas**: sempre **`by (le, ...)`** (ou **nunca** `without(le)`).
    

---

## Erros e armadilhas comuns

- **Misturar agrupamentos** entre numerador/denominador em divisões → _matching_ falha ou resultado incorreto. Garanta **o mesmo `by/without`** dos dois lados.
    
- **Esquecer `le`** em histogramas ao somar buckets.
    
- **Adicionar label que não existe**: Prometheus trata como “valor vazio” e agrupa mesmo assim; pode surpreender. Verifique com `label_join`/`label_replace` se necessário.
    
- **Cardinalidade**: cada combinação de labels gera uma série. Use `without(instance, pod)` para evitar explosão.
    

---

## Boas práticas de uso no dia a dia

- **`rate()` primeiro, agregue depois**:
    
    ```promql
    sum by (job) (rate(http_requests_total[5m]))
    ```
    
- **Padronize agrupamentos** (ex.: `by (service, route)` para RPS/erro/latência) — facilita compor gráficos e alertas.
    
- **Para SLIs**, defina um conjunto fixo de labels “de negócio” (ex.: `service`, `route`, `region`) e sempre agregue por eles.
    
- **Quando em dúvida**, comece com `sum without (instance, pod)`; depois refine com um `by(...)` explícito.
    

---

### (Bônus) Não confunda com “modificadores de _matching_”

- `on(...)`, `ignoring(...)`, `group_left/right` são **modificadores de _matching_** usados em **operações binárias** (ex.: dividir uma métrica pela outra quando os conjuntos de labels diferem).
    
- Já **`by/without`** são **modificadores de _agregação_** (definem agrupamento antes da soma/média/etc.).
    