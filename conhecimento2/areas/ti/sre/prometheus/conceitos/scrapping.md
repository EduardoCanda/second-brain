---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **Scraping no Prometheus: Conceito, Funcionamento e Arquitetura**

O **scraping** (ou "raspagem") é o coração da coleta de métricas no [[prometheus]], responsável por extrair dados de métricas de [[targets-prometheus|targets]] (alvos) de forma periódica e armazená-los no banco de dados de séries temporais ([[time-series|TSDB]]).

---

## **1. Conceito de Scraping**
O scraping é o processo pelo qual o Prometheus:
1. **Acessa endpoints** (normalmente `/metrics`) em targets configurados.  
2. **Coleta métricas** no formato Prometheus (texto simples).  
3. **Armazena os dados** no TSDB com um timestamp.  

É um modelo **pull-based**: o Prometheus "puxa" métricas dos targets, diferentemente de sistemas push como Graphite.

---

## **2. Como Funciona o Scraping?**
### **Fluxo do Scraping**
1. **Definição dos Targets**:  
   - Configurados em `prometheus.yml` (estáticos) ou descobertos via **[[service-discoverry-prometheus|service discovery]]** ([[kubernetes]], Consul, etc.).  
   - Exemplo:
     ```yaml
     scrape_configs:
       - job_name: 'node-exporter'
         static_configs:
           - targets: ['10.0.0.1:9100', '10.0.0.2:9100']
     ```

2. **Requisição HTTP**:  
   - O Prometheus faz um GET no endpoint `/metrics` do target (ou caminho customizado).  
   - Exemplo de resposta:
     ```plaintext
     http_requests_total{method="GET", status="200"} 42
     cpu_usage{core="0"} 1.5
     ```

3. **Processamento e Armazenamento**:  
   - As métricas são parseadas, associadas a labels e armazenadas no TSDB com um timestamp.  

4. **Periodicidade**:  
   - O scraping ocorre em intervalos definidos por `scrape_interval` (padrão: 15s).  

---

## **3. Onde o Scraping é Declarado?**
No arquivo de configuração **`prometheus.yml`**, na seção `scrape_configs`:
```yaml
scrape_configs:
  - job_name: 'api-server'          # Nome do grupo de targets
    scrape_interval: 30s           # Frequência de coleta
    metrics_path: '/metrics'        # Endpoint padrão (pode ser customizado)
    static_configs:
      - targets: ['api:8080']      # Lista de alvos
    relabel_configs:                # Pós-processamento de labels
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod_name
```

---

## **4. Principal Finalidade do Scraping**
- **Coletar métricas** de forma padronizada (formato Prometheus).  
- **Manter dados atualizados** para consultas em tempo real.  
- **Integrar-se com ambientes dinâmicos** (Kubernetes, cloud) via service discovery.  

---

## **5. Posição na Arquitetura do Prometheus**
O scraping está no **núcleo do fluxo de dados**:
1. **Service Discovery** → Lista targets dinâmicos.  
2. **Scraping** → Coleta métricas dos targets.  
3. **TSDB** → Armazena séries temporais.  
4. **[[promql]]** → Consulta os dados raspados.  

```mermaid
graph LR
  A[Service Discovery] --> B[Scraping]
  B --> C[TSDB]
  C --> D[PromQL/Grafana]
```

### **Componentes Envolvidos**
- **[[prometheus-server]]**: Executa o scraping.  
- **Exporters/Instrumentação**: Disponibilizam métricas no formato correto.  
- **Pushgateway**: Permite scraping de jobs de curta duração (ex.: batch jobs).  

---

## **6. Tipos de Scraping**
| Tipo                  | Descrição                                | Exemplo                      |
| --------------------- | ---------------------------------------- | ---------------------------- |
| **HTTP Scraping**     | Coleta padrão via HTTP GET.              | `http://target:9090/metrics` |
| **Service Discovery** | Targets descobertos dinamicamente.       | Kubernetes, Consul, AWS EC2  |
| **Pushgateway**       | Métricas "empurradas" por jobs efêmeros. | Jobs Cron                    |

---

## **7. Boas Práticas**
1. **Defina `scrape_interval` adequado**:  
   - Balanceie entre precisão e carga no sistema (ex.: 15s para infra, 1m para apps estáveis).  
1. **Use [[relabeling|relabeling]] para filtrar targets**:  
   - Evite coletar métricas desnecessárias (alta cardinalidade).  
3. **Monitore falhas de scraping**:  
   - Verifique a métrica `up{job="..."}` para targets inacessíveis.  

---

## **8. Exemplo de Scraping com Kubernetes**
```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:   # Service Discovery
      - role: pod
    relabel_configs:
      # Filtra apenas Pods com annotation "prometheus.io/scrape=true"
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      # Define o caminho de scraping a partir de uma annotation
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        target_label: __metrics_path__
```

---

## **Resumo**
- **Scraping** é o mecanismo de coleta de métricas **pull-based** do Prometheus.  
- **Declarado em `scrape_configs`** no `prometheus.yml`.  
- **Integra-se com service discovery** para ambientes dinâmicos.  
- **Posição central na arquitetura**: Conecta descoberta de targets, armazenamento e consulta. 