---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **PromQL: A Linguagem de Consulta do Prometheus**

PromQL (Prometheus Query Language) é uma linguagem poderosa e flexível projetada especificamente para consultar e agregar dados de séries temporais no [prometheus](prometheus.md). Ela permite filtrar, transformar e analisar métricas em tempo real ou em intervalos históricos.

---

## **1. Como o PromQL Funciona?**
PromQL opera sobre **[[time-series]])** (métricas + [labels-prometheus|labels](labels-prometheus%7Clabels.md) + timestamps) com os seguintes princípios:

### **A. Estrutura Básica**
```promql
<nome_da_métrica>{<filtro_de_labels>} [<intervalo_de_tempo>] <operador/função>
```
- **`nome_da_métrica`**: Ex.: `http_requests_total`.
- **`filtro_de_labels`**: Ex.: `{job="api-server", status="200"}`.
- **`intervalo_de_tempo`**: Opcional. Ex.: `[5m]` (últimos 5 minutos).
- **`operador/função`**: Ex.: `rate()`, `sum()`, `> 100`.

### **B. Tipos de Dados**
| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Instant Vector** | Único valor por série temporal (timestamp atual). | `http_requests_total` |
| **Range Vector** | Múltiplos valores em um intervalo. | `http_requests_total[5m]` |
| **Scalar** | Valor numérico simples. | `42` |
| **String** | Texto (usado em labels). | `"production"` |

---

## **2. Principais Funções e Operadores**
### **A. Funções de Agregação**
| Função | Descrição | Exemplo |
|--------|-----------|---------|
| `sum()` | Soma valores. | `sum(http_requests_total) by (job)` |
| `avg()` | Média aritmética. | `avg(node_cpu_seconds_total) by (mode)` |
| `max()`/`min()` | Maior/menor valor. | `max(container_memory_usage_bytes)` |
| `count()` | Conta séries. | `count(http_requests_total)` |

### **B. Funções de Taxa e Incremento**
| Função       | Descrição                                                 | Exemplo                                 |
| ------------ | --------------------------------------------------------- | --------------------------------------- |
| `rate()`     | Calcula taxa por segundo em um intervalo (para counters). | `rate(http_requests_total[5m])`         |
| `increase()` | Crescimento absoluto em um intervalo.                     | `increase(http_requests_total[1h])`     |
| `irate()`    | Taxa instantânea (amostras recentes).                     | `irate(node_network_receive_bytes[2m])` |

### **C. Funções de Transformação**
| Função                 | Descrição                       | Exemplo                                                                    |
| ---------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `histogram_quantile()` | Calcula quantis de histogramas. | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` |
| `label_replace()`      | Modifica labels.                | `label_replace(up, "new_label", "$1", "instance", "(.*):.*")`              |
| `abs()`/`ln()`         | Matemáticas.                    | `abs(delta(disk_free_bytes[1h]))`                                          |

### **D. Operadores Lógicos e Aritméticos**
| Operador              | Descrição            | Exemplo                                   |
| --------------------- | -------------------- | ----------------------------------------- |
| `==`, `!=`, `>`, `<`  | Filtros/comparações. | `http_errors > 10`                        |
| `+`, `-`, `*`, `/`    | Aritméticos.         | `memory_usage_bytes / 1024 / 1024` (→ MB) |
| `and`, `or`, `unless` | Lógicos.             | `up{job="api"} or up{job="web"}`          |

---

## **3. Exemplos Diversos de Consultas**
### **A. Monitoramento Básico**
```promql
# 1. Taxa de requisições HTTP por segundo (últimos 5 minutos)
rate(http_requests_total{job="api-server"}[5m])

# 2. Uso de CPU em porcentagem
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance) * 100)

# 3. Memória livre em MB
node_memory_MemFree_bytes / 1024 / 1024
```

### **B. Agregações Avançadas**
```promql
# 1. Requisições HTTP por status e serviço (agrupado por hora)
sum by (status, service) (rate(http_requests_total[1h]))

# 2. 95º percentil de latência de API
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# 3. Número de instâncias saudáveis por job
count(up) by (job)
```

### **C. Alertas e Anomalias**
```promql
# 1. Instâncias offline
up == 0

# 2. Erros HTTP acima de 5% do total
sum(rate(http_requests_total{status=~"5.."}[5m])) by (job)
  / sum(rate(http_requests_total[5m])) by (job) > 0.05

# 3. Crescimento anormal de tráfego
rate(http_requests_total[5m]) > 1.5 * rate(http_requests_total[15m] offset 1h)
```

### **D. Análise de Tendências**
```promql
# 1. Comparação com período anterior (week-over-week)
http_requests_total - http_requests_total offset 1w

# 2. Uso de disco projetado (extrapolação linear)
predict_linear(node_filesystem_free_bytes[6h], 3600*24) < 0  # Falta em 24h?
```

---

## **4. Dicas para Obter o Máximo do PromQL**
### **A. Otimização de Consultas**
- **Prefira `rate()`** em vez de `irate()` para intervalos longos.  
- **Use `[intervalo]` adequado**: Muito curto → ruído; muito longo → atraso.  
- **Evite alta cardinalidade**: Filtre labels desnecessárias.  

### **B. Boas Práticas**
1. **Nomeie consultas complexas** com [[recording-rules|recording rules]]:  
   ```yaml
   - record: job:http_errors:rate5m
     expr: sum(rate(http_requests_total{status=~"5.."}[5m])) by (job)
   ```
2. **Combine operadores** para lógica avançada:  
   ```promql
   # Tráfego alto E erro crescente
   rate(http_requests_total[5m]) > 1000 and rate(http_errors[5m]) > 50
   ```
3. **Use `offset`** para comparações temporais:  
   ```promql
   # Crescimento semanal
   rate(http_requests_total[1h] offset 7d)
   ```

### **C. Ferramentas Complementares**
- **[[grafana]]**: Visualização de dashboards com PromQL.  
- **[[alertmanager]]**: Alertas baseados em resultados de PromQL.  
- **PromLens**: Editor interativo para aprender PromQL.  

---

## **5. Exemplo Completo: Monitoramento de Kubernetes**
```promql
# 1. CPU usado por namespace (em núcleos)
sum(rate(container_cpu_usage_seconds_total[5m])) by (namespace)

# 2. Memória RSS por Pod (em MB)
sum(container_memory_rss_bytes) by (pod) / 1024 / 1024

# 3. Pods não saudáveis por deployment
count(up{job="kubernetes-pods"} == 0) by (deployment)
```

---

## **Resumo**
- **PromQL** é a linguagem para consultar métricas no Prometheus.  
- **Funções-chave**: `rate()`, `sum()`, `histogram_quantile()`, operadores lógicos.  
- **Casos de uso**: Dashboards, alertas, análise de tendências.  
- **Otimização**: Recording rules, filtros de labels, intervalos adequados.  