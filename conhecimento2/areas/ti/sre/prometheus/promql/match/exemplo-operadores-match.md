---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
# 1) `ignoring(...)` — casa séries **ignorando** certos labels

**Objetivo:** erro% por instância e rota, ignorando o [[labels-prometheus|label]] `status` no casamento.

**Esquerda (LHS):** `rate(http_requests_total{status=~"5.."}[5m])`

```
{job="api", instance="api-0", route="/checkout", status="5xx"}  0.30
{job="api", instance="api-1", route="/checkout", status="5xx"}  0.60
```

**Direita (RHS):** `rate(http_requests_total[5m])`

```
{job="api", instance="api-0", route="/checkout"}  12.0
{job="api", instance="api-1", route="/checkout"}  18.0
```

**Operação:**

```promql
rate(http_requests_total{status=~"5.."}[5m])
/
ignoring(status) rate(http_requests_total[5m])
```

**Resultado (mantém os labels do LHS):**

```
{job="api", instance="api-0", route="/checkout", status="5xx"}  0.30 / 12.0 = 0.0250
{job="api", instance="api-1", route="/checkout", status="5xx"}  0.60 / 18.0 = 0.0333
```

> Dica: normalmente depois você **agrega** (ex.: `avg by (route)`) para tirar `status`/`instance` e exibir “erro% por rota”.

---

# 2) `on(...)` — casa séries **apenas** pelos labels listados

**Objetivo:** uso de capacidade por **rota**, casando LHS e RHS **somente por `route`**.

**Esquerda (LHS):** `sum by (route) (rate(http_requests_total[5m]))`

```
{route="/checkout"}  30
{route="/cart"}      10
```

**Direita (RHS):** métrica de capacidade-alvo por rota, `route_capacity_rps`

```
{route="/checkout"}  50
{route="/cart"}      20
```

**Operação:**

```promql
sum by (route) (rate(http_requests_total[5m]))
/
on(route) route_capacity_rps
```

**Resultado (mantém labels do LHS):**

```
{route="/checkout"}  30/50 = 0.60
{route="/cart"}      10/20 = 0.50
```

> Sem `on(route)`, o Prometheus tentaria casar por **todos** os labels comuns — aqui daria na mesma, mas `on(...)` te protege quando há labels extras de um lado.

---

# 3) `group_left(...)` — permite **many-to-one**, mantendo labels da **esquerda** e **copiando** alguns da direita

**Objetivo:** “enriquecer” CPU por [[pod]] com o [[label-kubernetes|label]] `label_app` vindo do KSM.

**Esquerda (LHS):** `sum by (pod) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))`

```
{pod="pod-a"}  0.50
{pod="pod-b"}  0.30
```

**Direita (RHS):** `max by (pod, label_app) (kube_pod_labels{label_app!=""})`

```
{pod="pod-a", label_app="checkout"}   1
{pod="pod-b", label_app="relatorios"} 1
```

**Operação (multiplica por 1 só para “puxar” o label):**

```promql
sum by (pod) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))
* on(pod) group_left(label_app)
max by (pod, label_app) (kube_pod_labels{label_app!=""})
```

**Resultado (mantém labels do LHS **+** copia `label_app`):**

```
{pod="pod-a", label_app="checkout"}     0.50
{pod="pod-b", label_app="relatorios"}   0.30
```

> `group_left(label_app)` diz: “o lado **esquerdo** tem **muitos**; traga o label `label_app` do lado direito para cada série à esquerda que casar por `pod`”.

---

# 4) `group_right(...)` — permite **one-to-many**, mantendo labels da **direita** e **copiando** alguns da esquerda

**Objetivo:** anexar o `team` (por rota) às séries de **RPS por instância e rota**, mantendo os labels detalhados do **lado direito**.

**Esquerda (LHS):** tabela “dona” da rota

```
service_route_owner_info:
{route="/checkout", team="core-api"}  1
{route="/cart",     team="growth"}    1
```

**Direita (RHS):** `rate(http_requests_total[5m])` (por instância e rota)

```
{instance="api-0", route="/checkout"}  12
{instance="api-1", route="/checkout"}  18
{instance="api-0", route="/cart"}       5
{instance="api-1", route="/cart"}       5
```

**Operação (de novo, multiplicando por 1 só para “puxar” label):**

```promql
service_route_owner_info
* on(route) group_right(team)
rate(http_requests_total[5m])
```

**Resultado (mantém labels do RHS **+** copia `team` do LHS):**

```
{instance="api-0", route="/checkout", team="core-api"}  12
{instance="api-1", route="/checkout", team="core-api"}  18
{instance="api-0", route="/cart",     team="growth"}     5
{instance="api-1", route="/cart",     team="growth"}     5
```

> `group_right(team)` diz: “o lado **direito** tem **muitos**; mantenha os **labels do direito** e copie `team` do esquerdo usando `route` como chave”.

---

## Regras rápidas pra não tropeçar

- **Sem `group_*`**, o _match_ precisa ser **1:1**; se virar 1:N ou N:1 → erro “many-to-many not allowed”.
    
- **Saída mantém os labels do lado esquerdo**, **a menos** que você use `group_right` (aí mantém os do direito).  
    Com `group_left/right(labels...)` você **copia** labels adicionais do lado “um”.
    
- **Prefira agregar antes** (`sum by (...)`) quando possível; _match_ fica mais simples e barato.


