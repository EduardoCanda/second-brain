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
Pergunta: Oque são target grups e listening grupos e como eles se relacionam no eks?

### **Target Groups e Listeners no EKS: Como Funcionam?**  
Quando você usa **ALB ([[Application Load Balancer]])** ou **NLB ([[Network Load Balancer]])** no EKS, esses componentes dependem de **[[Target Groups Load Balancers]]** e **[[Listeners Load Balancers]]** para rotear o tráfego. Vamos explicar cada um e como eles se relacionam:

---

## **1. O Que São Target Groups?**  
São **grupos de destinos** (como [[pod|pods]], instâncias [[EC2]] ou IPs) que recebem tráfego do Load Balancer. No [[Meu resumo EKS|EKS]], os principais tipos são:

### **Tipos de Target Groups**

| Tipo                | Descrição                                                                 | Quando é Usado?                     |
|---------------------|--------------------------------------------------------------------------|-------------------------------------|
| **Instance Target Group** | Registra **instâncias EC2** (nós do EKS) como destinos.                  | Raro no EKS moderno (usado em clusters legados). |
| **IP Target Group**       | Registra **IPs individuais dos Pods** diretamente (padrão no EKS com VPC CNI). | Usado com **AWS Load Balancer Controller** (recomendado). |
| **Lambda Target Group**   | Encaminha tráfego para funções AWS Lambda (não comum no EKS).            | Casos específicos serverless. |

#### **Exemplo no EKS:**
- Se você tem um **Ingress** com ALB, o **AWS Load Balancer Controller** cria um **IP Target Group** automaticamente, registrando os **IPs dos Pods** que estão por trás do `Service` Kubernetes.

---

## **2. O Que São Listeners?**  
São **"ouvintes"** que definem **como** o Load Balancer aceita conexões (porta/protocolo) e **para onde** encaminha o tráfego ([[Target Groups Load Balancers|Target Group]]).

### **Componentes de um Listener**
| Configuração       | Descrição                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **Porta**          | Ex.: `80` (HTTP) ou `443` (HTTPS).                                                               |
| **Protocolo**      | `HTTP`, `HTTPS`, `TCP`, ou `TLS`.                                                                |
| **Default Action** | Define para qual **Target Group** o tráfego será enviado (ex.: roteamento para um `Service`).    |
| **Rules (Regras)** | Usado em ALB para roteamento avançado (ex.: `/api` vai para um Target Group, `/app` para outro). |

#### **Exemplo no EKS:**
- Um **Ingress** com ALB cria:
  - **Listener na porta 80** (HTTP) → Redireciona para 443 (HTTPS).
  - **Listener na porta 443** (HTTPS) → Encaminha para o **Target Group** dos Pods.

---

## **3. Como Eles se Relacionam no EKS?**  
Quando você define um **Ingress** ou **Service** no Kubernetes, o **AWS Load Balancer Controller** automatiza a criação desses recursos na AWS:

### **Fluxo de Funcionamento**
1. **Você aplica um Ingress**:
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     annotations:
       kubernetes.io/ingress.class: alb
   spec:
     rules:
       - host: meu-app.com
         http:
           paths:
             - path: /
               backend:
                 service:
                   name: meu-service
                   port: 80
   ```
2. **O Controller cria na AWS**:
   - **1 ALB** (Application Load Balancer).
   - **1+ Listeners** (ex.: porta 80 e 443).
   - **1+ Target Groups** (um para cada `Service` referenciado no Ingress).
3. **Os Pods são registrados**:
   - O **Target Group** monitora os **IPs dos Pods** associados ao `Service` (`meu-service`).
4. **O tráfego é roteado**:
   - Usuário acessa `meu-app.com` → **Listener (443)** → **Target Group** → **Pods**.

---

## **4. Exemplo Prático: ALB + Target Group + Listener**
Suponha que você tenha:
- Um **Deployment** com 3 réplicas.
- Um **Service** do tipo `ClusterIP`.
- Um **Ingress** para roteamento HTTP.

### **O que a AWS cria?**
| Recurso AWS          | Configuração Exemplo                          | Relação com Kubernetes          |
|----------------------|-----------------------------------------------|---------------------------------|
| **ALB**              | `k8s-meuingress-1234567890.elb.amazonaws.com` | Gerenciado pelo Ingress.        |
| **Listener (443)**   | Porta 443 (HTTPS), com certificado SSL.       | Configurado via anotações.      |
| **Target Group**     | Registra os IPs dos 3 Pods do Deployment.     | Associado ao `Service` do Ingress. |

---

## **5. Troubleshooting Comum**
### **Problema: Target Group sem pods registrados**
- **Causas**:
  - Os **Pods** não estão saudáveis (`kubectl get pods`).
  - O **Service** não tem os `selectors` corretos.
  - O **AWS Load Balancer Controller** não está funcionando.

### **Problema: Listener não está respondendo**
- **Causas**:
  - Porta errada no Ingress.
  - Certificado SSL inválido (se HTTPS).
  - Security Groups bloqueando tráfego.

### **Como verificar?**
1. **Console AWS**:
   - Acesse **EC2 > Target Groups** e veja se os Pods estão saudáveis.
   - Verifique **Load Balancers > Listeners**.
2. **Kubernetes**:
   ```sh
   kubectl describe ingress meu-ingress  # Veja eventos de erro.
   kubectl logs -n kube-system deployment/aws-load-balancer-controller
   ```

---

## **6. Resumo Final**
| Conceito          | O Que Faz?                          | Relação com EKS                          |
|-------------------|------------------------------------|------------------------------------------|
| **Target Group**  | Grupo de Pods/IPs que recebem tráfego. | Criado automaticamente pelo Ingress/Service. |
| **Listener**      | "Ouve" em uma porta e roteia tráfego.  | Configurado via anotações no Ingress.    |
| **ALB/NLB**       | Balanceador que usa ambos.          | Gerenciado pelo AWS Load Balancer Controller. |

### **Regra de Ouro**:
- **Target Groups** = Destino dos Pods.
- **Listeners** = Regras de roteamento (portas, paths, SSL).
- **EKS** automatiza tudo se você usar **Ingress + AWS Load Balancer Controller**.

Se precisar debugar, sempre cheque os **Target Groups** e **Listeners** no Console AWS! 🚀