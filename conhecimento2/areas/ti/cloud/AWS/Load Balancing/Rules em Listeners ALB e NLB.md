---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
categoria: balanceamento_carga
---
Aqui estão exemplos práticos de **regras (rules)** para Listeners em **ALB ([[Application Load Balancer]])** e **NLB ([[Network Load Balancer]])** na AWS, com explicações:

---

## **🔹 Regras (Rules) no ALB (HTTP/HTTPS - Layer 7)**  
O ALB suporta roteamento avançado baseado em:  
- **Path (caminho da URL)**  
- **Host (domínio)**  
- **Headers HTTP**  
- **Método HTTP (GET, POST, etc.)**  

### **Exemplo 1: Roteamento por Path (`/api`, `/app`)**  
```plaintext
Listener (HTTPS:443) → Regras:
  1. Se o path for `/api/*` → Encaminha para Target Group "backend-api" (EC2/ECS).
  2. Se o path for `/app/*` → Encaminha para Target Group "frontend-app" (servidores web).
  3. Padrão (default) → Retorna erro 404.
```

**Configuração (CLI):**  
```sh
aws elbv2 create-rule \
  --listener-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:listener/app/my-alb/50dc6c495c0c9188/1234567890123456 \
  --conditions Field=path-pattern,Values='/api/*' \
  --actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/backend-api/1234567890123456
```

### **Exemplo 2: Roteamento por Host (domínio)**  
```plaintext
Listener (HTTPS:443) → Regras:
  1. Se o host for `api.exemplo.com` → Target Group "api".
  2. Se o host for `app.exemplo.com` → Target Group "frontend".
```

**Configuração (CLI):**  
```sh
aws elbv2 create-rule \
  --listener-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:listener/app/my-alb/50dc6c495c0c9188/1234567890123456 \
  --conditions Field=host-header,Values='api.exemplo.com' \
  --actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/api/1234567890123456
```

### **Exemplo 3: Roteamento por Header HTTP**  
```plaintext
Listener (HTTPS:443) → Regras:
  1. Se o header `User-Agent` contiver `Mobile` → Target Group "mobile-backend".
```

**Configuração (CLI):**  
```sh
aws elbv2 create-rule \
  --listener-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:listener/app/my-alb/50dc6c495c0c9188/1234567890123456 \
  --conditions Field=http-header,HttpHeaderConfig='{ "HttpHeaderName": "User-Agent", "Values": ["*Mobile*"] }' \
  --actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/mobile-backend/1234567890123456
```

---

## **🔹 Regras (Rules) no NLB (TCP/UDP - Layer 4)**  
O NLB **não suporta roteamento baseado em conteúdo** (como paths ou headers), mas pode:  
- **Direcionar tráfego por porta** (ex.: porta 80 → TG A, porta 443 → TG B).  
- **Usar TLS para terminação SSL**.  

### **Exemplo 1: Listener TCP na porta 80 → Target Group padrão**  
```plaintext
Listener (TCP:80) → Ação padrão: Encaminha para Target Group "web-servers".
```

**Configuração (CLI):**  
```sh
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/my-nlb/50dc6c495c0c9188 \
  --protocol TCP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/web-servers/1234567890123456
```

### **Exemplo 2: Listener TLS na porta 443 → Target Group seguro**  
```plaintext
Listener (TLS:443) → Ação padrão: Encaminha para Target Group "secure-servers" com certificado SSL.
```

**Configuração (CLI):**  
```sh
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/my-nlb/50dc6c495c0c9188 \
  --protocol TLS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/secure-servers/1234567890123456
```

---

## **🔹 Resumo: ALB vs NLB (Rules)**  
| **Feature**       | **ALB (Layer 7)** | **NLB (Layer 4)** |
|-------------------|------------------|------------------|
| **Roteamento por Path** | ✅ (ex: `/api`) | ❌ |
| **Roteamento por Host** | ✅ (ex: `api.exemplo.com`) | ❌ |
| **Roteamento por Header** | ✅ (ex: `User-Agent: Mobile`) | ❌ |
| **Roteamento por Porta** | ✅ (mas menos comum) | ✅ (principal uso) |
| **Terminação TLS/SSL** | ✅ | ✅ |

---

### **Quando Usar Cada Um?**  
- **ALB:** Aplicações web/APIs (HTTP/HTTPS) com roteamento avançado.  
- **NLB:** Jogos, streaming, TCP/UDP (alta performance, baixa latência).  

Precisa de um exemplo mais específico? Posso ajudar! 🚀