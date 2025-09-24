---
tags:
  - SRE
  - NotaPermanente
  - Segurança
categoria: metricas
ferramenta: prometheus
---
# **Segurança no Prometheus: Principais Preocupações e Boas Práticas**

Ao implementar o [[prometheus]] em sua infraestrutura, é crucial considerar riscos de segurança para evitar exposição de dados sensíveis, ataques de negação de serviço (DoS) ou acesso não autorizado. Abaixo estão os principais pontos de atenção e como mitigá-los:

---

## **1. Autenticação e Autorização**
### **Problema:**
O Prometheus **não tem [[autenticacao-autorizacao|autenticação/autorização]] nativa** (por padrão, qualquer um com acesso à rede pode consultar métricas ou APIs).

### **Soluções:**
- **Reverse Proxy com Autenticação**:
  - Use **Nginx**, **Traefik** ou **Istio** para adicionar autenticação básica/OAuth.
  - Exemplo para Nginx:
    ```nginx
    location /prometheus {
      proxy_pass http://prometheus:9090;
      auth_basic "Restrito";
      auth_basic_user_file /etc/nginx/.htpasswd;
    }
    ```
- **Prometheus com [[protocolo-https|HTTPS]]**:
  - Configure TLS no Prometheus (suportado nativamente):
    ```yaml
    # prometheus.yml
    web:
      tls_config:
        cert_file: /certs/server.crt
        key_file: /certs/server.key
    ```
- **[[rbac]] no [[kubernetes]]**:
  - Se usar [[prometheus-operator]], restrinja permissões de [[service-account|ServiceAccounts]].

---

## **2. Exposição de Dados Sensíveis**
### **Problema:**
Métricas podem conter informações sensíveis (ex.: labels com IPs internos, nomes de serviços, credenciais vazadas em métricas customizadas).

### **Soluções:**
- **[[relabeling]] para Remoção de [[labels-prometheus|Labels]]**:
  ```yaml
  metric_relabel_configs:
    - regex: '(password|token|key)'
      action: labeldrop  # Remove labels sensíveis
  ```
- **Filtre Métricas Expostas**:
  - Use `--web.route-prefix` e `--web.external-url` para limitar endpoints públicos.
- **Cuidado com Exporters**:
  - Verifique se exportadores (ex.: Node Exporter) não expõem dados sensíveis (ex.: `/proc` ou arquivos do sistema).

---

## **3. Ataques de Cardinalidade Explosiva**
### **Problema:**
Labels com valores dinâmicos (ex.: `user_id`, `request_id`) podem gerar **alta cardinalidade**, sobrecarregando o Prometheus.

### **Soluções:**
- **Regras de Relabeling**:
  ```yaml
  relabel_configs:
    - source_labels: [user_id]
      action: drop  # Descarta métricas com user_id
  ```
- **Limites no Prometheus**:
  ```yaml
  # prometheus.yml
  storage:
    tsdb:
      max_samples_per_send: 5000  # Limite de amostras
  ```
- **Monitore Cardinalidade**:
  ```promql
  count({__name__=~".+"}) by (__name__)  # Identifica métricas problemáticas
  ```

---

## **4. Acesso à API e Console**
### **Problema:**
A API do Prometheus (`/api/v1/query`) e o console web (`/graph`) podem ser alvos de ataques (ex.: injeção de PromQL maliciosa).

### **Soluções:**
- **Restrinja Acesso à API**:
  - Use firewalls ou NetworkPolicies no Kubernetes para permitir apenas IPs confiáveis.
- **Desative Features Desnecessárias**:
  ```bash
  --web.enable-admin-api=false  # Desativa APIs de administração
  --web.enable-lifecycle=false  # Impede recarregamentos remotos
  ```

---

## **5. Segurança em Service Discovery**
### **Problema:**
Service Discovery (ex.: Kubernetes SD) pode expor metadados sensíveis (annotations, labels de Pods).

### **Soluções:**
- **Filtre Metadados**:
  ```yaml
  relabel_configs:
    - action: labeldrop
      regex: "__meta_kubernetes_pod_label_(password|token)"  # Remove labels sensíveis
  ```
- **Use Namespaces Dedicados**:
  - Restrinja o acesso do Prometheus a namespaces específicos:
    ```yaml
    # ClusterRole no Kubernetes
    - apiGroups: [""]
      resources: ["pods", "services"]
      verbs: ["get", "list", "watch"]
      resourceNames: ["monitoring", "production"]
    ```

---

## **6. Criptografia e Proteção de Dados**
### **Problema:**
Dados em trânsito (scraping) ou armazenados (TSDB) podem ser interceptados ou adulterados.

### **Soluções:**
- **HTTPS para Scraping**:
  ```yaml
  scrape_configs:
    - job_name: 'secure-app'
      scheme: https  # Usa HTTPS
      tls_config:
        ca_file: /certs/ca.crt
  ```
- **Criptografia em Repouso**:
  - Se usar Kubernetes, ative **encryption at rest** para volumes do TSDB.

---

## **7. Hardening do Node Exporter**
### **Problema:**
O Node Exporter expõe métricas do sistema operacional, que podem ser exploradas.

### **Soluções:**
- **Restrinja Coletores**:
  ```bash
  ./node_exporter --collector.disable-defaults --collector.filesystem --collector.cpu
  ```
- **SecurityContext no Kubernetes**:
  ```yaml
  securityContext:
    runAsNonRoot: true
    runAsUser: 65534  # nobody
    readOnlyRootFilesystem: true
  ```

---

## **8. Monitoramento de Segurança**
### **Alertas Recomendados:**
- **Acesso não autorizado**:
  ```promql
  rate(prometheus_http_requests_total{code!~"200|302"}[5m]) > 0
  ```
- **Cardinalidade Anormal**:
  ```promql
  count by (__name__)({__name__=~".+"}) > 10000
  ```
- **Targets Offline**:
  ```promql
  up == 0
  ```

---

## **Resumo: Checklist de Segurança**
| Área | Ações |
|------|-------|
| **Autenticação** | Proxy reverso, TLS, RBAC. |
| **Dados Sensíveis** | Relabeling, filtro de métricas. |
| **Cardinalidade** | Limites, monitoramento. |
| **API/Console** | Restrição de IP, desativar APIs. |
| **Service Discovery** | Filtro de metadados, namespaces. |
| **Criptografia** | HTTPS, encryption at rest. |
| **Exporters** | Coletores mínimos, SecurityContext. |

**Próximo passo**: Implemente políticas de rede, revise as permissões do ServiceAccount do Prometheus no Kubernetes e audite métricas expostas! 🔒