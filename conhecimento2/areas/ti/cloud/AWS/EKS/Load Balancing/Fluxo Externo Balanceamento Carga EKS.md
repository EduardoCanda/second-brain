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
No Amazon EKS, o **Load Balancer** é usado para distribuir tráfego de rede para aplicações rodando em pods Kubernetes. A AWS oferece duas opções principais integradas ao EKS:

### **1. Tipos de Load Balancer no EKS**
#### **A. Application Load Balancer (ALB)**
- **Para que serve**: Balanceamento de tráfego HTTP/HTTPS (camada 7).
- **Como é provisionado**: Através de um **Ingress Controller** (ex.: AWS Load Balancer Controller).
- **Casos de uso**: 
  - Roteamento baseado em paths (`/api`, `/app`).
  - Terminação SSL/TLS.
  - Redirecionamentos HTTP → HTTPS.

#### **B. Network Load Balancer (NLB)**
- **Para que serve**: Balanceamento de tráfego TCP/UDP (camada 4).
- **Como é provisionado**: Diretamente via serviço Kubernetes do tipo `LoadBalancer`.
- **Casos de uso**:
  - Tráfego de baixa latência (ex.: gaming, streaming).
  - Preservação de IP de origem.

---

### **2. Como Funciona o Provisionamento Automático?**
Quando você cria um **Service** ou **Ingress** no EKS, o **AWS Load Balancer Controller** (ou o próprio kubelet) interage com a AWS para criar um ALB/NLB automaticamente.

#### **Exemplo 1: NLB (Service LoadBalancer)**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: meu-app-nlb
spec:
  type: LoadBalancer
  selector:
    app: meu-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```
- **O que acontece**:
  1. O EKS cria um **Network Load Balancer** na AWS.
  2. Os pods com a label `app: meu-app` são registrados como targets.
  3. O NLB recebe um DNS público (ex.: `meu-app-nlb-1234567890.elb.us-east-1.amazonaws.com`).

#### **Exemplo 2: ALB (Ingress)**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: meu-app-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
spec:
  rules:
    - host: meu-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: meu-app
                port:
                  number: 80
```
- **O que acontece**:
  1. O **AWS Load Balancer Controller** cria um **Application Load Balancer**.
  2. Configura listeners e target groups baseados nas regras do Ingress.
  3. Roteia tráfego para os serviços Kubernetes definidos.

---

### **3. AWS Load Balancer Controller**
É um controlador Kubernetes que gerencia ALBs/NLBs automaticamente. Funciona assim:
1. **Monitora** recursos Kubernetes (Services/Ingress).
2. **Interpreta anotações** (ex.: `alb.ingress.kubernetes.io/certificate-arn`).
3. **Chama a API da AWS** para criar/configurar LBs.

#### **Como Instalar?**
```sh
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  --set clusterName=meu-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

---

### **4. Comparação: ALB vs NLB no EKS**
| Feature               | ALB (Ingress)                  | NLB (Service)                 |
|-----------------------|--------------------------------|-------------------------------|
| **Camada OSI**        | 7 (HTTP/HTTPS)                 | 4 (TCP/UDP)                   |
| **Custo**             | Mais caro (por regras complexas)| Mais barato                   |
| **IP**                | DNS apenas                     | IP estático (opcional)        |
| **SSL/TLS**           | Terminação nativa              | Requer configuração extra     |
| **Use Case**          | Aplicações web                 | Tráfego não-HTTP (ex.: banco de dados) |

---

### **5. Anotações Úteis para Ingress (ALB)**
```yaml
annotations:
  # Esquema (internet-facing ou internal)
  alb.ingress.kubernetes.io/scheme: internet-facing
  
  # Certificado SSL (ARN do ACM)
  alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:123456789012:certificate/xyz
  
  # Redirecionar HTTP → HTTPS
  alb.ingress.kubernetes.io/ssl-redirect: "443"
  
  # Grupos de segurança customizados
  alb.ingress.kubernetes.io/security-groups: sg-12345678
```

---

### **6. Troubleshooting**
- **Problema**: Load Balancer não é criado.
  - **Solução**: Verifique se o **AWS Load Balancer Controller** está rodando:
    ```sh
    kubectl logs -n kube-system deployment/aws-load-balancer-controller
    ```
- **Problema**: DNS do LB não resolve.
  - **Solução**: Pode levar alguns minutos para propagar. Verifique no Console AWS > EC2 > Load Balancers.

---

### **7. Boas Práticas**
1. **Use Ingress para HTTP/HTTPS**: Simplifica gerenciamento de rotas.
2. **Evite muitos pequenos LBs**: Consolide usando Ingress.
3. **Habilite deleção automática**: Adicione a anotação:
   ```yaml
   alb.ingress.kubernetes.io/cleanup: "true"
   ```
   (Garante que o ALB seja deletado quando o Ingress for removido).

---

### **8. Exemplo Completo: ALB com HTTPS**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: meu-app-seguro
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:123456789012:certificate/xyz
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-TLS13-1-2-2021-06
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: meu-app
                port:
                  number: 80
```

---

### **Resumo**
- **ALB**: Para aplicações web (HTTP/S), gerenciado via Ingress + AWS Load Balancer Controller.
- **NLB**: Para tráfego de baixa latência (TCP/UDP), gerenciado via Service `type: LoadBalancer`.
- **Controller**: O componente mágico que automatiza tudo isso.

Quer configurar um Load Balancer específico? Me diga seu cenário que ajudo com o YAML! 🚀

## Proximos passos

[[Detalhamento Adicional Load Balancer EKS]]