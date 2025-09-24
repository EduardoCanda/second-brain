---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---

“OAuth 2.0 é um protocolo de autorização — ele não autentica o usuário. Para autenticação usamos OpenID Connect (OIDC), que complementa o OAuth 2.0 adicionando identidade. Em ambientes AWS, como com [[Amazon Cognito]], podemos usar ambos juntos: OIDC para autenticar o usuário e OAuth para garantir que ele só acesse recursos permitidos. Isso é essencial para separar responsabilidades e garantir segurança em ambientes distribuídos e regulados, como no setor bancário.”

### Como funciona um fluxo recomendado de autenticação e autorização server-to-server usando OAuth 2.0?

## 🧠 Conceito-chave

Em integrações **server-to-server**, dois sistemas (sem interação humana) precisam se comunicar com **segurança**, **autorização delegada** e **controle de escopo**. O OAuth 2.0 oferece o **Client Credentials Flow**, um fluxo específico para esse tipo de integração.

---

## 🔐 Por que OAuth 2.0 em ambientes server-to-server?

Mesmo entre sistemas internos, é fundamental:

- **Evitar uso de credenciais fixas**
- Ter **tokens com tempo de vida limitado**
- Delegar o acesso com **escopos específicos**
- **Revogar ou rotacionar** facilmente acessos
- **Auditar** quem acessou o quê, quando, e com qual permissão

---

## 📦 Componentes envolvidos no OAuth 2.0 (M2M)

| Componente               | Papel                                                         |
| ------------------------ | ------------------------------------------------------------- |
| **Client**               | O sistema que quer consumir uma API protegida (ex: Serviço A) |
| **Authorization Server** | Entidade que emite o token (ex: Cognito, Auth0, Keycloak)     |
| **Access Token**         | O que autoriza o client a acessar os dados                    |
| **Resource Server**      | A API que protege os dados (ex: Serviço B)                    |

---

## 🔁 Fluxo detalhado: **Client Credentials Flow**

1. **Registro do Client**
    - O Serviço A é registrado no Authorization Server com:
        - `client_id`
        - `client_secret`
        - Escopos permitidos (ex: `invoice:read`, `payment:write`)
2. **Autenticação do Client**
    - O Serviço A faz uma requisição `POST` para o endpoint `/oauth2/token`, enviando:
        - `grant_type=client_credentials`
        - `client_id` e `client_secret`
        - `scope` (opcional)
    
    Exemplo:
    
    ```bash
    bash
    CopiarEditar
    curl -X POST https://auth.example.com/oauth2/token \
      -d 'grant_type=client_credentials&client_id=abc&client_secret=xyz&scope=invoice:read'
    
    ```
    
3. **Recebimento do Access Token**
    - O Authorization Server responde com um `access_token`, geralmente um JWT, e tempo de expiração.
    
    Exemplo de resposta:
    
    ```json
    {
      "access_token": "eyJhbGciOiJ...snip...",
      "expires_in": 3600,
      "token_type": "Bearer",
      "scope": "invoice:read"
    }
    
    ```
    
4. **Uso do Token**
    - O Serviço A envia o token ao acessar o Serviço B:
        
        ```
        http
        CopiarEditar
        GET /invoices HTTP/1.1
        Host: api.example.com
        Authorization: Bearer eyJhbGciOi...
        
        ```
        
5. **Validação e autorização**
    - O Serviço B valida o token:
        - Verifica assinatura com a chave pública (JWKS)
        - Verifica expiração
        - Valida escopo e *audience*
    - Se o token for válido e autorizado, a requisição é atendida.

---

## ✅ Benefícios do fluxo Client Credentials

- **Sem intervenção humana**: ideal para M2M
- **Tokens temporários e seguros**
- **Separação clara de responsabilidades**
- **Granularidade com escopos**
- **Totalmente auditável**

---

## 🧩 Como isso se aplica à AWS

### Com Cognito:

- Crie um App Client com `client_credentials` habilitado
- Configure os escopos e recursos
- Use API Gateway com Cognito Authorizer ou Lambda Authorizer para validar tokens

### Com Lambda Authorizer:

- Permite lógica customizada de autorização
- Integra com diferentes fontes de tokens (não só Cognito)
- Pode aplicar regras de negócio adicionais (ex: verificar se a aplicação está “ativa” ou autorizada para o recurso solicitado)

### Com STS:

- O fluxo é diferente do OAuth, mas segue o mesmo princípio: **acesso delegado com tempo limitado**
- Você pode usar `AssumeRole` para emitir credenciais temporárias entre serviços, ideal em ambientes multi-conta

---

## 🔐 Considerações de segurança

- **Rotacione os `client_secrets` com frequência**
- **Nunca armazene tokens em disco plano ou em código**
- **Limite os escopos com o menor privilégio possível**
- **Use HTTPS em todas as requisições**
- **Implemente logs e alertas sobre uso de tokens expirados ou inválidos**

---

## 🧠 Exemplo real para trazer em entrevista

> “Imagine que o Serviço de Conciliação precisa acessar uma API de transações para buscar informações financeiras dos últimos 30 dias. Ao invés de expor uma credencial fixa, usamos Client Credentials Flow. O serviço de conciliação autentica via OAuth, recebe um access token com escopo transactions:read, e acessa a API com segurança. A autorização é validada via Lambda Authorizer, que inspeciona o token e libera o acesso somente se o escopo e a origem forem válidos.”
> 

