---
tags:
  - SRE
  - NotaBibliografica
  - Segurança
categoria: metricas
ferramenta: prometheus
---
# **Como Excluir Métricas Pós-Descoberta no Prometheus para Controlar Cardinalidade**

Para gerenciar a [[cardinalidade-metricas|cardinalidade]] no [[prometheus]], você pode excluir métricas indesejadas **após a descoberta** usando o mecanismo de **`metric_relabel_configs`**. Essa configuração permite filtrar, modificar ou descartar métricas **depois que elas são coletadas**, mas antes de serem armazenadas no [[time-series|TSDB]].

---

## **1. Onde Aplicar `metric_relabel_configs`?**
Adicione a seção `metric_relabel_configs` dentro de um `scrape_config` no `prometheus.yml` ou em um `ServiceMonitor` (se usar [[prometheus-operator]]).

### **Exemplo Básico:**
```yaml
scrape_configs:
  - job_name: 'my-app'
    static_configs:
      - targets: ['app:8080']
    metric_relabel_configs:
      - action: drop  # Descarta métricas que atendem à condição
        regex: 'debug_.*'  # Regex para métricas que começam com "debug_"
        source_labels: [__name__]
```

---

## **2. Ações Principais para Controle de Cardinalidade**
### **A. `drop` (Descarta Métricas)**
Remove métricas que correspondem a um padrão (regex):
```yaml
metric_relabel_configs:
  - source_labels: [__name__]
    regex: 'temp_.*|test_.*'  # Remove métricas que começam com "temp_" ou "test_"
    action: drop
```

### **B. `keep` (Mantém Apenas Métricas Específicas)**
Inverso do `drop` — mantém apenas as métricas que combinam com o regex:
```yaml
metric_relabel_configs:
  - source_labels: [__name__]
    regex: 'http_requests_total|cpu_usage'  # Mantém apenas essas métricas
    action: keep
```

### **C. `labeldrop` (Remove Labels)**
Elimina labels específicas para reduzir cardinalidade:
```yaml
metric_relabel_configs:
  - regex: 'user_id|session_id'  # Remove labels sensíveis ou de alta variabilidade
    action: labeldrop
```

### **D. `labelkeep` (Mantém Apenas Labels Úteis)**
Conserva apenas labels essenciais:
```yaml
metric_relabel_configs:
  - regex: 'env|service|instance'  # Mantém apenas essas labels
    action: labelkeep
```

---

## **3. Exemplos Práticos**
### **Caso 1: Remover Métricas de Debug**
```yaml
metric_relabel_configs:
  - source_labels: [__name__]
    regex: 'debug_.*'  # Descarta todas as métricas de debug
    action: drop
```

### **Caso 2: Filtrar Labels Dinâmicos**
```yaml
metric_relabel_configs:
  - regex: 'request_id|ip_address'  # Remove labels que causam alta cardinalidade
    action: labeldrop
```

### **Caso 3: Restringir Métricas de um Exporter Específico**
```yaml
metric_relabel_configs:
  - source_labels: [__name__]
    regex: 'node_cpu_seconds_total|node_memory_MemFree_bytes'  # Mantém apenas CPU e memória
    action: keep
```

---

## **4. Uso com Prometheus Operator**
Se você usa **Prometheus Operator**, aplique `metricRelabelings` no `ServiceMonitor` ou `PodMonitor`:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-service
spec:
  endpoints:
    - port: web
      metricRelabelings:
      - sourceLabels: [__name__]
        regex: 'unwanted_metric.*'
        action: drop
```

---

## **5. Como Validar?**
1. **Verifique as Métricas Coletadas**:
   ```bash
   curl http://<target>:<port>/metrics | grep -E "debug_|temp_"  # Teste se as métricas foram removidas
   ```
2. **Consulte o TSDB**:
   ```promql
   count({__name__=~".+"}) by (__name__)  # Lista métricas armazenadas
   ```
3. **Monitore Cardinalidade**:
   ```promql
   prometheus_tsdb_head_series  # Total de séries no TSDB
   ```

---

## **6. Boas Práticas**
1. **Teste Regras em Ambiente de Desenvolvimento** antes de aplicar em produção. 
2. **Combine com `relabel_configs`** para filtrar targets antes da coleta.  
3. **Documente Regras** para evitar perda de métricas críticas.  

---

## **Resumo das Ações**
| Objetivo | Configuração |
|----------|-------------|
| **Remover métricas** | `action: drop` + `regex` em `__name__` |
| **Remover labels** | `action: labeldrop` + `regex` no nome da label |
| **Manter apenas métricas/labels úteis** | `action: keep` ou `labelkeep` |

**Próximo passo**: Revise suas métricas atuais com `count({__name__=~".+"}) by (__name__)` e identifique candidatos a exclusão! 🛠️