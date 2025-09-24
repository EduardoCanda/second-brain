---
tags:
  - Fundamentos
  - Arquitetura
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: paas
cloud_provider: aws
categoria: balanceamento_carga
---
**Pergunta: é possível uma arquitetura mista entre roteamento via Gateway api + Linkerd e expor via ingress?**

Sim, é **perfeitamente possível** (e em alguns cenários, recomendável) usar uma **arquitetura mista** combinando **Gateway API**, **Linkerd (Service Mesh)** e **Ingress tradicional** no mesmo cluster EKS. Essa abordagem permite aproveitar os pontos fortes de cada tecnologia. Vamos descomplicar:

---

### **1. Visão Geral da Arquitetura Mista**
Aqui está como você pode integrar esses componentes:

```
[Gateway API] → [Linkerd (Service Mesh)] → [Ingress (ALB/NLB)]
          (Roteamento avançado)    (mTLS, observabilidade)   (Exposição pública)
```

#### **Fluxo do Tráfego**:
1. **Gateway API**: Define regras de roteamento avançado (HTTP, TCP, gRPC).
2. **Linkerd**: Adiciona **mTLS**, métricas, retries e load balancing entre Pods.
3. **Ingress (ALB/NLB)**: Expõe o serviço para a internet ou VPC.

---

### **2. Quando Usar Essa Arquitetura?**
| Tecnologia       | Papel na Arquitetura Mista                                                                 | Exemplo de Uso                                                                 |
|------------------|-------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| **Gateway API**  | Roteamento interno avançado (ex.: gRPC, WebSockets, divisão de tráfego por header/path).  | Roteamento entre microserviços em diferentes namespaces.                       |
| **Linkerd**      | Segurança (mTLS), observabilidade, retries e balanceamento de carga entre Pods.           | Comunicação segura entre serviços (ex.: frontend → backend).                   |
| **Ingress**      | Exposição controlada de serviços para fora do cluster (internet/VPC).                     | Acesso público a um frontend ou API.                                           |

---

### **3. Como Configurar no EKS?**
#### **Passo 1: Instale o Linkerd**
```bash
# Instale o CLI do Linkerd
curl -sL https://run.linkerd.io/install | sh

# Instale o controlador no cluster
linkerd install | kubectl apply -f -
```

#### **Passo 2: Instale um Controlador para Gateway API**
Se estiver usando **Istio** (que suporta Gateway API + Linkerd):
```bash
istioctl install --set profile=demo -y
```

Ou, se preferir **NGINX Gateway Fabric**:
```bash
kubectl apply -f https://github.com/nginxinc/nginx-gateway-fabric/releases/download/v1.0.0/nginx-gateway-fabric.yaml
```

#### **Passo 3: Defina um Gateway (Gateway API)**
```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
  name: meu-gateway
spec:
  gatewayClassName: nginx  # Ou "istio", dependendo do controlador
  listeners:
    - name: http
      protocol: HTTP
      port: 80
```

#### **Passo 4: Crie uma Rota HTTP (Gateway API)**
```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
  name: minha-rota
spec:
  parentRefs:
    - name: meu-gateway
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: meu-service  # Service gerenciado pelo Linkerd
          port: 8080
```

#### **Passo 5: Exponha um Serviço via Ingress (ALB)**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: meu-ingress
  annotations:
    kubernetes.io/ingress.class: alb
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: linkerd-gateway  # Serviço que aponta para o Gateway
                port:
                  number: 80
```

---

### **4. Benefícios da Arquitetura Mista**
- **Flexibilidade**: Gateway API para roteamento interno + Ingress para exposição externa.
- **Segurança**: Linkerd criptografa tráfego entre Pods (mTLS) mesmo dentro do cluster.
- **Observabilidade**: Métricas detalhadas do Linkerd + logs do ALB.
- **Controle Granular**: Gateway API permite regras complexas (ex.: roteamento por header).

---

### **5. Desafios e Considerações**
- **Complexidade**: Mais componentes para gerenciar (Linkerd + Gateway API + Ingress).
- **Sobreposição de Recursos**: Garanta que não haja conflitos entre `Gateway` e `Ingress`.
- **Suporte na AWS**: Gateway API ainda não tem suporte nativo para ALB/NLB (requer controladores como Istio/NGINX).

---

### **6. Alternativas Simplificadas**
Se a arquitetura mista for complexa demais para seu caso:
- **Use apenas Ingress + Linkerd**: Para cenários onde o Gateway API não é essencial.
- **Substitua Ingress por Gateway API**: Se estiver usando um controlador como Istio (que pode expor serviços diretamente).

---

### **7. Exemplo de Caso Real**
#### **Cenário**: 
- Um e-commerce com:
  - **Frontend** (exposto via Ingress/ALB).
  - **Backend** (roteamento interno via Gateway API + Linkerd para segurança).

#### **Fluxo**:
1. Usuário acessa `https://app.example.com` (Ingress → ALB).
2. O frontend (Pod) chama o backend via `http://backend-service/checkout` (Gateway API + Linkerd).
3. Linkerd gerencia mTLS e métricas da comunicação interna.

---

### **8. Conclusão**
Sim, você **pode e deve** misturar Gateway API, Linkerd e Ingress no EKS quando:
- Precisa de **roteamento avançado interno** (Gateway API).
- Requer **segurança e observabilidade** entre serviços (Linkerd).
- Necessita **expor serviços publicamente** (Ingress/ALB).

Se for sua primeira vez, comece com **Ingress + Linkerd** e depois evolua para Gateway API. Quer um tutorial passo a passo para configurar isso no seu cluster? Posso ajudar! 🛠️