---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **Service Discovery no Prometheus: Conceito, Configurações e Relação com Outros Componentes**

O **service discovery (SD)** no [[prometheus]] é o mecanismo que permite **descobrir automaticamente [[targets-prometheus|targets]]** (alvos) para coleta de métricas em ambientes dinâmicos, como [[kubernetes]], clouds ([[AWS]], GCP) ou sistemas como Consul. Ele elimina a necessidade de configurar targets manualmente no `prometheus.yml`.

---

## **1. Como Funciona o Service Discovery?**
O Prometheus consulta fontes externas (APIs, bancos de dados, arquivos) para obter uma lista atualizada de targets periodicamente. Esses targets são então filtrados/processados com **[[relabeling|relabeling]]** antes da coleta.

### **Fluxo Básico**
1. **Configuração**: Defina um job no `prometheus.yml` com um provedor de SD (ex.: Kubernetes, AWS).  
2. **Descoberta**: O Prometheus consulta a fonte (ex.: API do K8s) e obtém uma lista de endpoints.  
3. **Relabeling**: Metadados brutos (como `__meta_kubernetes_pod_name`) são transformados em [[labels-prometheus|labels]] úteis.  
4. **[[scrapping|Scraping]]**: Métricas são coletadas dos targets resultantes.  

---

## **2. Tipos de Service Discovery Suportados**
### **A. Kubernetes**
**Uso**: Monitorar [[pod|Pods]], [[service|service]], [[worker-nodes|Nodes]], etc.  
**Configuração**:
```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod  # Descobre Pods
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true  # Filtra Pods com annotation "prometheus.io/scrape=true"
```
**Metadados Disponíveis** (exemplos):
- `__meta_kubernetes_pod_name`  
- `__meta_kubernetes_namespace`  
- `__meta_kubernetes_pod_annotation_<nome>`  

---

### **B. [[EC2|AWS EC2]]**
**Uso**: Descobrir instâncias EC2.  
**Configuração**:
```yaml
scrape_configs:
  - job_name: 'aws-ec2'
    ec2_sd_configs:
      - region: us-east-1
        access_key: "AKIXXX"
        secret_key: "XXXXXX"
    relabel_configs:
      - source_labels: [__meta_ec2_tag_Environment]
        target_label: env  # Converte a tag AWS "Environment" em uma label
```
**Metadados Disponíveis**:
- `__meta_ec2_instance_id`  
- `__meta_ec2_tag_<nome>` (tags da instância)  

---

### **C. Consul**
**Uso**: Serviços registrados no Consul.  
**Configuração**:
```yaml
scrape_configs:
  - job_name: 'consul-services'
    consul_sd_configs:
      - server: 'consul:8500'
    relabel_configs:
      - source_labels: [__meta_consul_service]
        target_label: service_name
```
**Metadados Disponíveis**:
- `__meta_consul_service`  
- `__meta_consul_tags`  

---

### **D. File-Based Discovery**
**Uso**: Targets definidos em arquivos JSON/YAML (útil para integrações customizadas).  
**Arquivo** (`targets.json`):
```json
[
  {
    "targets": ["10.0.0.1:9100"],
    "labels": { "env": "prod", "app": "nginx" }
  }
]
```
**Configuração**:
```yaml
scrape_configs:
  - job_name: 'file-sd'
    file_sd_configs:
      - files: ['/path/to/targets.json']
```

---

### **E. [[protocolo-dns|DNS]]**
**Uso**: Descobrir targets via registros DNS (SRV, A, AAAA).  
**Configuração**:
```yaml
scrape_configs:
  - job_name: 'dns-sd'
    dns_sd_configs:
      - names: ['_prometheus._tcp.example.com']  # SRV record
        type: SRV
```

---

## **3. Como o Service Discovery se Relaciona com Outros Conceitos?**
### **a) Relabeling**
- **Filtra targets**: Usando `keep`/`drop` com metadados (ex.: `__meta_kubernetes_namespace`).  
- **Adiciona contexto**: Convertendo metadados em labels (ex.: `__meta_ec2_tag_Environment → env=prod`).  

### **b) [[jobs-do-prometheus|Jobs]]**
- Cada provedor de SD é associado a um `job_name`.  
- Exemplo: Um job para Kubernetes (`kubernetes-pods`) e outro para EC2 (`aws-ec2`).  

### **c) Cardinalidade**
- **Problema**: SD em ambientes muito dinâmicos (ex.: K8s) pode gerar muitas séries.  
- **Solução**: Use `relabel_configs` para filtrar targets desnecessários.  

### **d) Métricas `up` e `scrape_duration_seconds`**
- Monitoram a saúde dos targets descobertos.  

---

## **4. Exemplo Avançado (Kubernetes + Relabeling)**
```yaml
scrape_configs:
  - job_name: 'kubernetes-services'
    kubernetes_sd_configs:
      - role: service  # Descobre Services
    relabel_configs:
      # Mantém apenas Services com annotation "prometheus.io/scrape=true"
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      # Define o caminho de scrape a partir de uma annotation
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        target_label: __metrics_path__
        regex: (.+)
      # Adiciona label "namespace"
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
```

---

## **5. Boas Práticas**
1. **Filtre targets** para evitar alta cardinalidade.  
2. **Use labels estáticas** (ex.: `env=prod`) para agregação.  
3. **Monitore falhas de SD** com métricas como `prometheus_sd_discovered_targets`.  

---

## **Resumo**
| Provedor SD | Quando Usar | Exemplo de Config |
|-------------|------------|-------------------|
| **Kubernetes** | Monitorar Pods/Services em clusters K8s | `kubernetes_sd_configs` + `role: pod` |
| **AWS EC2** | Instâncias EC2 na AWS | `ec2_sd_configs` + tags |
| **Consul** | Serviços registrados no Consul | `consul_sd_configs` |
| **File-Based** | Targets customizados (JSON/YAML) | `file_sd_configs` |
| **DNS** | Targets definidos via registros DNS | `dns_sd_configs` |
