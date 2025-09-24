---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
No [[promql]] (Prometheus Query Language), você pode usar **expressões regulares** para filtrar métricas com base em padrões de texto nas labels, funcionando de forma similar a um "LIKE" do SQL. Aqui estão as principais abordagens:

---

## **1. Operadores de Correspondência Regex em Labels**
PromQL suporta os seguintes operadores para correspondência de padrões:

| Operador | Descrição                                | Exemplo                                |
| -------- | ---------------------------------------- | -------------------------------------- |
| `=~`     | **"LIKE" (corresponde a regex)**         | `http_requests_total{path=~"/api/.*"}` |
| `!~`     | **"NOT LIKE" (não corresponde a regex)** | `http_requests_total{status!~"4.."}`   |

---

## **2. Exemplos Práticos**
### **A. Filtrar métricas com labels que contêm uma substring**
```promql
http_requests_total{service=~".*user.*"}  # Labels de serviço que contêm "user"
```
- `.*` significa "qualquer caractere (0 ou mais vezes)".

### **B. Filtrar por prefixo/sufixo**
```promql
cpu_usage{instance=~"prod-.*"}  # Instâncias que começam com "prod-"
disk_usage{device=~".*ssd"}  # Dispositivos que terminam com "ssd"
```

### **C. Combinar múltiplas condições**
```promql
http_errors_total{status=~"5..", path=~"/v1/.*"}  # Erros 5xx em caminhos "/v1/"
```

### **D. Exclusão de padrões**
```promql
up{job!~"test-.*"}  # Jobs que NÃO começam com "test-"
```

---

## **3. Casos Especiais**
### **A. Filtrar no nome da métrica (`__name__`)**
```promql
{__name__=~"http_.*_total"}  # Todas as métricas que começam com "http_" e terminam com "_total"
```

### **B. Escape de caracteres especiais**
Se você precisar buscar caracteres como `.` ou `*` literalmente, use `\\`:
```promql
http_requests_total{path=~"/v1\\.0/.*"}  # Caminhos com "/v1.0/"
```

---

## **4. Dicas de Performance**
- **Evite regex muito amplos** (ex.: `.*`) em grandes conjuntos de dados.
- **Prefira filtros específicos** quando possível:
  ```promql
  http_requests_total{service="user-service"}  # Mais eficiente que service=~"user.*"
  ```

---

## **5. Exemplo Completo**
Suponha que você queira encontrar todas as métricas de CPU de nós [[kubernetes]] cujos nomes contenham `worker` ou `prod`:
```promql
node_cpu_seconds_total{instance=~".*(worker|prod).*"}
```

---

## **Resumo**
| Operação     | Sintaxe PromQL      | Equivalente SQL                   |     |
| ------------ | ------------------- | --------------------------------- | --- |
| **LIKE**     | `label=~"padrão"`   | `WHERE label LIKE '%padrão%'`     |     |
| **NOT LIKE** | `label!~"padrão"`   | `WHERE label NOT LIKE '%padrão%'` |     |
| **Prefixo**  | `label=~"^prefixo"` | `WHERE label LIKE 'prefixo%'`     |     |
| **Sufixo**   | `label=~"sufixo$"`  | `WHERE label LIKE '%sufixo'`      |     |

**Próximo passo**: Use o [Prometheus Console](http://localhost:9090/graph) para testar suas queries com regex! 🔍