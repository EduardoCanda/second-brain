---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
No [[prometheus]], as métricas são classificadas em **quatro tipos principais**, cada um com características específicas que determinam como os dados são armazenados, agregados e consultados. Esses tipos são fundamentais para modelar corretamente seus dados de monitoramento.

---

### **1. Counter (Contador)**
- **O que é:** Uma métrica que só **aumenta** (ou é reiniciada para zero em reinicializações).  
- **Uso típico:**  
  - Número total de requisições HTTP (`http_requests_total`).  
  - Quantidade de erros ocorridos (`errors_total`).  
- **Características:**  
  - Pode ser usada com `rate()`, `increase()` e `sum()` no PromQL para calcular crescimentos em intervalos.  
  - Exemplo de PromQL:  
    ```promql
    rate(http_requests_total{method="GET"}[5m])  // Número de requisições GET por segundo (avg).
    ```

---

### **2. [[metrica-gauge|Gauge]] (Medidor)**
- **O que é:** Uma métrica que **aumenta ou diminui** (valor instantâneo).  
- **Uso típico:**  
  - Uso de CPU/memória (`cpu_usage`).  
  - Número de conexões ativas (`connections_active`).  
  - Tamanho de uma fila (`queue_size`).  
- **Características:**  
  - Permite operações como `avg()`, `min()`, `max()` e `delta()`.  
  - Exemplo de PromQL:  
    ```promql
    avg(cpu_usage{instance="web-server"}) by (environment)  // CPU médio por ambiente.
    ```

---

### **3. Histogram (Histograma)**
- **O que é:** Amostra observações e as agrupa em **intervalos pré-definidos** (buckets), além de contar o total e a soma dos valores.  
- **Uso típico:**  
  - Tempo de resposta de API (`http_request_duration_seconds`).  
  - Tamanho de payloads (`response_size_bytes`).  
- **Características:**  
  - Gera múltiplas séries temporais:  
    - `<metric>_bucket{le="<upper_bound>"}` (contagem por bucket).  
    - `<metric>_sum` (soma total dos valores).  
    - `<metric>_count` (número total de observações).  
  - Exemplo de PromQL para calcular o percentil 90:  
    ```promql
    histogram_quantile(0.90, rate(http_request_duration_seconds_bucket[5m]))
    ```

---

### **4. Summary (Resumo)**
- **O que é:** Similar ao histograma, mas calcula **quantis diretamente no cliente** (aplicação) antes de enviar ao Prometheus.  
- **Uso típico:**  
  - Latência em aplicações onde os quantis são críticos (`request_latency_seconds`).  
- **Características:**  
  - Gera séries como:  
    - `<metric>{quantile="0.95"}` (valor do percentil 95).  
    - `<metric>_sum` e `<metric>_count` (iguais ao histograma).  
  - **Diferença para Histograma:**  
    - O Summary é calculado no lado do cliente, enquanto o Histograma é agregado no Prometheus.  
    - Summary não permite agregação pós-coleta (ex.: calcular quantis entre múltiplas instâncias).  

---

### **Exemplo Prático de Cada Tipo**
```plaintext
# Counter
http_requests_total{method="POST", status="200"} 42

# Gauge
memory_usage_bytes{host="server1"} 1.2e+09

# Histogram
http_request_duration_seconds_bucket{le="0.1"} 12
http_request_duration_seconds_bucket{le="0.5"} 35
http_request_duration_seconds_sum 89.7
http_request_duration_seconds_count 100

# Summary
api_latency_seconds{quantile="0.5"} 0.2
api_latency_seconds_sum 45.3
api_latency_seconds_count 120
```

---

### **Quando Usar Cada Tipo?**
| Tipo       | Melhor Para Casos de... | Cuidados |
|------------|-------------------------|----------|
| **Counter** | Eventos cumulativos (requisições, erros). | Não usar para valores que podem diminuir. |
| **Gauge**   | Estados instantâneos (CPU, memória). | Valores podem flutuar livremente. |
| **Histogram** | Distribuição de valores (latência, tamanhos). | Definir buckets adequados para seus dados. |
| **Summary** | Quantis pré-calculados (ex.: latência SLA). | Não permite agregação entre instâncias. |

---

### **Dica Importante**
- **Evite usar Summary** em ambientes dinâmicos (como Kubernetes), pois os quantis não podem ser agregados entre diferentes pods. Prefira **Histogram** nesses casos.  

Se precisar de ajuda para escolher ou modelar métricas, posso dar exemplos mais específicos! 😊