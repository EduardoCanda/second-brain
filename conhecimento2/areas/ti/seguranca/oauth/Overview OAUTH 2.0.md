---
tags:
  - Segurança
  - Fundamentos
  - NotaBibliografica
---
## 🔐 **O que é OAuth 2.0 e por que é tão importante?**

**OAuth 2.0 é um protocolo de *[[autenticacao-autorizacao|autorização]] delegada***. Diferente da autenticação (que verifica *quem você é*), a autorização determina *o que você pode acessar*.

Seu principal objetivo é permitir que aplicações acessem recursos de usuários em nome deles — **sem que essas aplicações precisem conhecer ou armazenar suas credenciais**. Isso é feito através de *[[JWT|tokens de acesso]]*, que funcionam como chaves temporárias para acessar APIs protegidas.

---

### 🧠 **Por que OAuth 2.0 é necessário?**

Imagine um cenário bancário onde um cliente deseja que uma aplicação de terceiros (como um app de gestão financeira) acesse suas transações. Sem OAuth, ele teria que informar seu login e senha do banco ao app — o que é inseguro e inaceitável do ponto de vista de compliance.

**Com OAuth 2.0, o cliente autoriza o acesso via um servidor de autorização (como o Cognito)**, e o app recebe apenas um **token de acesso limitado, com escopo e tempo de vida controlados.**

---

### 🔄 **Componentes principais do OAuth 2.0:**

| Componente               | Papel                                                      |
| ------------------------ | ---------------------------------------------------------- |
| **Resource Owner**       | O usuário que possui os dados                              |
| **Client**               | A aplicação que deseja acessar os dados                    |
| **Authorization Server** | Emite tokens e valida permissões (ex: Amazon Cognito)      |
| **Resource Server**      | A API que protege os dados (ex: API Gateway, Lambda, etc.) |
|                          |                                                            |

---

### 🔁 **Fluxos mais comuns:**

- **Authorization Code Flow**: usado por apps com interface (ex: web ou mobile), requer redirecionamento e é mais seguro
- **Client Credentials Flow**: usado para comunicação entre sistemas, sem um usuário final envolvido
- **Implicit e PKCE**: variações para ambientes públicos e mobile

---

### 🛡️ **Segurança via escopos e tempo de vida:**

- Tokens podem ser limitados por **escopos** (`read:accounts`, `transfer:write`) e **expirar automaticamente**
- Os usuários **podem revogar acessos** sem trocar suas credenciais
- A separação entre *Authentication* (OIDC) e *Authorization* (OAuth) permite arquiteturas mais flexíveis e seguras

---

## ☁️ **Implementação prática com Amazon Cognito e API Gateway**

**Amazon Cognito** é o serviço da AWS que pode atuar como **Authorization Server**, emitindo tokens compatíveis com OAuth 2.0 e OpenID Connect (OIDC).

### 🔧 Como funciona na prática:

1. Você configura um **User Pool** para gerenciar os usuários
2. Cria um **App Client** com os fluxos OAuth habilitados (Authorization Code, Client Credentials, etc.)
3. Define os **scopes** e URLs de redirecionamento
4. Integra o Cognito como **Authorizer no API Gateway**
5. O **API Gateway valida automaticamente os access tokens**, rejeitando requisições inválidas

### 🔁 Exemplo de fluxo (Authorization Code Flow):

- O usuário é redirecionado para o Cognito (`/oauth2/authorize`)
- Após autenticar e consentir, Cognito redireciona com um *authorization code*
- O app troca esse código por um **access token**
- Esse token é enviado no header da requisição à API protegida
- O **API Gateway**, com Cognito como authorizer, **valida o token antes de executar qualquer lógica**

---

### ✅ Vantagens dessa abordagem:

- Implementação nativa com **baixo esforço operacional**
- Tokens seguem padrões [[JWT]] (com `iss`, `sub`, `scope`, etc.)
- Fácil integração com **federated identity** (Google, AD, SAML)
- Escalável, seguro, com **monitoramento via CloudWatch e CloudTrail**

---

## 🧠 **Quando usar Lambda Authorizer em vez de Cognito Authorizer?**

Apesar do Cognito Authorizer ser prático, **há cenários onde o Lambda Authorizer é a melhor escolha**, por oferecer controle total sobre a autenticação e autorização.

### Exemplos típicos:

- O token vem de outro provedor (ex: Auth0, Keycloak, AD interno)
- O token tem claims customizados que precisam ser validados de forma específica
- A autorização depende de regras de negócio adicionais (ex: “cliente PJ ativo com rating A”)
- O escopo de acesso depende do endpoint ou do produto acessado
- Integração com banco de dados para verificar status em tempo real (ex: cliente bloqueado)

---

### ⚙️ Como funciona o Lambda Authorizer:

1. O cliente envia o token no header `Authorization: Bearer <token>`
2. O API Gateway chama o **Lambda Authorizer** antes de executar a rota
3. O Lambda:
    - Decodifica e valida o token (ex: assinatura, escopos, expiração)
    - Aplica regras de negócio
    - Retorna uma **IAM Policy Allow/Deny** com contextos adicionais (ex: `cliente_id`, `perfil`)
4. O API Gateway usa essa policy para permitir ou negar o acesso
5. A função de backend (ex: Lambda, ECS) pode ler esses contextos para aplicar lógicas adicionais

---

### ✅ Vantagens do Lambda Authorizer:

- Controle total da lógica de autorização
- Suporte a múltiplos IdPs e tokens personalizados
- Validação dinâmica baseada em dados externos
- Cache configurável (para reduzir latência)

---

## 🧩 **Resumo Final:**

| Critério                    | Cognito User Pool Authorizer   | Lambda Authorizer                           |
| --------------------------- | ------------------------------ | ------------------------------------------- |
| **Facilidade de uso**       | Alta – configuração nativa     | Média – exige código customizado            |
| **Flexibilidade de regras** | Limitada a validação de token  | Total – regras de negócio, múltiplas fontes |
| **Multiplos IdPs**          | Requer federação configurada   | Totalmente customizável                     |
| **Performance (com cache)** | Alta                           | Alta (com TTL configurado)                  |
| **Indicado para**           | Casos padrão, login web/mobile | Casos avançados, APIs bancárias complexas   |

---

**Conclusão:**

> “Na minha experiência, OAuth 2.0 é essencial para garantir segurança, rastreabilidade e controle de acesso em arquiteturas modernas. Já implementei soluções completas com Cognito + API Gateway em fluxos de autorização para clientes PJ, e também usei Lambda Authorizers para aplicar regras mais complexas de acesso, como segmentação por perfil ou verificação em tempo real. A escolha entre um e outro depende do grau de controle que o sistema exige.”
> 

