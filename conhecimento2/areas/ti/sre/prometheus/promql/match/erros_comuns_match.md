---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
# Regra-base (sem `group_*`)

- Em operações binárias ( `/ * + - > < ==` etc.), **cada [[time-series|série]] da esquerda deve casar com **no máximo 1** da direita** pelo conjunto de rótulos definido por `on(...)` (ou por “todos os rótulos em comum” se você não usar `on/ignoring`).
    
- **Se casar com 0** → a série é **descartada**.
    
- **Se casar com >1** → erro: **`many-to-many matching not allowed`**.
    
- Não precisa ter o **mesmo número** de séries; precisa ser **1:1** por chave de casamento.
    

# Quando usar `group_left` / `group_right`

Use quando **não é 1:1**:

- **`group_left([labels...])`**: permite **N:1** (várias da **esquerda** para 1 da direita) e mantém os **labels da esquerda** no resultado (opcionalmente **copia** `labels...` da direita).
    
- **`group_right([labels...])`**: permite **1:N** (1 da esquerda para **várias da direita**) e mantém os **labels da direita** (e pode copiar `labels...` da esquerda).
    

> Dica prática: o lado indicado em `group_*` é o lado cujos **labels serão preservados** no resultado. O **outro** lado deve ser **único por chave** (ou você agrega antes).  
> Se houver múltiplas séries no lado “1”, use `sum by (...)`/`max by (...)` para torná-lo único antes do match.

---

## Exemplos de erros comuns e consertos

### 1) Erro% ignorando `status` (1:1 esperado)

**Quebra:**

```promql
rate(http_requests_total{status=~"5.."}[5m])
/
ignoring(status) rate(http_requests_total[5m])
```

Falha se o lado direito tiver **mais de uma série** por `(job, instance, route, ...)`.

**Conserto A (recomendado):** alinhe **agregando igual** dos dois lados:

```promql
sum by (route) (rate(http_requests_total{status=~"5.."}[5m]))
/
sum by (route) (rate(http_requests_total[5m]))
```

**Conserto B (sem agregar):** garanta unicidade no lado direito:

```promql
rate(http_requests_total{status=~"5.."}[5m])
/
ignoring(status) group_left
max by (job, instance, route) (rate(http_requests_total[5m]))
```

### 2) Dividir RPS por “capacidade por rota” (N:1 → `group_left`)

**Esquerda (muitas por rota):**

```
rate(http_requests_total[5m])   # {instance, route, ...}
```

**Direita (uma por rota):**

```
route_capacity_rps              # {route}
```

**Conserto:**

```promql
rate(http_requests_total[5m])
/ on(route) group_left
route_capacity_rps
```

Se quiser **copiar** um label do lado direito (ex.: `team`):

```promql
rate(http_requests_total[5m])
/ on(route) group_left(team)
max by (route, team) (route_capacity_rps)
```

> Note o `max by(...)` garantindo **unicidade** no lado direito por `route`.

### 3) Enriquecer por `label_app` de KSM (N:1 → `group_left`)

```promql
sum by (pod) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))
* on(pod) group_left(label_app)
max by (pod, label_app) (kube_pod_labels{label_app!=""})
```

- LHS: uma série por `pod`;
    
- RHS: torne **único por `pod`** (use `max by (pod, label_app)`);
    
- `group_left(label_app)` **copia** `label_app` para o resultado.
    

### 4) 1:N mantendo labels da direita → `group_right`

```promql
service_route_owner_info                 # {route, team} (1 por rota)
* on(route) group_right(team)
rate(http_requests_total[5m])            # {instance, route} (várias por rota)
```

Resultado mantém **labels do RHS** (`instance`, `route`) e **copia** `team`.

---

## Checklist para “não dar many-to-many”

1. **Defina a chave** de casamento com `on(...)`/`ignoring(...)`.
    
2. **Teste unicidade** de cada lado:
    
    ```promql
    count by (<chave>) (<sua_expressao>)
    ```
    
    Se voltar >1 para alguma chave, **agregue** (`sum/max by (<chave>)`) ou use `group_left/right`.
    
3. Se for `group_*` com lado “muitos”, **liste labels suficientes** para tornar o **resultado único**:
    
    ```promql
    ... on(key) group_left(labelX,labelY) ...
    ```
    
4. Preferir, quando possível, **agregar antes** e ficar no 1:1 (mais simples/performático).
    

Se quiser, manda duas queries suas que estão dando erro e eu te devolvo a versão certa + explico qual chave ficou ambígua.