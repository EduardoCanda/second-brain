---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
# 📊 Métricas do Argo CD: Como Usá-las a Seu Favor

O [[introducao-argocd|Argo CD]] expõe métricas valiosas que podem ser coletadas pelo [[Areas/TI/Kubernetes/Prometheus]] e visualizadas no [[grafana]] para monitorar a saúde, desempenho e conformidade do seu ambiente [[GitOps]]. Vamos explorar as principais métricas e como aproveitá-las:

[Aqui](https://argo-cd.readthedocs.io/en/stable/operator-manual/metrics/) temos todas as metricas disponíveis do Argo
## 🔍 Principais Métricas do Argo CD

### 1. Métricas de Aplicação
- `argocd_app_info`: Informações básicas sobre cada aplicação (status, saúde, sincronização)
- `argocd_app_sync_status`: Status da última sincronização (0 = sucesso, 1 = falha)
- `argocd_app_health_status`: Saúde da aplicação (0 = saudável, 1 = degradado, 2 = progressando)

### 2. Métricas de Desempenho
- `argocd_app_reconcile_bucket`: Tempo de reconciliação das aplicações
- `argocd_kubectl_exec_pending`: Número de comandos kubectl pendentes
- `argocd_repo_pending_request_total`: Solicitações pendentes ao servidor de repositório

### 3. Métricas de Recursos
- `argocd_app_k8s_request_total`: Recursos Kubernetes gerenciados por aplicação
- `argocd_app_resource_info`: Informações sobre recursos gerenciados

## 🛠️ Como Coletar e Visualizar Métricas

### 1. Configurando o ServiceMonitor para Prometheus
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: argocd-metrics
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: argocd-server
  endpoints:
  - port: metrics
    interval: 30s
```

### 2. Dashboard Recomendado para Grafana
Importe o dashboard oficial [Argo CD Grafana Dashboard](https://grafana.com/grafana/dashboards/14584) ou crie um personalizado com os seguintes painéis:

## 🎯 Como Usar as Métricas para Melhorar Seu Fluxo GitOps

### 1. Monitoramento de Saúde das Aplicações
```promql
# Aplicações não saudáveis
argocd_app_health_status{health_status!="Healthy"}
```

**Ação:** Configure alertas para aplicações com status diferente de "Healthy" por mais de 5 minutos.

### 2. Detecção de Falhas de Sincronização
```promql
# Últimas sincronizações falhas
argocd_app_sync_status{sync_status="OutOfSync"} > 0
```

**Ação:** Crie um alerta para sincronizações falhas e investigue os logs do Argo CD.

### 3. Otimização de Desempenho
```promql
# Tempo médio de reconciliação
histogram_quantile(0.95, sum(rate(argocd_app_reconcile_bucket[5m])) by (le))
```

**Ação:** Se > 10s, considere:
- Dividir aplicações grandes em menores
- Reduzir a frequência de sincronização
- Otimizar charts Helm complexos

### 4. Gestão de Recursos
```promql
# Total de recursos gerenciados
sum(argocd_app_k8s_request_total)
```

**Ação:** Monitore o crescimento e planeje a capacidade do cluster.

### 5. Detecção de Problemas no Repositório
```promql
# Solicitações pendentes ao servidor de repositório
rate(argocd_repo_pending_request_total[5m]) > 10
```

**Ação:** Pode indicar problemas de conectividade ou autenticação com repositórios [[Git]].

## 🚀 Dashboard Personalizado (Exemplo)

Crie um dashboard com:
1. Visão geral da saúde do sistema
2. Top 5 aplicações com mais falhas
3. Tendência de tempo de sincronização
4. Distribuição de estados das aplicações
5. Alertas críticos

## 🔄 Integração com Alertmanager

Exemplo de regra de alerta:
```yaml
- alert: ArgoCDAppOutOfSync
  expr: argocd_app_sync_status{sync_status="OutOfSync"} == 1
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "Aplicação {{ $labels.name }} está fora de sincronia"
    description: "A aplicação {{ $labels.name }} no namespace {{ $labels.namespace }} está fora de sincronia há mais de 10 minutos"
```

## 💡 Dicas Avançadas

1. **Métricas Customizadas**: Adicione suas próprias métricas usando o Argo CD Events
2. **Correlação com [[tres-pilares-sre|Logs]]**: Use o Loki para correlacionar métricas com logs do Argo CD
3. **Anomalia Detection**: Configure alertas baseados em anomalias usando ML no Prometheus

## 📈 Benefícios do Monitoramento Efetivo

- Redução de 40-60% no tempo de detecção de problemas
- Visibilidade completa do estado do GitOps
- Capacidade de prever problemas antes que afetem a produção
- Dados concretos para tomar decisões de arquitetura

Quer que eu desenvolva algum aspecto específico dessas métricas ou mostre exemplos mais detalhados de dashboards?