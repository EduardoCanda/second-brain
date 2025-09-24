---
tags:
  - Fundamentos
  - NotaBibliografica
  - Cloud
categoria_servico: paas
cloud_provider: aws
---
## 🧠 **Quais são os tipos de API Gateway na AWS?**

### ✅ 1. **Amazon API Gateway - REST API (v1)**

> Modelo mais completo e tradicional, com recursos avançados para controle total de APIs RESTful.
> 

### 📌 Características:

- Suporte completo a **REST** com métodos HTTP configuráveis (`GET`, `POST`, etc.)
- **Autenticação integrada** com Cognito, IAM ou Lambda Authorizer
- **Transformação de payload** com **Mapping Templates (Velocity)**
- Suporte a **API Keys**, **Throttling**, **Caching**
- Integrações com Lambda, HTTP, AWS Services, VPC Link

### 🧠 Quando usar:

- Precisa de controle granular em cada etapa da requisição
- Precisa de transformação de payloads ou uso intenso de custom headers
- Projetos legados ou com necessidades avançadas de autenticação e controle de tráfego

---

### ✅ 2. **Amazon API Gateway - HTTP API (v2)**

> Versão mais moderna, otimizada para simplicidade, baixo custo e alta performance — especialmente para serverless.
> 

### 📌 Características:

- Foco em **desempenho e simplicidade**
- Até **70% mais barato** que REST API
- Suporte nativo a:
    - AWS Lambda
    - HTTP endpoints
    - JWT (OpenID Connect)
- Suporte a **CORS**, **throttling**, e **rate limiting**
- Sem suporte a Mapping Templates nem customização detalhada por método

### 🧠 Quando usar:

- APIs simples com foco em **latência e custo**
- Integração com **Lambda + JWT (Cognito/Okta/Keycloak)**
- APIs internas ou de uso leve

---

## ⚖️ **Comparativo: REST API vs HTTP API**

| Recurso/Capacidade | **REST API (v1)** | **HTTP API (v2)** |
| --- | --- | --- |
| Latência | Maior (~100ms) | Menor (~30ms) |
| Custo | Mais caro | Mais barato (até 70%) |
| Mapping templates | ✅ Sim | ❌ Não |
| Autorização (IAM, Cognito, JWT) | ✅ Completo | ✅ JWT, Cognito, IAM simples |
| WebSocket | ✅ Sim | ❌ Não |
| Caching | ✅ Sim | ❌ Não suportado |
| Uso recomendado | APIs externas robustas | APIs simples, serverless |

---

## 🧪 Outros Gateways relacionados (com funções específicas):

### 🔸 **Amazon AppSync**

- Gateway GraphQL totalmente gerenciado
- Integração com DynamoDB, Lambda, Aurora, Elasticsearch
- Ideal para BFF (Backend for Frontend)

### 🔸 **Elastic Load Balancer (ALB) com listener rules**

- Pode atuar como gateway leve para microsserviços REST
- Permite roteamento por path/host para múltiplos targets

### 🔸 **Amazon CloudFront + Lambda@Edge**

- Útil para APIs públicas com cache e validação no edge
- Pode atuar como gateway com autorização leve

---

## ✅ **Conclusão para entrevista**

> “A AWS oferece dois tipos principais de API Gateway: o REST API, mais robusto e configurável, ideal para aplicações com necessidade de mapeamento, transformação e segurança avançada; e o HTTP API, que é mais simples, rápido e barato, ideal para APIs serverless e JWT-based. Já utilizei o HTTP API com Cognito para autenticação leve de APIs Lambda, e REST API para cenários mais controlados com transformação de payloads e integrações diretas com serviços internos.”
> 

### O que é o Kafka?
