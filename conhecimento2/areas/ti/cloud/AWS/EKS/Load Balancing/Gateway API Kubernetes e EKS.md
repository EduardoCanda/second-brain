---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: paas
cloud_provider: aws
categoria: balanceamento_carga
---
Sim, o **Kubernetes Gateway API** é a evolução moderna para gerenciamento de tráfego em clusters Kubernetes, substituindo ou complementando o **Ingress** tradicional. Ele foi projetado para ser mais flexível, extensível e adequado para cenários complexos de rede. Vamos explorar como ele funciona e como se compara ao Ingress no EKS:

---

## **1. O Que é a Gateway API?**
É uma especificação oficial do Kubernetes (atualmente em estágio **beta/stable**) que define um conjunto de recursos para gerenciar tráfego de rede de forma mais granular e modular. Seus principais componentes são:

| Recurso              | Função                                                                 |
|----------------------|-----------------------------------------------------------------------|
| **GatewayClass**     | Define o tipo de gateway (ex.: ALB, NLB, Istio, NGINX).               |
| **Gateway**          | Instância do balanceador de carga (ex.: um ALB na AWS).               |
| **HTTPRoute**        | Regras de roteamento HTTP/HTTPS (similar ao Ingress, mas mais poderoso). |
| **TCPRoute**         | Para roteamento de tráfego TCP (algo que o Ingress não fazia bem).    |

---

## **2. Por Que Usar Gateway API no EKS?**
### **Vantagens em Relação ao Ingress Tradicional**
| **Recurso**                   | **Ingress**                                    | **Gateway API**                                          |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| **Escopo**                    | Limitado a HTTP/HTTPS.                         | Suporta HTTP, HTTPS, TCP, UDP, gRPC.                     |
| **Separação de preocupações** | Operador e desenvolvedor usam o mesmo recurso. | Roles claros: **Infra** (Gateway), **Devs** (HTTPRoute). |
| **Roteamento avançado**       | Suporte básico a paths/hosts.                  | Header-based, weight-based, mirroring.                   |
| **Multi-backend**             | Complexo (usando annotations).                 | Nativo (backends múltiplos por rota).                    |
| **Portabilidade**             | Depende do Ingress Controller.                 | Padronizado entre provedores.                            |

### **Cenários Ideais para Gateway API**
1. **Multi-cluster**: Roteamento entre clusters Kubernetes.
2. **Protocolos não-HTTP**: gRPC, WebSockets, TCP.
3. **Arquiteturas híbridas**: Integração com serviços externos (ex.: banco de dados).

---

## **3. Como Funciona no EKS?**
A AWS ainda não tem suporte nativo ao Gateway API para ALB/NLB (em 2024), mas você pode usar **controladores de terceiros** como:
- **AWS Load Balancer Controller** (suporte experimental em versões futuras).
- **Istio**, **NGINX**, ou **Contour** (usando seus próprios Gateways).

### **Exemplo Prático: Configurando um Gateway API com ALB**
#### **Passo 1: Instale o Controlador**
Se estiver usando um controlador como o **AWS Load Balancer Controller** (com suporte experimental):
```sh
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml
```

#### **Passo 2: Defina um Gateway**
```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
  name: meu-gateway
spec:
  gatewayClassName: alb  # Usa o ALB como provedor
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      allowedRoutes:
        kinds:
          - kind: HTTPRoute
```

#### **Passo 3: Crie uma Rota HTTP**
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
            value: /app
      backendRefs:
        - name: meu-service  # Service Kubernetes
          port: 80
```

---

## **4. Comparação: Ingress vs. Gateway API**
| **Característica**       | **Ingress**                          | **Gateway API**                     |
|--------------------------|--------------------------------------|-------------------------------------|
| **Protocolos**           | HTTP/HTTPS apenas.                   | HTTP, HTTPS, TCP, UDP, gRPC.       |
| **Separação de roles**   | Não clara (devs e ops no mesmo YAML).| Infra gerencia `Gateway`, devs gerem `HTTPRoute`. |
| **Extensibilidade**      | Limitada (depende de annotations).   | Projetada para extensão.            |
| **Suporte no EKS**       | Total (ALB/NLB).                     | Experimental (dependente de controladores). |

---

## **5. Quando Migrar para Gateway API?**
- **Já use hoje se**:
  - Precisa de roteamento multi-protocolo (TCP/gRPC).
  - Está adotando service mesh (Istio, Linkerd).
  - Quer separar responsabilidades entre times (Infra vs. Devs).
- **Aguarde se**:
  - Depende exclusivamente de ALB/NLB da AWS (suporte ainda em evolução).

---

## **6. Limitações Atuais no EKS**
- **AWS não oferece suporte nativo** ao Gateway API para ALB/NLB (ao contrário de GKE ou AKS).
- **Solução temporária**:
  - Use controladores como **Istio** ou **Contour** para Gateways customizados.
  - Ou espere versões futuras do **AWS Load Balancer Controller**.

---

## **7. Conclusão**
O **Gateway API** é o futuro do gerenciamento de tráfego no Kubernetes, mas no EKS ainda está em adoção gradual. Se você:
- Precisa de **features avançadas** (TCP, gRPC, multi-cluster), experimente com controladores como Istio.
- Está satisfeito com **HTTP/HTTPS**, continue com Ingress + ALB.

A AWS deve trazer suporte completo em breve, então vale ficar de olho! 🚀  

Quer um exemplo passo a passo para configurar no EKS hoje? Posso mostrar um usando Istio ou NGINX!