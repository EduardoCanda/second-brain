---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
sub_categoria: query
ferramenta: prometheus
---
# **Instant Vector no PromQL: Conceito e Aplicações**

Um **Instant Vector** é um dos tipos de dados fundamentais no [[prometheus]] Query Language ([[promql]]), essencial para consultas em tempo real e alertas. Vamos explorar seu significado, características e como ele se diferencia de outros tipos de dados no Prometheus.

---

## **1. Definição de Instant Vector**
Um **Instant Vector** representa:
- Um conjunto de **séries temporais** (time series) **em um único momento no tempo** (o timestamp de avaliação da query).
- Cada série no vetor contém:
  - Um **valor numérico** atualizado.
  - Um conjunto de **labels** que a identificam.


### **Características Chave**
| Propriedade | Descrição |
|------------|-----------|
| **Timestamp único** | Todos os valores são do mesmo momento (último scrape). |
| **Estrutura** | Lista de séries temporais com valores + labels. |
| **Uso típico** | Alertas, visualizações em tempo real. |

---

## **2. Como um Instant Vector é Gerado?**
### **A. Consultas Diretas**
Ao consultar uma métrica sem especificar um intervalo (`[]`), você obtém um Instant Vector:
```promql
http_requests_total  # Retorna o valor MAIS RECENTE desta métrica
```

### **B. Funções que Retornam Instant Vectors**
Muitas funções do PromQL transformam Range Vectors em Instant Vectors:
```promql
rate(http_requests_total[5m])  # Converte um Range Vector (5m) em Instant Vector
```

---

## **3. Diferença Entre Instant Vector e Range Vector**
| Tipo               | Descrição                                          | Exemplo         |
| ------------------ | -------------------------------------------------- | --------------- |
| **Instant Vector** | Valores **no momento da query** (snapshot).        | `cpu_usage`     |
| **Range Vector**   | Múltiplos valores **em um intervalo** (histórico). | `cpu_usage[5m]` |

### **Exemplo Prático**
```promql
# Instant Vector (valor atual)
up

# Range Vector (valores nos últimos 5 minutos)
up[5m]
```

---

## **4. Aplicações Práticas**
### **A. Alertas em Tempo Real**
Instant Vectors são usados em regras de alerta:
```promql
# Alerta se alguma instância estiver offline
up == 0
```

### **B. Visualizações em Dashboards**
Grafana usa Instant Vectors para mostrar métricas atuais:
```promql
100 - (avg(node_cpu_seconds_total{mode="idle"}) by (instance) * 100)
```

### **C. Agregações**
Operadores como `sum()`, `avg()` atuam sobre Instant Vectors:
```promql
sum(http_requests_total) by (service)  # Soma atual por serviço
```

---

## **5. Como Identificar um Instant Vector?**
- **Sintaxe**: Não possui `[intervalo]` (ex.: `metric_name`).
- **API do Prometheus**: Na resposta JSON, um Instant Vector tem:
  ```json
  {
    "metric": {"label1": "value1"},
    "value": [timestamp, "valor"]
  }
  ```

---

## **6. Limitações**
- **Não mostra histórico**: Para tendências, use Range Vectors + funções como `rate()`.
- **Depende do scrape interval**: A "atualidade" do valor depende da configuração do `scrape_interval`.

---

## **7. Exemplo Completo**
### **Consulta**
```promql
# Instant Vector: Uso atual de CPU por instância
100 - (node_cpu_seconds_total{mode="idle"} * 100)
```
### **Saída**
```plaintext
node_cpu_seconds_total{instance="server1", mode="idle"} → 85.3
node_cpu_seconds_total{instance="server2", mode="idle"} → 72.1
```

---

## **Resumo**
| Conceito | Descrição |
|----------|-----------|
| **O que é?** | Snapshot de séries temporais em um momento específico. |
| **Quando usar?** | Alertas, métricas instantâneas, agregações. |
| **Gerado por** | Consultas diretas, funções como `rate()`, `sum()`. |
| **Diferente de** | Range Vector (dados históricos). |

**Próximo passo**: Experimente queries como `up` ou `node_memory_MemFree_bytes` no [Prometheus Console](http://localhost:9090/graph) para ver Instant Vectors em ação! 🚀