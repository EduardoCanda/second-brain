---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
---
## 🧠 **O que é um API Gateway?**

Um **API Gateway** é um **ponto único de entrada para requisições externas** a um sistema de microsserviços. Ele:

- Gerencia, roteia e transforma requisições
- Aplica segurança, autenticação, limitação de chamadas (rate limiting)
- Facilita observabilidade e versionamento de APIs

---

## 🧩 **Principais tipos de API Gateway (por arquitetura ou tecnologia):**

### 🔹 1. **API Gateway Gerenciado (Managed API Gateway)**

> Oferecido como serviço por provedores cloud, com funcionalidades embutidas e sem necessidade de infraestrutura própria.
> 

### ✅ Exemplos:

- **[[Api Gateway AWS|AWS API Gateway]]**
- **Azure API Management**
- **Google Cloud Endpoints**
- **Kong Cloud**

### 🧠 Quando usar:

- Você quer escalar sem se preocupar com infraestrutura
- Precisa de integração nativa com autenticação, WAF, métricas

---

### 🔹 2. **API Gateway Open Source / Self-Hosted**

> Você instala, configura e gerencia o gateway em seu ambiente (bare metal, VMs, containers, Kubernetes).
> 

### ✅ Exemplos:

- **Kong OSS**
- **Ambassador**
- **Tyk**
- **KrakenD**
- **NGINX** (com plugins de gateway)
- **Traefik**

### 🧠 Quando usar:

- Precisa de customização extrema
- Quer manter controle total de infraestrutura
- Custo de gerenciado é proibitivo

---

### 🔹 3. **Service Mesh como Gateway (Edge Proxy)**

> Service Meshes como Istio e Linkerd podem atuar como gateway de entrada (ingress gateway) além de controlar a comunicação interna.
> 

### ✅ Exemplos:

- **Istio Gateway**
- **Envoy Proxy**

### 🧠 Quando usar:

- Já utiliza Service Mesh e quer aproveitar o controle de tráfego no edge
- Deseja unificar política de segurança interna e externa

---

### 🔹 4. **API Gateway para Functions / Serverless**

> Gateways otimizados para Lambda, Cloud Functions, FaaS, com suporte a autenticação leve, mapeamento de eventos e proxy direto.
> 

### ✅ Exemplos:

- **AWS HTTP API Gateway** (versão mais leve e rápida)
- **Firebase Functions Gateway**
- **Netlify Edge Functions**

### 🧠 Quando usar:

- Aplicações serverless que não precisam de todos os recursos pesados do API Gateway tradicional

---

## 📦 **Comparativo dos tipos de API Gateway:**

| Tipo | Gerenciado? | Customizável? | Ideal para... |
| --- | --- | --- | --- |
| **Managed Gateway (AWS, Azure)** | ✅ Sim | ❌ Pouco | Microsserviços na nuvem com baixo overhead |
| **Open Source (Kong, Tyk)** | ❌ Não | ✅ Alto | Controle total, ambientes self-hosted |
| **Service Mesh Gateway (Istio)** | ⚠️ Parcial | ✅ Avançado | Ambientes Kubernetes com malha de serviços |
| **Serverless Gateway (HTTP API)** | ✅ Sim | ❌ Limitado | APIs leves com alto volume de chamadas |

---

## 🔐 **Critérios para escolha em entrevista:**

| Requisito | Gateway ideal |
| --- | --- |
| **Alta escalabilidade sem gerenciar infra** | AWS API Gateway |
| **Custom rules, plugins, autenticação sob medida** | Kong, Tyk, NGINX |
| **Ambiente Kubernetes com Mesh** | Istio + Envoy |
| **Baixo custo e latência para Lambda** | AWS HTTP API |
| **GraphQL / BFF APIs** | Apollo Gateway ou API Gateway + Resolver personalizado |

---

## ✅ **Conclusão para entrevista**

> “Existem diversos tipos de API Gateway, desde soluções gerenciadas como o AWS API Gateway até ferramentas open source como Kong e Tyk. A escolha depende de requisitos como performance, custo, nível de controle e integração com o ambiente. Em arquiteturas serverless com Lambda, costumo usar o HTTP API Gateway por simplicidade e latência reduzida. Já em ambientes mais complexos e multicloud, adoto Kong com autenticação JWT e plugins de segurança. Também trabalhei com Istio em clusters EKS para controle avançado de tráfego com observabilidade integrada.”
> 
