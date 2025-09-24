---
tags:
  - Kubernetes
  - NotaBibliografica
---
O **Kubernetes** (ou **K8s**) é uma plataforma **open source** para **orquestração de contêineres**.  
Ele foi criado pelo Google e hoje é mantido pela _Cloud Native Computing Foundation_ (CNCF).  
Seu objetivo é automatizar a implantação, o escalonamento e a gestão do ciclo de vida de aplicações em contêineres, oferecendo uma camada de abstração sobre a infraestrutura.

---

## **Principais características do Kubernetes**

### 1. **Orquestração de contêineres**

- Gerencia automaticamente onde e como os contêineres rodam, levando em conta recursos disponíveis, restrições e requisitos.
    
- Exemplo: decidir em qual nó de um cluster o contêiner será executado.
    

### 2. **Escalabilidade automática**

- **Horizontal Pod Autoscaler (HPA)**: aumenta ou diminui o número de réplicas de forma automática com base em métricas (CPU, memória, métricas customizadas).
    
- Pode ser feito manualmente ou automaticamente.
    

### 3. **Alta disponibilidade e tolerância a falhas**

- Redistribui cargas e reinicia contêineres quando detecta falhas.
    
- Pode replicar aplicações em múltiplos nós para evitar _downtime_.
    

### 4. **Balanceamento de carga e descoberta de serviços**

- Possui um sistema interno de **Service Discovery** (via DNS ou variáveis de ambiente) para localizar e comunicar serviços dentro do cluster.
    
- Distribui o tráfego entre múltiplas instâncias (_pods_) automaticamente.
    

### 5. **Gerenciamento declarativo**

- Toda configuração é feita via **manifests YAML** ou APIs.
    
- Você declara o estado desejado e o Kubernetes garante que ele seja atingido (princípio de **desired state**).
    

### 6. **Atualizações e rollbacks automáticos**

- **Rolling updates**: atualiza gradualmente as versões de um serviço sem interromper o funcionamento.
    
- **Rollbacks**: permite voltar rapidamente para uma versão anterior se houver problema.
    

### 7. **Isolamento e segurança**

- Usa _namespaces_ para separar ambientes (ex.: dev, stage, prod).
    
- Integra com controles de autenticação/autorização (RBAC).
    

### 8. **Extensibilidade**

- Permite criar **Custom Resource Definitions (CRDs)** e **Operators** para estender funcionalidades.
    
- Ecosistema rico: Prometheus, Grafana, Istio, Linkerd, ArgoCD, etc.
    

---

💡 **Resumindo**:  
O Kubernetes funciona como um **"sistema operacional para o seu datacenter"** no mundo dos contêineres. Ele abstrai servidores, redes e armazenamento, permitindo que você se concentre na aplicação, e não na infraestrutura.

---

Se quiser, posso também te mostrar **um diagrama da arquitetura do Kubernetes** com todos os seus componentes e explicações de como interagem. Isso deixaria ainda mais claro.