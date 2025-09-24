---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
ferramenta: prometheus
categoria: metricas
---
**Prometheus** é um sistema de **monitoramento e alerta** de código aberto, originalmente desenvolvido pela **SoundCloud** em 2012 e posteriormente adotado pela **Cloud Native Computing Foundation (CNCF)** como um projeto oficial, ao lado de Kubernetes e outros.

### **Principais características do Prometheus:**
1. **Armazenamento de séries temporais (time-series database)**  
   - Projetado para coletar e armazenar métricas em tempo real com carimbos de data/hora.
   
2. **Modelo de dados multidimensional**  
   - As métricas são identificadas por **nomes** e **pares chave-valor (labels)**.  
   - Exemplo:  
     ```
     http_requests_total{method="POST", endpoint="/api"} 100
     ```

1. **[[PromQL]] (Prometheus Query Language)**  
   - Linguagem poderosa para consultar e agregar métricas.

4. **Coleta de métricas via "pull" (HTTP scraping)**  
   - O Prometheus busca (**scrapes**) métricas de aplicações em intervalos regulares.
   - Também suporta **push** via **Pushgateway** para métricas de curta duração.

1. **Alertas ([[Alertmanager]])**  
   - Sistema separado que gerencia notificações (email, Slack, PagerDuty) com suporte a agrupamento e supressão.

1. **Integração nativa com [[kubernetes]] e microsserviços**  
   - Muito usado em ambientes **cloud-native** para monitorar containers, serviços e recursos.

### **Quando usar o Prometheus?**
- Monitoramento de **infraestrutura** (CPU, memória, disco).  
- Acompanhamento de **aplicações web** (requisições, latência, erros).  
- Observabilidade de **microsserviços** e **Kubernetes**.  
- Detecção de **anomalias** e configuração de **alertas**.

### **Alternativas**
- **[[grafana]]** (usado junto ao Prometheus para visualização).  
- **InfluxDB** (outro banco de dados de séries temporais).  
- **Datadog/New Relic** (soluções comerciais com mais recursos).

### **Exemplo de Uso**
1. Uma aplicação expõe métricas em `/metrics` (formato Prometheus).  
2. O Prometheus [[scrapping|coleta]] essas métricas a cada 15s (configurável).  
3. Os dados são armazenados e podem ser consultados via **PromQL**.  
4. Alertas são acionados se uma métrica ultrapassar um limite.  

Resumindo, o **Prometheus** é uma ferramenta essencial para **monitoramento moderno**, especialmente em ambientes dinâmicos como Kubernetes e microsserviços. 🚀  

Quer saber mais sobre algum aspecto específico?