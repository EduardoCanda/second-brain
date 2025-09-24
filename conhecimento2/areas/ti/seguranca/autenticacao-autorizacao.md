---
tags:
  - Segurança
  - Fundamentos
  - NotaBibliografica
---
## 🧠 **O que é Autenticação e Autorização? (Revisão rápida)**

- **Autenticação** = *verificar quem é você*
    
    Ex: login com senha, biometria, OAuth, OIDC, MFA
    
- **Autorização** = *definir o que você pode acessar*
    
    Ex: escopos (`read:profile`), permissões em RBAC, policies IAM
    

---

## ☁️ **CIAM (Customer Identity and Access Management)**

### 📘 **O que é [[CIAM]]?**

**CIAM** é uma abordagem especializada de IAM (Identity and Access Management) voltada para **clientes externos**, como usuários finais, parceiros e consumidores — diferente do IAM tradicional, que foca em usuários internos (funcionários, serviços, etc).

> CIAM = identidade + segurança + experiência do cliente final.
> 

---

### 🎯 **Principais capacidades de um CIAM moderno:**

- **Autenticação segura e escalável**
    - Suporte a login social (Google, Apple, Facebook)
    - Login com e-mail/senha, MFA, biometria
    - Gerenciamento de sessão
- **Gerenciamento de identidade**
    - Registro de usuário, perfil, preferências
    - Consentimento (LGPD, GDPR)
- **Autorização baseada em escopos ou claims**
    - Ex: cliente PJ pode acessar dashboard de gestão, mas não APIs administrativas
- **Federation & SSO**
    - Login único em múltiplas plataformas (Web, Mobile, API)
- **Segurança adaptativa**
    - Riscos por geolocalização, device, hora, etc.

---

### 🧰 **Ferramentas populares CIAM**

- **Amazon Cognito** (AWS)
- **Auth0** / Okta
- **Azure AD B2C**
- **ForgeRock**, **Ping Identity**

---

### 🧠 **Exemplo bancário com CIAM:**

Um cliente PJ acessa um portal via login com Cognito. O Cognito autentica via OIDC, emite um ID token e um access token com escopos específicos (`pj:read:dashboard`). O token é então usado para autorizar requisições a APIs protegidas — sem precisar reautenticar em cada sistema.

---

## 🔐 **STS (Security Token Service) — Autorização segura entre sistemas**

### 📘 **O que é AWS STS?**

O **AWS STS (Security Token Service)** é um serviço que permite emitir **credenciais temporárias** (tokens de segurança) com permissões restritas e tempo de vida definido.

> Ele é usado para permitir que serviços ou usuários assumam roles com permissões específicas, sem expor chaves fixas ou amplas demais.
> 

---

### 🎯 **Como funciona a autorização com STS:**

1. Uma entidade (usuário, serviço ou sistema) solicita **AssumeRole**
2. O STS emite **AccessKeyId + SecretAccessKey + SessionToken**, válidos por até 12 horas
3. Essas credenciais são usadas para interagir com recursos AWS (S3, DynamoDB, etc.)
4. Ao expirar, a entidade deve pedir novo token

---

### 🧩 **Quando usar STS:**

- Comunicação **server-to-server** (ex: microserviços em diferentes contas AWS)
- **Delegação de acesso temporário**
- **Federated Identity**: integrar SAML, AD, Google Workspace, etc.
- Garantir **princípio do menor privilégio** com TTL e escopo restrito

---

## 🔄 **CIAM vs STS — Como se relacionam?**

| Aspecto               | CIAM                                    | STS (Security Token Service)                     |
| --------------------- | --------------------------------------- | ------------------------------------------------ |
| Público-alvo          | Usuários externos (clientes, parceiros) | Usuários/sistemas internos ou federados          |
| Foco principal        | Autenticação + experiência + segurança  | Autorização delegada + acesso temporário         |
| Tipo de token emitido | JWT (OIDC/OAuth 2.0)                    | Credenciais temporárias AWS (Access Key + Token) |
| Duração do token      | Minutos até horas, com refresh          | Até 12h, sem refresh token                       |
| Casos de uso comuns   | Portais, apps, autenticação de clientes | Assumir roles entre contas, integração M2M, SSO  |
| Exemplo de ferramenta | Cognito, Auth0, Azure B2C               | AWS STS, `assumeRole`, `getSessionToken`, etc.   |

---

## 🔐 Exemplo prático combinando CIAM e STS:

Imagine um cliente PJ acessando o portal de investimentos de um banco:

1. Ele autentica via **Amazon Cognito (CIAM)** — usando login federado (AD corporativo)
2. O sistema backend (API) precisa consultar dados sigilosos armazenados em S3, mas **o client não pode ter acesso direto**
3. A API **assume uma role via STS** (`AssumeRole`) com permissões mínimas de leitura naquele bucket
4. O acesso é realizado com segurança, auditável via CloudTrail, e com credenciais que expiram em 30 minutos

---

## ✅ Conclusão para entrevista

> “CIAM é a camada de autenticação e gestão de identidade voltada ao cliente externo — oferecendo login, perfil, escopos e segurança. Já o STS é uma ferramenta poderosa para autorização segura entre serviços, emitindo credenciais temporárias com permissões limitadas. Em arquiteturas modernas, é comum usar ambos: CIAM para autenticar o usuário, e STS para permitir que o backend assuma roles temporárias ao acessar dados sensíveis ou operar em múltiplas contas. Já implementei esse modelo em APIs com Cognito + STS, garantindo segurança, segregação e rastreabilidade.”



