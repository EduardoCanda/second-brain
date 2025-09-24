---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
# **Node Exporter no Kubernetes: Implementação e Relação com o Ecossistema Prometheus**

O Node Exporter é um componente crítico para monitorar a infraestrutura subjacente em clusters [[kubernetes]], coletando métricas de recursos físicos (CPU, memória, disco, rede) dos **nós worker**. Vamos explorar como ele se integra ao Kubernetes e como implementá-lo de forma eficiente.

---

## **1. Relação entre Node Exporter e Kubernetes**
### **Problema que Resolve**
- Kubernetes monitora recursos de **[[pod|Pods]]/[[deployment]]** (via [[metrics-server]]), mas não métricas de **nós subjacentes** (hardware, SO).  
- Node Exporter preenche essa lacuna, exp ondo métricas dos nós para o Prometheus.

### **Arquitetura no Kubernetes**
```mermaid
graph TD
  A[Node Exporter DaemonSet] --> [Métricas de cada nó]          B[Prometheus Server]
  B -->|Scraping| A
  B --> C[Grafana]
  D[Kubelet] -->|Métricas de Pods| B
```

---

## **2. Como Implementar no Kubernetes?**
### **A. Usando um [[daemonset]] (Recomendado)**
O Node Exporter deve rodar **em cada nó** do cluster. A forma mais comum é via `DaemonSet`:

#### **Exemplo de Manifesto YAML**
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: monitoring
  labels:
    app: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
      annotations:
        prometheus.io/scrape: "true"  # Prometheus descobre automaticamente
        prometheus.io/port: "9100"
    spec:
      containers:
      - name: node-exporter
        image: prom/node-exporter:latest
        ports:
        - containerPort: 9100
        volumeMounts:
        - mountPath: /proc
          name: proc
          readOnly: true
        - mountPath: /sys
          name: sys
          readOnly: true
      volumes:
      - name: proc
        hostPath:
          path: /proc
      - name: sys
        hostPath:
          path: /sys
      tolerations:  # Permite execução em nós master (opcional)
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
```

#### **Passos para Implantação:**
1. Crie um [[namespace]] para monitoramento:
   ```bash
   kubectl create namespace monitoring
   ```
2. Aplique o manifesto:
   ```bash
   kubectl apply -f node-exporter-daemonset.yaml
   ```
3. Verifique os Pods:
   ```bash
   kubectl get pods -n monitoring -l app=node-exporter -o wide
   ```

---

### **B. Configurando o Prometheus para [[scrapping|Scraping]]**
Adicione um job no `prometheus.yml` para descobrir os Pods do Node Exporter via [[service-discoverry-prometheus|Kubernetes SD]]:

```yaml
scrape_configs:
  - job_name: 'kubernetes-node-exporter'
    kubernetes_sd_configs:
      - role: pod  # Descobre Pods
    relabel_configs:
      # Filtra apenas Pods do Node Exporter
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: node-exporter
      # Define a porta e o caminho padrão
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
```

---

## **3. Métricas Principais Coletadas (Exemplos para Kubernetes)**
| Métrica | Descrição | Uso em PromQL |
|---------|-----------|--------------|
| `node_cpu_seconds_total` | Uso de CPU por modo. | `rate(node_cpu_seconds_total{mode="idle"}[5m])` |
| `node_memory_MemFree_bytes` | Memória livre. | `node_memory_MemTotal_bytes - node_memory_MemFree_bytes` |
| `node_filesystem_avail_bytes` | Espaço livre em disco. | `node_filesystem_avail_bytes{mountpoint="/"} / 1e9` (GB) |
| `node_network_receive_bytes_total` | Tráfego de rede. | `rate(node_network_receive_bytes_total[5m])` |

---

## **4. Boas Práticas**
### **A. Tolerations para Nós Master**
Adicione tolerations no DaemonSet para monitorar nós control-plane:
```yaml
tolerations:
- key: node-role.kubernetes.io/control-plane
  operator: Exists
  effect: NoSchedule
```

### **B. Segurança**
- **Restrinja permissões**: Use `SecurityContext` no Pod:
  ```yaml
  securityContext:
    runAsNonRoot: true
    runAsUser: 65534  # Usuário nobody
  ```
- **NetworkPolicies**: Limite acesso à porta `9100` apenas ao Prometheus.

### **C. Annotations para Service Discovery**
Use annotations nos Pods para configuração flexível:
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "9100"
  prometheus.io/path: "/metrics"
```

---

## **5. Integração com o Restante do Ecossistema**
- **Grafana**: Use dashboards como [Node Exporter Full](https://grafana.com/grafana/dashboards/1860) para visualização.  
- **Alertmanager**: Crie alertas para:
  ```promql
  # CPU > 80% por 5 minutos
  100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance) * 100) > 80
  ```
- **kube-state-metrics**: Combine com métricas do Kubernetes para visão completa.

---

## **6. Alternativas Avançadas**
- **[[prometheus-operator]]**: Use o `ServiceMonitor` para configurar scraping automaticamente:
  ```yaml
  apiVersion: monitoring.coreos.com/v1
  kind: ServiceMonitor
  metadata:
    name: node-exporter
    namespace: monitoring
  spec:
    selector:
      matchLabels:
        app: node-exporter
    endpoints:
    - port: http
  ```

---

## **Resumo**
| Conceito | Implementação no Kubernetes |
|----------|-----------------------------|
| **Onde roda?** | Como DaemonSet (um Pod por nó). |
| **Descoberta** | Service Discovery do Prometheus (kubernetes_sd_configs). |
| **Métricas** | Hardware (CPU, memória, disco) + SO. |
| **Segurança** | Tolerations, SecurityContext, NetworkPolicies. |
| **Dashboard** | Grafana + PromQL (ex.: uso de CPU por nó). |

**Próximo passo**: Após implantar o Node Exporter, configure alertas para disco cheio ou CPU overload! 🚀