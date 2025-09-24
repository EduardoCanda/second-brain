---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Boa! Essa é uma ótima pergunta porque o **[[prometheus-operator|Prometheus Operator]]** e o **ServiceMonitor** são conceitos fundamentais quando você trabalha com [[Kubernetes]] + [[Prometheus]], especialmente no ecossistema do **[[instalacao-prometheus-kube-stack|kube-prometheus-stack]]** ([[helm-charts|Helm chart]] que instala Prometheus, [[Grafana]], [[Alertmanager]] etc.). Vou detalhar bem:

## 🔹 O que é um **ServiceMonitor**?

O **ServiceMonitor** é um CRD criado pelo Prometheus Operator que **descreve um conjunto de endpoints expostos por [[Services]] do Kubernetes que devem ser monitorados pelo Prometheus**.

Ou seja, em vez de você alterar o [[aquivo-prometheus-yaml|prometheus.yml]] para adicionar jobs de scraping, você cria um objeto `ServiceMonitor`. O operador vai detectar e gerar a configuração correspondente para o Prometheus.

---

## 🔹 Estrutura de um **ServiceMonitor**

Um exemplo bem prático:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: minha-app
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: minha-app
  namespaceSelector:
    matchNames:
      - apps
  endpoints:
    - port: metrics
      path: /metrics
      interval: 30s
```

### Explicando:

- **selector.matchLabels** → Como o ServiceMonitor encontra o Service no Kubernetes.  
    Aqui ele vai procurar um Service no namespace `apps` com `app=minha-app`.
    
- **namespaceSelector** → Permite monitorar serviços em outros namespaces.
    
- **endpoints** → Configura os endpoints que o Prometheus vai scrapear:
    
    - `port`: deve bater com o nome da porta definida no Service.
        
    - `path`: rota onde o app expõe métricas (normalmente `/metrics`).
        
    - `interval`: frequência de scraping.
        

---

## 🔹 Como o fluxo funciona

1. Você cria sua aplicação (ex.: Spring Boot com Micrometer) e expõe métricas via `/actuator/prometheus`.
    
2. Cria um **[[Service]]** no Kubernetes expondo essa porta, algo como:
    
    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: minha-app
      labels:
        app: minha-app
    spec:
      ports:
        - name: metrics
          port: 8080
          targetPort: 8080
      selector:
        app: minha-app
    ```
    
3. Cria o **ServiceMonitor** (como o exemplo acima).
    
4. O Prometheus Operator detecta o ServiceMonitor, atualiza a configuração do Prometheus e começa a coletar as métricas.
    
5. Você pode visualizar os targets em `http://prometheus:9090/targets`.
    

---

## 🔹 Diferença entre **ServiceMonitor** e **[[PodMonitor]]**

- **ServiceMonitor** → Descobre Pods **através de Services**. É o mais comum.
    
- **PodMonitor** → Vai direto nos Pods, sem precisar de Service, útil quando não há um Service exposto para métricas.
    

---

## 🔹 Vantagens do uso

- Centralização: você descreve scraping via CRD, não precisa editar configs de Prometheus.
    
- Escalabilidade: múltiplas equipes podem criar seus próprios `ServiceMonitor`s no namespace delas.
    
- Integração com Helm Charts: muitos charts já criam ServiceMonitor automaticamente se você habilitar.
    

---

👉 Em resumo:

- O **Prometheus Operator** é quem gerencia e traduz os CRDs para configuração real.
    
- O **ServiceMonitor** é uma forma declarativa de dizer: “Prometheus, scrape esse service nesses endpoints”.
    