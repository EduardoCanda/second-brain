---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
No **[[prometheus]]**, **jobs** são configurações que definem **grupos de alvos (targets)** que devem ser monitorados. Eles são usados para organizar e gerenciar como o Prometheus coleta métricas de diferentes serviços, aplicações ou endpoints.  

---

### **O que é um Job no Prometheus?**
- Um **job** é um conjunto de **targets** (endpoints que expõem métricas no formato Prometheus, como `/metrics`).  
- Cada job tem um nome único e é configurado no arquivo `prometheus.yml`.  
- O Prometheus **"[[scrapping]]"** (coleta) métricas desses targets em intervalos regulares.  

---

### **Exemplo de Configuração no `prometheus.yml`**
```yaml
scrape_configs:
  - job_name: 'node-exporter'       # Nome do Job (ex.: coletar métricas de servidores)
    scrape_interval: 15s            # Frequência de coleta
    static_configs:
      - targets: ['server1:9100', 'server2:9100']  # Lista de alvos (IP:porta)
        labels:
          env: 'production'         # Labels adicionais para agrupamento
```

---

### **Funções Principais de um Job**  
1. **Agrupar [[targets-prometheus]] Similares**  
   - Exemplo: Um job chamado `api-server` pode monitorar múltiplas instâncias de um serviço de API.  

2. **Definir Frequência de Coleta (`scrape_interval`)**  
   - Controla com que frequência o Prometheus busca métricas.  

1. **Adicionar [[labels-prometheus]] aos Targets**  
   - Labels (como `env=production`) ajudam a filtrar e agregar métricas no [[promql]].  

4. **Configurar Métodos de Descoberta de Targets**  
   - Além de listas estáticas (`static_configs`), jobs podem usar:  
     - **Service Discovery** ([[kubernetes]], Consul, AWS [[EC2]]).  
     - **File-based Discovery** (lista de targets em um arquivo JSON/YAML).  

---

### **Tipos Comuns de Jobs**
| Nome do Job         | Descrição                                  | Exemplo de Target             |
| ------------------- | ------------------------------------------ | ----------------------------- |
| `node-exporter`     | Coleta métricas de máquinas (CPU, memória) | `server1:9100`                |
| `kubernetes-pods`   | Monitora pods no Kubernetes                | Descoberta automática via API |
| `blackbox-exporter` | Verifica disponibilidade de URLs           | `http://example.com/probe`    |
| `api-service`       | Monitora métricas de microsserviços        | `api:8080/metrics`            |

---

### **Como os Jobs são Usados no PromQL?**
- As métricas coletadas por um job podem ser filtradas usando o label `job="<nome>"`.  
- Exemplo:  
  ```promql
  up{job="node-exporter"}  # Verifica quais targets do job estão ativos
  rate(http_requests_total{job="api-service"}[5m])  # Taxa de requisições da API
  ```

---

### **[[service-discoverry-prometheus]]: Jobs Dinâmicos**
Em ambientes como **Kubernetes**, os jobs podem ser configurados para descobrir targets automaticamente:  
```yaml
- job_name: 'kubernetes-pods'
  kubernetes_sd_configs:  # Descobre pods do Kubernetes
    - role: pod
  relabel_configs:        # Filtra e ajusta labels
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
```

---

### **Resumo**
- **Jobs** são blocos de configuração que definem **o quê** e **como** o Prometheus deve monitorar.  
- Podem ser **estáticos** (lista fixa de targets) ou **dinâmicos** (service discovery).  
- São essenciais para organizar métricas em ambientes escaláveis (ex.: Kubernetes, cloud).  

Se precisar de ajuda para configurar um job específico, posso dar exemplos mais detalhados! 🚀