---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
ferramenta: prometheus-operator
categoria: metricas
---
- **O [[blackbox-exporter|Blackbox Exporter]] serve para “outside-in”**: ele testa um alvo como um cliente faria ([[protocolo-https|HTTP]], gRPC, [[introducao-protocolo-tcp|TCP]], ICMP, DNS). O alvo pode estar **fora ou dentro** do cluster; a ideia é validar o caminho real (Ingress/LB/firewall/TLS/DNS etc.), não só o app por dentro.
    
- **[[scrape-config-crd|ScrapeConfig]]/[[servicemonitor-crd|ServiceMonitor]]/[[podmonitor-crd|PodMonitor]]** dizem **“o que e onde scrappear”**; o **Blackbox** é o **motor de sondas** que realiza esses testes blackbox. Você usa:
    
    - **Probe CRD** (jeito mais idiomático no Operator) ou
        
    - **ScrapeConfig/ServiceMonitor** apontando para `blackbox-exporter:9115/probe`.
        
- **Por que usar Blackbox em vez de só ScrapeConfig?**  
    ScrapeConfig sozinho apenas descreve _descoberta e scrape_ de um endpoint que já expõe `/metrics`. Para medir **HTTP 2xx, redirects, handshake TLS, expiração de certificado, resolução DNS, ping, conexão TCP, health gRPC**, você precisa do **Blackbox** (os **módulos** dele padronizam tudo isso).
    

### Quando ele brilha

- **SaaS/terceiros** (você não controla o exporter deles).
    
- **[[certificado-digital|Certificados]]/[[protocolo-tls|TLS]]** (validade, SNI, cadeia).
    
- **DNS/TCP/ICMP** (rede/rota/egress).
    
- **Caminho via Ingress/LB** (o que o usuário realmente sente).
    
- **Smoke tests/SLO externo** após deploy.
    

### Quando **não** é a melhor escolha

- Métricas internas de app/negócio, contadores, histogramas, rótulos ricos → **whitebox** (exporters nativos ou `/metrics` da sua app) via ServiceMonitor/PodMonitor.
    

### Fio-da-meada (K8s)

1. Deploy do `blackbox-exporter`.
    
2. Crie **`Probe` CRDs** (ou ScrapeConfigs) com `module` (`http_2xx`, `icmp`, `dns`, `grpc`, …) e _targets_.
    
3. No **Prometheus CRD**, habilite `probeSelector` (ou `scrapeConfigSelector`) para “admitir” esses checks.
    

> Resposta curta: **sim**, a função dele é padronizar e viabilizar checagens **blackbox** que o Prometheus, por si só, não faz — ele **complementa** (não substitui) os `scrape_configs`.