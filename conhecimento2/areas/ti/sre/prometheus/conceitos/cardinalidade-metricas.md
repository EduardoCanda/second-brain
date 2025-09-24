---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
  - Segurança
categoria: metricas
ferramenta: prometheus
---
# **Cardinalidade no Prometheus: Impactos e Boas Práticas**

A **cardinalidade** no [[prometheus]] refere-se ao número total de **combinações únicas de métricas e [[labels-prometheus|labels]]** armazenadas no banco de dados de séries temporais. Quando mal gerenciada, ela pode causar problemas graves de desempenho e até tornar o sistema inoperante.  

---

## **1. Como a Cardinalidade Funciona no Prometheus?**
Cada métrica no Prometheus é identificada por:
- **Nome da métrica** (ex.: `http_requests_total`).
- **Labels** (ex.: `method="GET"`, `status="200"`, `endpoint="/api"`).

A cardinalidade é determinada pelo número de **[[time-series|séries temporais]] únicas**, geradas a partir das combinações desses elementos. Por exemplo:
```plaintext
http_requests_total{method="GET", status="200", endpoint="/api"} 10
http_requests_total{method="POST", status="500", endpoint="/login"} 5
```
- Cada linha acima é uma **série temporal distinta**.
- Se `method`, `status` e `endpoint` tiverem muitos valores possíveis, a cardinalidade explode.

---

## **2. Impactos da Alta Cardinalidade**
| Problema                                       | Causa                                                                      | Consequência                                                |
| ---------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Consumo excessivo de memória**               | Cada série única é armazenada em memória antes de ser persistida em disco. | O Prometheus pode travar ou ficar lento.                    |
| **Aumento do uso de CPU**                      | Consultas ([[promql]]) precisam varrer mais séries.                        | Lentidão nas queries e dashboards.                          |
| **Crescimento descontrolado do armazenamento** | Mais séries = mais dados em disco.                                         | Custo alto de armazenamento e backup.                       |
| **Dificuldade de escalabilidade**              | Limites físicos do servidor são atingidos mais rápido.                     | Necessidade de sharding ou alternativas como Thanos/Cortex. |

---

## **3. Principais Causas de Cardinalidade Explosiva**
1. **Labels com Valores Únicos ou Dinâmicos**  
   - Ex.: `user_id="123"`, `request_id="abc-xyz"`, `timestamp="1625097600"`.  
   - Cada valor gera uma nova série temporal.  

2. **Métricas Criadas em Tempo de Execução**  
   - Ex.: `errors_total{error="Failed to connect to DB: <detalhes>"}`.  
   - Strings dinâmicas criam séries infinitas.  

1. **[[service-discoverry-prometheus|Service Discovery]] sem Filtro**  
   - Kubernetes/Pods com muitas labels desnecessárias.  

4. **Métricas Não Agregadas**  
   - Ex.: Logar cada requisição individualmente em vez de usar contadores agregados.  

---

## **4. Boas Práticas para Controlar Cardinalidade**
### ✅ **1. Evite Labels com Alta Variabilidade**
- **Ruim**:  
  ```plaintext
  http_requests_total{user_id="123", ip="192.168.1.1"} 1
  ```
- **Bom**:  
  ```plaintext
  http_requests_total{method="GET", status="200"} 1
  ```

### ✅ **2. Use [[relabeling]] para Filtrar Labels Desnecessárias**
No `prometheus.yml`, descarte labels descontroladas:
```yaml
scrape_configs:
  - job_name: 'my-app'
    relabel_configs:
      - action: labeldrop   # Remove labels perigosas
        regex: 'user_id|ip' 
```

### ✅ **3. Agregação no Client-Side**
- Use **histogramas/summaries** para métricas de latência/tamanho em vez de logs brutos.  
- Exemplo (Prometheus Client em Python):  
  ```python
  from prometheus_client import Histogram
  REQUEST_TIME = Histogram('http_request_duration_seconds', 'HTTP latency', ['method'])
  ```

### ✅ **4. Limite o Número de Séries por Métrica**
- Defina limites no Prometheus (ex.: `--storage.tsdb.max-series`).  
- Monitore com:  
  ```promql
  count({__name__=~".+"}) by (__name__)  # Conta séries por métrica
  ```

### ✅ **5. Use [[recording-rules]] para Pré-agregação**
No `prometheus.yml`, agregue métricas antes de armazenar:
```yaml
rule_files:
  - 'aggregation.rules.yml'
```
Exemplo de regra (`aggregation.rules.yml`):
```yaml
groups:
  - name: http_requests_agg
    rules:
      - record: http_requests:rate5m
        expr: sum(rate(http_requests_total[5m])) by (method, status)
```

---

## **5. Como Monitorar a Cardinalidade?**
- **Métricas Úteis**:  
  ```promql
  prometheus_tsdb_head_series  # Total de séries ativas
  count({__name__=~".+"}) by (job)  # Séries por job
  ```
- **Ferramentas**:  
  - **[[grafana]] + Prometheus**: Dashboards de cardinalidade.  
  - **Prometheus TSDB Stats**:  
    ```sh
    curl http://prometheus:9090/api/v1/status/tsdb
    ```

---

## **6. Soluções para Ambientes com Alta Cardinalidade**
Se o Prometheus puro não for suficiente:
- **Thanos/Cortex**: Armazenamento distribuído e downsampling.  
- **VictoriaMetrics**: Otimizado para alta cardinalidade.  
- **Grafana Mimir**: Solução escalável baseada em Cortex.  

---

## **Resumo Final**  
| **Do** | **Don't** |  
|--------|-----------|  
| Use labels estáticas (`env`, `service`). | Use labels com valores únicos (`user_id`). |  
| Agregue métricas no client-side. | Exponha cada evento como uma métrica separada. |  
| Aplique relabeling para filtrar labels. | Deixe o service discovery gerar labels infinitas. |  
| Monitore `prometheus_tsdb_head_series`. | Ignore a cardinalidade até o sistema travar. |  
