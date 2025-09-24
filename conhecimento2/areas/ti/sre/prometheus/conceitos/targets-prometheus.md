---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **Targets no Prometheus: Definição e Funcionamento**

No **[[prometheus]]**, **targets** (alvos) são os endpoints ou serviços dos quais o Prometheus coleta métricas. Eles representam as fontes de dados que o Prometheus "raspa" (*[[scrapping|scrapes]]*) periodicamente para obter métricas no formato compatível (geralmente expostas via [[protocolo-https|HTTP]] em `/metrics`).

---

## **1. O que é um Target?**
- Um **target** é um endereço (ex.: `10.0.0.1:9100`) que expõe métricas em formato Prometheus.  
- Pode ser:  
  - Um **exportador** (ex.: `node-exporter` para métricas de servidor).  
  - Uma **aplicação instrumentada** (ex.: um microsserviço com `/metrics`).  
  - Um **gateway** (ex.: `Pushgateway` para jobs de curta duração).  

---

## **2. Como os Targets são Configurados?**
São definidos no arquivo `prometheus.yml` sob `scrape_configs`, associados a um **job**:
```yaml
scrape_configs:
  - job_name: 'node-exporter'   # Nome do grupo de targets
    static_configs:
      - targets: ['10.0.0.1:9100', '10.0.0.2:9100']  # Lista de targets
    labels:                     # Labels adicionais para esses targets
      env: 'production'
```
- **`job_name`**: Agrupa targets similares (ex.: todos os `node-exporters`).  
- **`static_configs`**: Lista fixa de targets (IP/porta).  
- **[[labels-prometheus|labels]]**: Metadados adicionais para filtrar métricas.  

---

## **3. Tipos de [[service-discoverry-prometheus|Discovery]] de Targets**
O Prometheus suporta múltiplas formas de descobrir targets dinamicamente:

| Método                     | Descrição                              | Exemplo                      |
| -------------------------- | -------------------------------------- | ---------------------------- |
| **Static Config**          | Lista manual de targets.               | `targets: ['10.0.0.1:9090']` |
| **File-Based**             | Targets em arquivos JSON/YAML.         | `file_sd_configs`            |
| **[[protocolo-dns\|DNS]]** | Descobre targets via SRV/AAAA records. | `dns_sd_configs`             |
| **[[kubernetes]]**         | Descobre Pods, Services, etc.          | `kubernetes_sd_configs`      |
| **Consul/AWS [[EC2]]**     | Integração com serviços de cloud.      | `consul_sd_configs`          |

Exemplo para Kubernetes:
```yaml
- job_name: 'kubernetes-pods'
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
```

---

## **4. Como o Prometheus Monitora Targets?**
- **Endpoint `/metrics`**: O Prometheus faz HTTP GET nesse endpoint para coletar métricas.  
- **Health Check**: A métrica `up{job="..."}` indica se o target está respondendo:  
  - `up=1`: Target saudável.  
  - `up=0`: Target inacessível.  

Exemplo de consulta:
```promql
up{job="node-exporter"}  # Verifica status dos targets do node-exporter
```

---

## **5. Labels Especiais em Targets**
Algumas labels são automaticamente associadas a targets:
- `instance`: Endereço do target (ex.: `10.0.0.1:9100`).  
- `job`: Nome do job que configura o target.  
- `__meta_*`: Metadados em service discovery (ex.: `__meta_kubernetes_pod_name`).  

---

## **6. Boas Práticas com Targets**
1. **Use Service Discovery** em ambientes dinâmicos (Kubernetes, cloud).  
2. **Filtre Targets** com [[relabeling|relabel_configs]] para evitar coleta desnecessária.  
3. **Adicione Labels** para enriquecer contexto (ex.: `env=prod`, `region=us-east`).  
4. **Monitore `up`** para detectar targets offline.  

---

## **7. Exemplo de Saída de um Target**
Ao acessar `http://10.0.0.1:9100/metrics` (node-exporter):
```plaintext
# HELP node_cpu_seconds_total Total CPU seconds.
# TYPE node_cpu_seconds_total counter
node_cpu_seconds_total{cpu="0", mode="user"} 12345.67
node_cpu_seconds_total{cpu="0", mode="system"} 2345.67
```

---

## **Resumo**
- **Targets** são fontes de métricas raspadas pelo Prometheus.  
- Podem ser estáticos ou descobertos via **Kubernetes, DNS, Consul**, etc.  
- São organizados em **jobs** e identificados por labels (`instance`, `job`).  
- A métrica `up` indica se um target está saudável.  