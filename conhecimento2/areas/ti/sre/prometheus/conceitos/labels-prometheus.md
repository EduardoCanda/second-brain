---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
No **[[prometheus]]**, as **labels** (etiquetas) são um componente fundamental para **identificar, filtrar e agregar métricas de forma multidimensional**. Elas funcionam como metadados anexados às métricas, permitindo uma análise flexível e poderosa usando a linguagem **[[promql]]**.  

---

## **1. O que são Labels no Prometheus?**  
- São pares **chave-valor** associados a métricas (ex.: `instance="10.0.0.1:9100"`, `job="node-exporter"`).  
- **Não alteram o valor da métrica**, mas adicionam contexto (ex.: origem, ambiente, tipo de requisição).  
- Exemplo de métrica com labels:  
  ```plaintext
  http_requests_total{method="GET", endpoint="/api", status="200"} 42
  ```
  - `http_requests_total`: Nome da métrica.  
  - `method`, `endpoint`, `status`: Labels.  

---

## **2. Funções das Labels**  
### **a) Identificação de Fontes de Dados**  
Labels como `job` e `instance` diferenciam a origem das métricas:  
```plaintext
up{job="node-exporter", instance="10.0.0.1:9100"} 1
```
- `up=1` indica que o target está saudável.  

### **b) Filtragem e Agregação em PromQL**  
Permitem selecionar/subconjuntos de métricas:  
```promql
http_requests_total{status="500"}  // Filtra apenas erros 500.
sum(http_requests_total) by (method)  // Agrupa por método HTTP.
```

### **c) Organização em Ambientes Complexos**  
- Exemplo: Separar métricas por ambiente (`env=prod`), time (`team=devops`), ou região (`region=us-east`).  

---

## **3. Como as Labels são Adicionadas?**  
### **a) Automaticamente pelo Prometheus**  
- Labels padrão são injetadas durante a coleta ([[scrapping|scrape]]):  
  - `job`: Nome do job configurado em `prometheus.yml`.  
  - `instance`: Endereço do target (ex.: `10.0.0.1:9100`).  

### **b) Via Aplicação Monitorada**  
- Aplicações expõem métricas com labels personalizadas (ex.: em clientes como `Prometheus Client Library` para Python/Go).  
  ```python
  from prometheus_client import Counter
  requests = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
  requests.labels(method="GET", endpoint="/api").inc()
  ```

### **c) Relabeling (Pós-processamento)**  
- Regras no `prometheus.yml` para modificar/adicionar labels **antes** da ingestão:  
  ```yaml
  scrape_configs:
    - job_name: 'node-exporter'
      relabel_configs:
        - source_labels: [__meta_kubernetes_pod_name]  # Label temporária
          target_label: 'pod'  # Nova label
  ```
  - Usado em **[[service-discoverry-prometheus|service discovery]]** ([[kubernetes]], Consul) para enriquecer métricas.  

---

## **4. Labels Especiais (Reservadas)**  
Algumas labels são geradas automaticamente em cenários específicos:  
- `__name__`: Nome da métrica (ex.: `__name__="http_requests_total"`).  
- `__address__`: Endereço do target original.  
- `__meta_*`: Metadados em **service discovery** (ex.: `__meta_kubernetes_pod_name`).  

---

## **5. Boas Práticas com Labels**  
✅ **Use labels para dimensões variáveis** (ex.: `method`, `status_code`).  
❌ **Evite labels com alta [[cardinalidade-metricas|cardinalidade]]** (ex.: IDs únicos, timestamps), pois podem sobrecarregar o Prometheus.  
🔧 **Prefira relabeling** para padronizar labels em ambientes dinâmicos (Kubernetes).  

---

## **Exemplo Prático: Consulta com Labels**  
```promql
# Soma de requisições por método HTTP e endpoint
sum by (method, endpoint) (rate(http_requests_total[5m]))

# Filtra métricas de um job específico
node_cpu_seconds_total{job="node-exporter", mode="user"}
```

---

## **Resumo**  
- **Labels** são metadados que tornam as métricas do Prometheus **multidimensionais**.  
- Podem ser **adicionadas pela aplicação, service discovery ou relabeling**.  
- **PromQL** usa labels para filtros (`{}`), agregações (`by`, `group_left`), e joins.  
- Evite abusar de labels com valores únicos para não impactar performance.  

Se precisar de exemplos específicos (ex.: Kubernetes, relabeling), posso detalhar ainda mais! 😊