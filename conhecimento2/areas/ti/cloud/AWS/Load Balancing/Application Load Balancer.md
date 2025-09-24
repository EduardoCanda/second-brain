---
tags:
  - Fundamentos
  - NotaBibliografica
  - Redes
  - Cloud
categoria_servico: hibrido
cloud_provider: aws
categoria: balanceamento_carga
---
O **Application Load Balancer (ALB)** da AWS é um balanceador de carga de **camada 7 (HTTP/HTTPS)** que distribui tráfego de aplicações web com base em **conteúdo da requisição** (como URLs, cabeçalhos e métodos HTTP). Ele é ideal para arquiteturas modernas, como microsserviços e containers.  

---

## **🔹 Como o ALB Funciona?**  

1. **Recebe a Requisição**  
   - O ALB atua como um único ponto de entrada para o tráfego (ex.: `https://app.exemplo.com`).  
   - Escuta em **portas HTTP (80) ou HTTPS (443)** usando **Listeners**.  

2. **Avalia as Regras de Roteamento**  
   - Verifica:  
     - **Hostname** (ex.: `api.exemplo.com` vs. `app.exemplo.com`).  
     - **Path** (ex.: `/v1/users` vs. `/v2/products`).  
     - **Cabeçalhos HTTP** (ex.: `Content-Type: application/json`).  
     - **Método HTTP** (GET, POST, etc.).  

3. **Encaminha para o Target Group Correto**  
   - Se a requisição for `/api/*`, envia para o **Target Group de backend**.  
   - Se for `/static/*`, envia para um **Target Group de arquivos estáticos (S3/CloudFront)**.  
   - Se não houver match, usa a **ação padrão** (ex.: erro 404 ou redirecionamento).  

4. **Health Checks (Verificações de Saúde)**  
   - Monitora os **targets** (servidores, Lambdas, containers) e remove os que falharem.  

---

## **🔹 Principais Recursos do ALB**  

| Recurso                            | Descrição                                                                |     |
| ---------------------------------- | ------------------------------------------------------------------------ | --- |
| **Balanceamento de Carga**         | Distribui tráfego entre instâncias EC2, containers (ECS/EKS) ou Lambdas. |     |
| **Roteamento Baseado em Conteúdo** | Direciona tráfego por **URL path, hostname ou headers**.                 |     |
| **Suporte a HTTP/2 e WebSockets**  | Melhora performance para aplicações modernas.                            |     |
| **Terminação SSL/TLS**             | Gerencia certificados HTTPS (via AWS ACM).                               |     |
| **Integração com AWS WAF**         | Protege contra ataques DDoS e injeção SQL.                               |     |
| **Sticky Sessions (Afinidade)**    | Mantém sessões do usuário no mesmo servidor.                             |     |
| **Redirecionamentos HTTP → HTTPS** | Força conexões seguras.                                                  |     |

---

## **🔹 Arquitetura Típica do ALB**  

```
Clientes → (HTTPS:443) → [ ALB ] → Roteamento:
           │
           ├── /api/*    → [Target Group: Backend (EC2/ECS)]  
           ├── /static/* → [Target Group: S3/CloudFront]  
           └── Padrão    → [Target Group: Frontend (React/Angular)]
```

---

## **🔹 Exemplo de Configuração (AWS CLI)**  

1. **Criar um ALB:**  
   ```sh
   aws elbv2 create-load-balancer \
     --name my-app-alb \
     --subnets subnet-123456 subnet-789012 \
     --security-groups sg-123456 \
     --type application
   ```

2. **Criar um Target Group (servidores backend):**  
   ```sh
   aws elbv2 create-target-group \
     --name backend-servers \
     --protocol HTTP \
     --port 8080 \
     --vpc-id vpc-123456 \
     --health-check-path /health
   ```

3. **Criar um Listener (HTTPS 443):**  
   ```sh
   aws elbv2 create-listener \
     --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-app-alb/50dc6c495c0c9188 \
     --protocol HTTPS \
     --port 443 \
     --certificates CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012 \
     --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/backend-servers/1234567890123456
   ```

4. **Adicionar uma Regra de Roteamento (Path-Based):**  
   ```sh
   aws elbv2 create-rule \
     --listener-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:listener/app/my-app-alb/50dc6c495c0c9188/1234567890123456 \
     --conditions Field=path-pattern,Values='/api/*' \
     --actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/backend-servers/1234567890123456
   ```

---

## **🔹 Quando Usar o ALB?**  
✔ **Aplicações Web/Mobile** (React, Angular, Vue).  
✔ **APIs RESTful / Microsserviços** (roteamento por `/v1`, `/v2`).  
✔ **Serverless ([[Lambda Detalhes|Lambda]] + [[APi Gateway]])** (via ALB + Lambda Target).  
✔ **Containers ([[ECS]]/[[Meu resumo EKS|EKS]])** (balanceamento entre pods).  

---

## **🔹 Diferença Entre ALB vs NLB vs CLB**  
| Feature                 | ALB (Layer 7)         | NLB (Layer 4)                    | CLB (Legado)       |     |
| ----------------------- | --------------------- | -------------------------------- | ------------------ | --- |
| **Protocolos**          | HTTP/HTTPS/WebSockets | TCP/UDP/TLS                      | HTTP/HTTPS/TCP     |     |
| **Roteamento Avançado** | ✅ (Path/Host/Headers) | ❌ (Apenas IP:Porta)              | ❌                  |     |
| **Performance**         | Alto (até 100k RPS)   | Extremamente Alta (milhões RPS)  | Moderada           |     |
| **Use Case**            | Apps Web/APIs         | Jogos/Streaming (baixa latência) | Migração de legado |     |

---

### **Conclusão**  
O **ALB** é a melhor escolha para aplicações web modernas que precisam de:  
- **Roteamento inteligente** (microsserviços, path-based).  
- **Suporte a HTTPS e HTTP/2**.  
- **Integração com ECS, Lambda e Kubernetes**.  

Se precisar de **ultra-baixa latência** (ex.: jogos), considere o **NLB**. Caso queira um exemplo mais detalhado, posso ajudar! 🚀