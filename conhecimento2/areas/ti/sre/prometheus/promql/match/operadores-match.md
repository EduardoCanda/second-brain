---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
bora! Em [[PromQL]], **“modificadores de _match_**”** são os que controlam **como séries da esquerda “casam” com séries da direita** em **operações binárias** (divisão, multiplicação, soma, comparações). São eles:

- **`on(label1, label2, …)`**
    
- **`ignoring(label1, label2, …)`**
    
- **`group_left([labels…])`**
    
- **`group_right([labels…])`**
    

> Eles **não** agregam nada; só definem **quem combina com quem**. Se precisar somar/médias, use agregadores (`sum by`, `avg by`) _antes_.

---

# Modelo mental (rápido)

- **Sem modificador**: uma série da esquerda só casa com **uma** da direita que tenha **exatamente os mesmos valores para todos os labels em comum** (exceto o nome da métrica). Se houver 0 ou >1 correspondências, dá erro.
    
- **`on(...)`**: diz “só considere **esses** labels para o casamento”.
    
- **`ignoring(...)`**: diz “considere **todos, exceto** estes”.
    
- **`group_left/right`**: permite **one-to-many** ou **many-to-one** quando o conjunto de séries de um lado é mais “granular”.
    

---

## 1) `on(...)` e `ignoring(...)`

### Quando usar

- Quando **os labels não batem exatamente** entre as duas expressões (um lado tem `status`, o outro não, etc.).
    
- Quando você quer **forçar** que o casamento seja por um subconjunto de labels (ex.: só por `route`).
    

### Exemplos

**Erro % por rota (duas abordagens corretas):**

(a) **Alinhar por agregação** (mais claro e comum):

```promql
# Numerador e denominador têm o MESMO conjunto de labels (route)
sum by (route) (rate(http_requests_total{status=~"5.."}[5m]))
/
sum by (route) (rate(http_requests_total[5m]))
```

(b) **Casar por rótulos sem agregar** (útil em explorações):

```promql
rate(http_requests_total{status=~"5.."}[5m])
/
ignoring(status) rate(http_requests_total[5m])
```

Aqui, dizemos: “ignore `status` na hora de casar”.

> Cuidado: ainda precisa ser **1:1** por `(job, instance, route, …)`; se o lado direito tiver múltiplas séries que casam, dá _many-to-many not allowed_.

**Comparar RPS por `route`, ignorando `instance`:**

```promql
sum by (route) (rate(http_requests_total[5m]))
/
ignoring(instance) sum by (route, instance) (rate(http_requests_total[5m]))
```

Melhor é só **agregar igual** dos dois lados; o exemplo mostra a ideia de `ignoring`.

---

## 2) `group_left` e `group_right`

Quando um lado tem **mais rótulos (maior cardinalidade)** e você precisa **combinar várias séries de um lado com uma do outro**.

- **`group_left`**: o **resultado fica com os labels da ESQUERDA** (left = “muitos”).  
    Use quando **cada série da esquerda** deve casar com **uma** da direita (one-to-many do ponto de vista do casamento).
    
- **`group_right`**: o **resultado fica com os labels da DIREITA** (right = “muitos”).
    

Você pode **copiar labels** do lado “muitos” para o resultado: `group_left(label_app, team)`.

### Exemplos práticos (de mercado)

**(a) Enriquecer métricas de pod com o label `app` do kube-state-metrics**

```promql
# Métrica “dinheiro”: CPU por pod (muitas séries, uma por container→pod)
sum by (pod) (
  rate(container_cpu_usage_seconds_total{container!=""}[5m])
)
* on(pod) group_left(label_app)
max by (pod, label_app) (
  kube_pod_labels{label_app!=""}
)
```

- `on(pod)`: casar **pelo pod**.
    
- `group_left(label_app)`: lado esquerdo tem “muitos” (pod), e queremos **trazer `label_app`** do lado direito para o resultado.
    

**(b) % de memória usada por **node** (many-to-one)**

```promql
# uso por node
sum by (node) (container_memory_working_set_bytes{container!=""})
/
on(node) group_left
kube_node_status_capacity_memory_bytes
```

- Várias séries de containers por `node` divididas pela **única** série de capacidade do `node`.
    
- `group_left` permite esse **many-to-one**.
    

**(c) RPS por rota “tagueado” com o time dono (join com tabela de rotas)**  
Suponha você exporte uma série “estática” por rota com o label `team`:

```promql
sum by (route) (rate(http_requests_total[5m]))
* on(route) group_left(team)
max by (route, team) (service_route_owner_info{team!=""})
```

Agora o resultado carrega `team`, útil para dashboards/alertas por equipe.

---

## Regras de bolso

- **Primeiro tente alinhar labels com agregação** (`sum by (...)`) — é mais simples e evita _many-to-many_.
    
- **`on(...)`** quando você quer **fixar** exatamente os labels de casamento.  
    **`ignoring(...)`** quando quer **remover** labels voláteis (`instance`, `pod`, `status`, …).
    
- **`group_left/right`** só quando realmente existe **1:N** (ou **N:1**).  
    Se aparecer o erro **“many-to-many matching not allowed”**, ou você **agrega antes** ou usa `group_left/right` com parcimônia.
    
- **Copiar labels** com `group_left/right(labelX,labelY)` é ótimo para **enriquecer** séries (ex.: `team`, `app`).
    
- Para **histogramas**, quase sempre **agregue antes** (ex.: `sum by (le, route)`), e só depois faça divisões/comparações — raramente precisa de `group_*` aqui.
    

---

## Bônus: `bool` (não é _match_, mas vive junto)

Em comparações (`>`, `<`, `!=`), o sufixo **`bool`** retorna **1/0** em vez de filtrar:

```promql
(rate(http_requests_total[5m]) > bool 100)
```

Útil para máscaras lógicas em composições.

---