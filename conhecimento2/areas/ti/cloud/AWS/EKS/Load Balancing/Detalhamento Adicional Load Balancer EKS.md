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
### **1. O Que é um Load Balancer no EKS?**
É um serviço da AWS que distribui tráfego de rede para seus **pods Kubernetes**, garantindo alta disponibilidade e escalabilidade. No EKS, você pode usar dois tipos:

1. **Application Load Balancer (ALB)**: Para aplicações web (HTTP/HTTPS).
2. **Network Load Balancer (NLB)**: Para tráfego de baixa latência (TCP/UDP).

---

### **2. Como o Load Balancer é Criado?**
Depende do recurso Kubernetes que você usa:

| Recurso Kubernetes   | Tipo de LB Gerado | Como Funciona?                          |
|----------------------|-------------------|----------------------------------------|
| **Service** (com `type: LoadBalancer`) | NLB (ou Classic LB) | Expõe um serviço interno/externo via TCP/UDP. |
| **Ingress** (com anotações ALB) | ALB              | Roteia tráfego HTTP/HTTPS baseado em regras (paths, hosts). |

---

### **3. Passo a Passo: Configurando um NLB (Exemplo Prático)**
#### **Objetivo**: Expor um app na porta 80 via NLB.

#### **Passo 1: Crie um Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: meu-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: meu-app
  template:
    metadata:
      labels:
        app: meu-app
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```

#### **Passo 2: Crie um Service do Tipo `LoadBalancer`**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: meu-app-nlb
spec:
  type: LoadBalancer  # Isso provisiona um NLB automaticamente
  selector:
    app: meu-app
  ports:
    - protocol: TCP
      port: 80        # Porta do LB
      targetPort: 80  # Porta do pod
```

#### **O que acontece?**
1. O EKS cria um **Network Load Balancer** na AWS.
2. Os pods com a label `app: meu-app` são registrados como **targets**.
3. Você recebe um DNS do NLB (ex.: `meu-app-nlb-123.elb.us-east-1.amazonaws.com`).

#### **Verifique no Console AWS**:
- Acesse **EC2 > Load Balancers** e veja o NLB criado.

---

### **4. Passo a Passo: Configurando um ALB (Exemplo Prático)**
#### **Objetivo**: Roteamento HTTP para múltiplos serviços.

#### **Pré-requisitos**:
- Instale o **AWS Load Balancer Controller**:
  ```sh
  helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
    --set clusterName=meu-cluster \
    --namespace kube-system
  ```

#### **Passo 1: Crie um Ingress**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: meu-app-ingress
  annotations:
    kubernetes.io/ingress.class: alb               # Usa ALB
    alb.ingress.kubernetes.io/scheme: internet-facing  # LB público
    alb.ingress.kubernetes.io/target-type: ip     # Roteia para pods diretamente
spec:
  rules:
  - http:
      paths:
      - path: /app1
        pathType: Prefix
        backend:
          service:
            name: app1-service
            port:
              number: 80
      - path: /app2
        pathType: Prefix
        backend:
          service:
            name: app2-service
            port:
              number: 80
```

#### **O que acontece?**
1. O **AWS Load Balancer Controller** cria um ALB.
2. Configura **listeners** na porta 80/443.
3. Cria **rules** para rotear:
   - `/app1` → `app1-service`
   - `/app2` → `app2-service`

#### **Verifique no Console AWS**:
- Acesse **EC2 > Load Balancers** e veja o ALB com suas regras.

---

### **5. Diagrama de Como o Tráfego Flui**
```
(Usuário) → [ALB/NLB] → [Ingress/Service] → [Pods]
```

- **Para ALB**:
  ```
  HTTP Request → ALB (rota /app1) → Ingress → Service → Pod
  ```

- **Para NLB**:
  ```
  TCP Connection → NLB → Service → Pod
  ```

---

### **6. Diferenças Chave Entre ALB e NLB**
| Característica       | ALB                          | NLB                          |
|----------------------|------------------------------|------------------------------|
| **Protocolo**        | HTTP/HTTPS                   | TCP/UDP                      |
| **Roteamento**       | Por path/host (ex.: /api)    | Por porta (ex.: 80 → 8080)   |
| **SSL/TLS**          | Terminação nativa            | Precisa de certificado no app |
| **IP**               | Apenas DNS                   | IP estático (opcional)        |
| **Custo**            | Mais alto (por regra)        | Mais baixo                   |

---

### **7. Troubleshooting Comum**
#### **Problema**: Load Balancer não aparece.
- **Solução**:
  - Verifique se o **AWS Load Balancer Controller** está rodando:
    ```sh
    kubectl get pods -n kube-system | grep aws-load-balancer-controller
    ```
  - Confira os logs:
    ```sh
    kubectl logs -n kube-system deployment/aws-load-balancer-controller
    ```

#### **Problema**: DNS não resolve.
- **Solução**:
  - Pode levar 1-2 minutos para o LB ficar ativo. Verifique no Console AWS.

#### **Problema**: Tráfego não chega aos pods.
- **Solução**:
  - Verifique os **target groups** no Console AWS:
    - Os pods estão saudáveis? (`kubectl get pods`).
    - O Service tem os selectores corretos?

---

### **8. Exemplo Avançado: ALB com HTTPS**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: meu-app-https
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:123456789012:certificate/xyz  # Certificado SSL
    alb.ingress.kubernetes.io/ssl-redirect: "443"  # Redireciona HTTP → HTTPS
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

### **9. Dicas de Boas Práticas**
1. **Use Ingress para HTTP(S)**: Simplifica gerenciamento de múltiplas rotas.
2. **Evite muitos LBs pequenos**: Consolide usando um único ALB com múltiplas rotas.
3. **Monitore seus LBs**: Use Amazon CloudWatch para métricas (latência, requisições).
4. **Habilite logs de acesso**: No ALB, ative logs para análise de tráfego.

---

### **10. Resumo Final**
- **NLB**: Simples, para TCP/UDP. Use com `Service type: LoadBalancer`.
- **ALB**: Para HTTP/HTTPS complexo. Use com `Ingress` + AWS Load Balancer Controller.
- **Controller**: O "cérebro" que automatiza a criação de LBs.

Quer testar? Comece com um NLB básico e depois evolua para um ALB com Ingress! 🚀