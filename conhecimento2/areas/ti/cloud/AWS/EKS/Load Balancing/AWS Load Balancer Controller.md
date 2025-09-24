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
O **AWS Load Balancer Controller** é um controlador do Kubernetes que ajuda a gerenciar os recursos de balanceamento de carga (**Elastic Load Balancers - ELB**) na AWS para clusters Kubernetes (EKS ou autogerenciados). Ele substitui o antigo **AWS ALB Ingress Controller** e oferece suporte tanto para **Application Load Balancer (ALB)** quanto para **Network Load Balancer (NLB)**.

### **Principais Funcionalidades**
1. **Criação Automática de ALB/NLB**  
   - Cria e configura automaticamente um ALB ou NLB quando um **Ingress** ou **Service** do tipo `LoadBalancer` é criado no Kubernetes.

2. **Suporte a Ingress e Service**  
   - **Ingress**: Usado para roteamento HTTP/HTTPS com ALB.  
   - **Service (LoadBalancer)**: Usado para balanceamento de carga em nível TCP/UDP com NLB.

3. **Integração com AWS Services**  
   - Configura automaticamente **Target Groups**, **Listeners** e **Rules** no ALB/NLB.  
   - Suporta **AWS WAF**, **ACM (Certificados SSL/TLS)** e **Security Groups**.

4. **Otimização de Custos**  
   - Permite o uso do **ALB (Layer 7)** para tráfego HTTP/HTTPS e **NLB (Layer 4)** para tráfego de alta performance (TCP/UDP).  
   - Suporta **Shared Load Balancers** para reduzir custos quando múltiplos serviços usam o mesmo ALB.

5. **Features Avançadas**  
   - **Path-Based Routing** (roteamento por caminho de URL).  
   - **Host-Based Routing** (roteamento por domínio).  
   - **Autenticação via Cognito/OIDC**.  
   - **IP Whitelisting** (restrição por IP).  

---

### **Como Instalar e Configurar?**
1. **Pré-requisitos**  
   - Cluster Kubernetes (EKS recomendado).  
   - IAM Permissions (via IAM Roles for Service Accounts - IRSA).  

2. **Instalação via Helm (recomendado)**  
   ```sh
   helm repo add eks https://aws.github.io/eks-charts
   helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
     -n kube-system \
     --set clusterName=<SEU-CLUSTER-EKS> \
     --set serviceAccount.create=true \
     --set serviceAccount.name=aws-load-balancer-controller
   ```

3. **Exemplo de Uso com Ingress (ALB)**  
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: my-app-ingress
     annotations:
       kubernetes.io/ingress.class: alb
       alb.ingress.kubernetes.io/scheme: internet-facing
       alb.ingress.kubernetes.io/target-type: ip
   spec:
     rules:
       - host: meu-app.example.com
         http:
           paths:
             - path: /
               pathType: Prefix
               backend:
                 service:
                   name: meu-servico
                   port:
                     number: 80
   ```

4. **Exemplo de Uso com NLB (Service)**  
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: meu-servico-nlb
     annotations:
       service.beta.kubernetes.io/aws-load-balancer-type: external
       service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip
   spec:
     type: LoadBalancer
     ports:
       - port: 80
         targetPort: 8080
     selector:
       app: meu-app
   ```

---

### **Diferença entre ALB e NLB no Controller**
| Feature               | ALB (Ingress)                          | NLB (Service)                          |
|-----------------------|----------------------------------------|----------------------------------------|
| **Camada OSI**        | Layer 7 (HTTP/HTTPS)                   | Layer 4 (TCP/UDP)                      |
| **Use Case**          | Roteamento baseado em URL/host         | Alta performance (gaming, streaming)   |
| **SSL Termination**   | Suportado                              | Suportado                              |
| **Custo**             | Mais barato para tráfego HTTP          | Mais caro, mas escalável               |

---

### **Conclusão**
O **AWS Load Balancer Controller** simplifica o gerenciamento de balanceadores de carga na AWS para Kubernetes, automatizando a criação e configuração de ALB/NLB. Ele é essencial para clusters EKS que exigem balanceamento de carga avançado, segurança e integração com outros serviços AWS.

Quer ajuda com algum caso específico? 🚀