---

## 🎯 Pontos que o entrevistador pode explorar a partir disso

- Como você armazena e protege o `client_secret`?
    
    O `client_secret` deve ser tratado como um segredo sensível — equivalente a uma senha — e, por isso, nunca deve ser versionado em repositórios de código.
    
    As boas práticas incluem:
    
    - Armazenar o segredo em **serviços seguros de gestão de segredos**, como:
        - **AWS Secrets Manager**
        - **AWS Systems Manager Parameter Store (com KMS encryption)**
    - Permitir o acesso ao segredo apenas à função ou serviço que irá utilizá-lo, aplicando **principais de menor privilégio via IAM**
    - Em ambientes de CI/CD, utilizar **variáveis de ambiente seguras** e mascaradas nos pipelines
    - Configurar **rotação automática do segredo**, se suportado pelo provedor
- O que acontece quando um token expira?
    
    Tokens emitidos via o fluxo Client Credentials são **tokens de curta duração**, tipicamente com validade entre 5 minutos e 1 hora, por segurança.
    
    Quando o token expira:
    
    - O client deve **solicitar um novo access token** ao Authorization Server, utilizando novamente seu `client_id` e `client_secret`
    - Isso é seguro e esperado, pois **não existe refresh token nesse fluxo**
    
    > Esse comportamento é importante para garantir que, mesmo que um token seja interceptado, ele tenha uma janela de uso limitada.
    > 
- Você já usou refresh token nesse fluxo?
    
    **Não. O Client Credentials Flow não utiliza refresh tokens.**
    
    Isso porque:
    
    - O token não está associado a um usuário humano
    - O client (serviço) pode solicitar novos access tokens a qualquer momento, desde que tenha as credenciais válidas (`client_id` + `client_secret`)
    
    > O uso de refresh tokens é típico de fluxos com interação humana, como Authorization Code Flow ou Resource Owner Password Flow (que inclusive está obsoleto).
    > 
- Como o Resource Server valida a assinatura do token?
    
    Tokens de acesso geralmente são emitidos no formato JWT, e assinados com uma **chave privada (RSA ou HMAC)** pelo Authorization Server.
    
    O Resource Server valida o token:
    
    1. **Baixando a chave pública (JWK ou JWKS)** do Authorization Server — por exemplo, Cognito expõe isso em:
        
        ```
        bash
        CopiarEditar
        https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
        
        ```
        
    2. **Verificando a assinatura** usando essa chave pública
    3. Validando os *claims* do token:
        - `exp` (expiração)
        - `aud` (audience)
        - `iss` (issuer)
        - `scope` (escopos permitidos)
    
    Essa validação pode ser feita com bibliotecas como:
    
    - `jsonwebtoken` (Node.js)
    - `python-jose` ou `Authlib` (Python)
    - `spring-security-oauth2-resource-server` (Java)
    - `aws-jwt-verify` (lib oficial da AWS)
    
    > Em arquiteturas AWS, o API Gateway pode delegar isso automaticamente ao Cognito Authorizer, ou você pode usar um Lambda Authorizer customizado para lógica mais avançada.
    > 
- Como você lida com multi-tenant ou multi-produto usando OAuth?
    
    Existem várias estratégias, dependendo da arquitetura:
    
    1. **Scopes diferenciados por tenant ou produto:**
        - Ex: `tenant1:read:data`, `tenant2:write:report`
        - Isso pode ser codificado no token e interpretado no Resource Server
    2. **Claims adicionais no JWT:**
        - Incluir `tenant_id`, `product_id` ou `group` como claims personalizados
        - O Resource Server aplica regras específicas baseadas nesses valores
    3. **Tenant isolation na emissão dos tokens:**
        - Cada tenant possui um `client_id` próprio, com escopos limitados ao que ele pode acessar
        - O Authorization Server pode aplicar regras diferentes para cada tenant
    4. **Controle via roles/policies no backend:**
        - O token é validado e passa a autorização fina para um serviço que decide com base no tenant + permissões salvas em banco
    
    > Em ambientes como bancos com múltiplos produtos PJ, essa abordagem permite garantir isolamento de dados e controle granular de acesso, com auditoria completa.
    > 

### 🧠 Dica extra: **Token introspection**

Em alguns casos, especialmente quando o token **não é um JWT**, mas sim um token opaco, o Resource Server precisa validar o token fazendo uma **chamada ao endpoint `/introspect`** do Authorization Server.

Isso é comum em ambientes OAuth tradicionais (ex: com Auth0 ou Keycloak), mas menos usado com JWTs self-contained, que são validados localmente.

---

## ✅ Resumo para entrevista

> “No fluxo server-to-server com OAuth 2.0, uso o Client Credentials Flow, onde o serviço consumidor autentica com client_id e client_secret e recebe um access token temporário. Esse token é incluído nas requisições para o serviço-alvo, que o valida localmente ou via introspecção. A chave é garantir controle de escopo, expiração, rotação segura de segredos, e logs auditáveis. Já apliquei isso com Cognito e também com Lambda Authorizer customizado em sistemas com múltiplos produtos e ambientes multi-conta.”
> 

