---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **Recording Rules no Prometheus: Definição, Propósito e Integração com os Conceitos Estudados**

As **Recording Rules** são um mecanismo poderoso do [[prometheus]] para **pré-computar métricas frequentes ou complexas**, armazenando resultados como novas séries temporais. Elas otimizam desempenho, reduzem custo de consultas e simplificam dashboards/alertas.

---

## **1. O que são Recording Rules?**
São regras definidas no Prometheus que:
1. **Executam consultas PromQL** em intervalos regulares.  
2. **Armazenam os resultados** como novas métricas no [[time-series|TSDB]].  
3. **São identificadas** por um novo nome (ex.: `instance:node_cpu:avg_rate5m`).  

### **Exemplo Prático:**
```yaml
groups:
  - name: cpu_aggregation
    rules:
      - record: instance:node_cpu:avg_rate5m
        expr: avg(rate(node_cpu_seconds_total[5m])) by (instance, mode)
```
- **`expr`**: Consulta PromQL que será executada periodicamente.  
- **`record`**: Nome da nova métrica gerada.  

---

## **2. Papel das Recording Rules no Prometheus**
### **a) Otimização de Desempenho**
- **Reduzem carga do Prometheus**: Consultas complexas (ex.: `rate()` sobre longos intervalos) são pré-computadas.  
- **Aceleram dashboards/alertas**: Grafana e Alertmanager consomem métricas pré-calculadas em vez de executar PromQL pesado.  

### **b) Simplificação de Consultas**
- **Abstraem complexidade**: Usuários finais consultam métricas simples (ex.: `instance:node_cpu:avg_rate5m`) em vez de fórmulas longas.  

### **c) Agregação de Dados**
- **Resumem métricas de alta granularidade**: Útil para downsampling ou visões consolidadas (ex.: "CPU média por zona").  

---

## **3. Como se Relacionam com os Conceitos Estudados?**
| Conceito                                                | Relação com Recording Rules                                                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **[[promql]]**                                          | As rules usam PromQL para definir as consultas pré-computadas.                                                 |
| **[[time-series\|TSDB]]**                               | Os resultados são armazenados como séries temporais no banco de dados.                                         |
| **[[scrapping\|Scraping]]**                               | As rules não substituem o scraping, mas processam métricas já coletadas.                                       |
| **[[service-discoverry-prometheus\|Service Discovery]]** | Podem agregar métricas de targets descobertos dinamicamente (ex.: `sum by (env) (up{job="kubernetes-pods"})`). |
| **[[relabeling]]**                                      | [[labels-prometheus\|Labels]] das métricas de origem são preservadas ou modificadas nas rules.                 |

---

## **4. Configuração no `prometheus.yml`**
As rules são definidas em arquivos separados (ex.: `rules.yml`) e referenciadas no `prometheus.yml`:
```yaml
rule_files:
  - '/etc/prometheus/rules/*.yml'  # Caminho para os arquivos de regras
```

### **Estrutura de um Arquivo de Rules:**
```yaml
groups:
  - name: example_rules
    interval: 1m  # Opcional: Intervalo de execução (sobrescreve o global)
    rules:
      - record: http_request:rate5m
        expr: rate(http_requests_total[5m])
      - record: instance:memory_usage:percent
        expr: (node_memory_MemTotal_bytes - node_memory_MemFree_bytes) / node_memory_MemTotal_bytes * 100
```

---

## **5. Casos de Uso Típicos**
### **a) Aceleração de Dashboards**
- **Problema**: Dashboard com `rate(http_requests_total[5m])` sobre 1.000 hosts.  
- **Solução**: Pré-calcular `http_request:rate5m` via recording rule.  

### **b) Agregação para Alertas**
- **Problema**: Alerta complexo como `avg_over_time(rate(api_errors[5m])[1h:1m]) > 0.1`.  
- **Solução**: Criar uma rule `record: api_errors:avg_rate1h`.  

### **c) Downsampling**
- **Problema**: Dados antigos ocupam espaço, mas são pouco acessados.  
- **Solução**: Criar rules que armazenem médias horárias (`record: metric:avg1h`).  

---

## **6. Boas Práticas**
1. **Nomes Claros**: Use prefixos como `:<agregação>:<granularidade>` (ex.: `:rate5m:`).  
2. **Evite Cardinalidade Alta**: Não crie rules que gerem muitas séries (ex.: agregue por `env` em vez de `instance`).  
3. **Monitore Rules**: Verifique métricas como `prometheus_rule_evaluation_failures_total`.  

---

## **7. Exemplo Avançado ([[kubernetes]] + Recording Rules)**
```yaml
groups:
  - name: k8s_aggregation
    rules:
      # Agrega CPU por namespace
      - record: namespace:cpu_usage:rate5m
        expr: sum(rate(container_cpu_usage_seconds_total[5m])) by (namespace)

      # Taxa de erro HTTP por serviço
      - record: service:http_errors:rate5m
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
          / sum(rate(http_requests_total[5m])) by (service)
```

---

## **8. Diferença entre Recording Rules e Alerting Rules**
| Feature | Recording Rules | Alerting Rules |
|---------|-----------------|----------------|
| **Propósito** | Pré-computar métricas | Disparar notificações |
| **Armazenamento** | Gera novas métricas no TSDB | Não armazena dados |
| **Exemplo** | `record: cpu:avg` | `alert: HighCPU` |

---

## **Resumo**
- **O que são**: Regras que pré-calculam métricas usando PromQL e armazenam resultados.  
- **Papel**: Otimizam desempenho, simplificam consultas e agregam dados.  
- **Integração**: Funcionam com TSDB, PromQL e métricas coletadas via scraping/service discovery.  
- **Configuração**: Definidas em arquivos YAML referenciados no `prometheus.yml`.  