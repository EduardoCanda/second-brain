---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **Relabeling no Prometheus: Filtro, Transformação e Controle de Coleta**

O **relabeling** no [prometheus](prometheus.md) é um mecanismo poderoso que permite **modificar, filtrar ou até decidir se um [[targets-prometheus|target]] deve ser monitorado** *antes* que as métricas sejam coletadas. Ele vai muito além de simplesmente renomear [[labels-prometheus|labels]]!

---

## **1. O que é Relabeling?**
É um processo de **pós-processamento de metadados** que ocorre durante a descoberta de targets ([[service-discoverry-prometheus|service discovery]]) ou após a coleta de métricas. O Prometheus aplica regras de `relabel_configs` para:

- **Renomear/remover labels** (ex.: simplificar labels complexas).  
- **Adicionar novas labels** (ex.: injetar `env=prod`).  
- **Filtrar targets** (ex.: ignorar targets de desenvolvimento).  
- **Modificar o comportamento de coleta** (ex.: alterar o caminho `/metrics`).  

---

## **2. Quando o Relabeling é Aplicado?**
| Estágio                      | Descrição                                                                        | Exemplo de Uso                              |
| ---------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------- |
| **Service Discovery**        | Antes da coleta, quando o Prometheus descobre targets (ex.: Kubernetes, Consul). | Filtrar Pods com uma annotation específica. |
| **[[scrapping\|Scraping]]**    | Durante a coleta, para modificar labels das métricas.                            | Adicionar `region` às métricas.             |
| **Alerting/Recording Rules** | Ao gerar alertas ou métricas derivadas.                                          | Padronizar labels em alerts.                |

---

## **3. Como Funciona o Relabeling como Filtro?**
Você pode usar `relabel_configs` para **selecionar quais targets devem ser monitorados**, descartando os irrelevantes. Isso é feito com as ações (`action`):

### **A. `keep`: Manter apenas targets específicos**
Exemplo: Coletar apenas Pods Kubernetes com a annotation `prometheus.io/scrape=true`:
```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep   # Só mantém targets onde essa label existe e é "true"
        regex: true
```

### **B. `drop`: Ignorar targets indesejados**
Exemplo: Ignorar targets do [[namespace]] `kube-system`:
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_namespace]
    action: drop
    regex: kube-system  # Descarta targets desse namespace
```

### **C. `labelkeep`/`labeldrop`: Limpar labels**
Exemplo: Remover labels temporárias do Kubernetes:
```yaml
relabel_configs:
  - action: labeldrop
    regex: "__meta_kubernetes_.*"  # Remove todas as labels internas do Kubernetes
```

---

## **4. Casos de Uso Avançados**
### **a) Modificar o Endpoint de Scrape**
Altere o caminho `/metrics` para um target específico:
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
    target_label: __metrics_path__  # Altera o caminho do scrape
    regex: (.+)
```

### **b) Injetar Labels Dinâmicos**
Adicione uma label `team` baseada em uma annotation do Pod:
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_pod_annotation_team]
    target_label: team
    regex: (.+)
```

### **c) Filtrar por Porta**
Coletar apenas targets que expõem a porta `8080`:
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_pod_container_port_number]
    action: keep
    regex: 8080
```

---

## **5. Labels Especiais para Relabeling**
Algumas labels internas são usadas para controle:
| Label | Função |
|-------|--------|
| `__address__` | Endereço original do target (ex.: `10.0.0.1:9100`). |
| `__metrics_path__` | Caminho do endpoint de métricas (padrão: `/metrics`). |
| `__scheme__` | Protocolo (`http` ou `https`). |
| `__meta_*` | Metadados de service discovery (ex.: `__meta_kubernetes_pod_name`). |

---

## **6. Impacto no Desempenho**
- **Relabeling é executado em memória** durante a descoberta de targets.  
- **Regras complexas** podem aumentar o uso de CPU (mas geralmente é insignificante).  
- **Filtrar targets** reduz a carga no Prometheus (menos séries temporais).  

---

## **7. Exemplo Completo: Kubernetes + Relabeling**
```yaml
scrape_configs:
  - job_name: 'kubernetes-apps'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      # Keep only pods with annotation "prometheus.io/scrape=true"
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      # Set metrics path from annotation (default: /metrics)
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        target_label: __metrics_path__
        regex: (.+)
      # Add a 'team' label from pod annotation__meta_kubernetes_pod_annotation_team
      - source_labels: [__meta_kubernetes_pod_annotation_team]
        target_label: team
        regex: (.+)
      # Drop Kubernetes internal labels
      - action: labeldrop
        regex: "__meta_kubernetes_.*"
```

---

## **Resumo**
- **Relabeling não é só para renomear labels**! Pode **filtrar targets**, **modificar endpoints** e **injetar metadados**.  
- **Ações úteis**: `keep`, `drop`, `labelkeep`, `labeldrop`, `replace`.  
- **Use `__meta_*`** para criar regras baseadas em service discovery (Kubernetes, Consul, etc.).  
- **Filtrar targets** evita coleta desnecessária e reduz cardinalidade.  