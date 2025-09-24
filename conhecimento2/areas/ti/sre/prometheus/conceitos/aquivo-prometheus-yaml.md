---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **O Arquivo `prometheus.yml`: Estrutura e Principais Atributos**

O arquivo `prometheus.yml` é o coração da configuração do [[prometheus]], definindo **como, onde e o que** o Prometheus deve monitorar. Ele segue um formato YAML e é dividido em seções lógicas para organizar [[scrapping|scraping]], [[service-discoverry-prometheus|service discovery]], regras e configurações globais.

---

## **1. Estrutura Básica do `prometheus.yml`**
```yaml
global:
  # Configurações globais (aplicáveis a todos os jobs)

scrape_configs:
  # Lista de jobs para coleta de métricas (scraping)

rule_files:
  # Arquivos com recording/alerting rules

alerting:
  # Configurações do Alertmanager
```

---

## **2. Principais Seções e Atributos**

### **A. Seção `global`**
Define configurações padrão para todos os jobs de scraping:

| Atributo | Descrição | Exemplo |
|----------|-----------|---------|
| `scrape_interval` | Intervalo entre scrapes (padrão: `15s`). | `30s` |
| `evaluation_interval` | Intervalo para avaliar regras (padrão: `15s`). | `1m` |
| `external_labels` | Labels aplicadas a todas as métricas/alertas. | `{ env: "prod", region: "us-east" }` |

**Exemplo**:
```yaml
global:
  scrape_interval: 30s
  evaluation_interval: 1m
  external_labels:
    env: "production"
```

---

### **B. Seção `scrape_configs`**
Lista de **[[jobs-do-prometheus|jobs]]** para coleta de métricas. Cada job pode ter:

| Atributo                | Descrição                                                       | Exemplo                      |
| ----------------------- | --------------------------------------------------------------- | ---------------------------- |
| `job_name`              | Nome identificador do job.                                      | `node-exporter`              |
| `metrics_path`          | Caminho do endpoint de métricas (padrão: `/metrics`).           | `/custom-metrics`            |
| `static_configs`        | Lista estática de [[targets-prometheus\|targets]].              | `targets: ["10.0.0.1:9100"]` |
| `relabel_configs`       | Regras para pós-processamento de [[labels-prometheus\|labels]]. | (Veja abaixo)                |
| `kubernetes_sd_configs` | Service discovery para [[kubernetes]].                          | `role: pod`                  |
| `ec2_sd_configs`        | Service discovery para [[AWS]] [[EC2]].                         | `region: us-east-1`          |

**Exemplo com Kubernetes**:
```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

---

### **C. Seção `rule_files`**
Carrega arquivos com **[[recording-rules|recording rules]]** e **alerting rules**:

| Atributo | Descrição | Exemplo |
|----------|-----------|---------|
| `rule_files` | Lista de caminhos para arquivos de regras. | `- 'rules/*.yml'` |

**Exemplo**:
```yaml
rule_files:
  - 'recording_rules.yml'
  - 'alerting_rules.yml'
```

---

### **D. Seção `alerting`**
Configura o **[[alertmanager]]** para notificações:

| Atributo | Descrição | Exemplo |
|----------|-----------|---------|
| `alertmanagers` | Lista de Alertmanagers. | `static_configs: { targets: ["alertmanager:9093"] }` |

**Exemplo**:
```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - "alertmanager:9093"
```

---

## **3. Atributos Avançados**

### **A. `relabel_configs`**
Modifica labels **antes** da coleta (útil para service discovery):

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `source_labels` | Labels de origem. | `[__meta_kubernetes_pod_name]` |
| `target_label` | Label de destino. | `pod_name` |
| `action` | Ação (replace, keep, drop, etc.). | `replace` |
| `regex` | Filtro por expressão regular. | `"(.+)-[a-z0-9]+"` |

**Exemplo**:
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_pod_name]
    target_label: pod
    action: replace
```

---

### **B. `metric_relabel_configs`**
Modifica labels **após** a coleta (evita alta cardinalidade):

**Exemplo**:
```yaml
metric_relabel_configs:
  - source_labels: [instance]
    regex: "(.*):\\d+"
    target_label: hostname
    replacement: "$1"
```

---

## **4. Exemplo Completo**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 30s
  external_labels:
    env: "prod"

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance_ip

  - job_name: 'kubernetes-services'
    kubernetes_sd_configs:
      - role: service
    metrics_path: '/metrics'
    relabel_configs:
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true

rule_files:
  - 'alerts.yml'
  - 'recording_rules.yml'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

---

## **5. Boas Práticas**
1. **Organize por ambiente**: Use includes ou múltiplos arquivos YAML para `dev`/`prod`.  
2. **Comente configurações**: Adicione `# comments` para explicar regras complexas.  
3. **Valide sintaxe**: Use `promtool check config prometheus.yml`.  
4. **Evite repetição**: Use `yaml anchors` para configurações repetidas.  

---

## **6. Ferramentas Úteis**
- **Promtool**: Valida sintaxe e testa regras.  
- **[[grafana]]**: Importe dashboards prontos para métricas do Prometheus.  
- **Prometheus Web UI**: Acesse `http://<prometheus>:9090/config` para ver o arquivo carregado.  

---

## **Resumo**
| Seção | Função Principal |
|-------|------------------|
| `global` | Define intervalos e labels globais. |
| `scrape_configs` | Configura jobs de scraping (estáticos ou dinâmicos). |
| `rule_files` | Carrega regras de alerta/agregação. |
| `alerting` | Integra com Alertmanager. |
| `relabel_configs` | Manipula labels para controle fino. |

O `prometheus.yml` é **altamente flexível** — personalize conforme suas necessidades de monitoramento! 🚀