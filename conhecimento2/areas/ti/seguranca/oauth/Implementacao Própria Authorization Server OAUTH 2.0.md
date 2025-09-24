---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
como eu implemento meu próprio authorization server, como a aplicação cliente vai se comunicar com ele?

# Implementando seu Próprio Authorization Server OAuth 2.0

Vou guiá-lo passo a passo na implementação de um Authorization Server e na integração com um Client (aplicação cliente), com exemplos práticos:

## Componentes Necessários

1. **Authorization Server**: Seu servidor que emitirá tokens
2. **Resource Server**: API que protege os dados (pode ser o mesmo servidor)
3. **Client**: Aplicação que quer acessar os recursos
4. **Database**: Para armazenar clients registrados, tokens, etc.

## Passo 1: Configuração Básica do Authorization Server

### Endpoints Obrigatórios:
- `/authorize` - Para iniciar fluxo de autorização
- `/token` - Para trocar códigos por tokens
- (Opcional) `/userinfo` - Para OpenID Connect

### Exemplo em Node.js (usando `oauth2-server`):

```javascript
const OAuth2Server = require('oauth2-server');
const { Request, Response } = OAuth2Server;

const oauth = new OAuth2Server({
  model: require('./model.js'), // Seu modelo com lógica de negócio
  allowBearerTokensInQueryString: true,
  accessTokenLifetime: 4 * 60 * 60 // 4 horas
});

// Endpoint /authorize
app.get('/authorize', (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  
  return oauth.authorize(request, response)
    .then(() => res.json(response))
    .catch(err => res.status(500).json(err));
});

// Endpoint /token
app.post('/token', (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  
  return oauth.token(request, response)
    .then(() => res.json(response))
    .catch(err => res.status(500).json(err));
});
```

## Passo 2: Modelo Básico (model.js)

```javascript
module.exports = {
  // Valida um client registrado
  getClient: async (clientId, clientSecret) => {
    const client = await db.clients.findOne({ 
      where: { clientId, clientSecret } 
    });
    return {
      clientId: client.id,
      grants: ['authorization_code', 'refresh_token'],
      redirectUris: [client.redirectUri]
    };
  },

  // Salva o token gerado
  saveToken: async (token, client, user) => {
    token.client = client;
    token.user = user;
    await db.tokens.create(token);
    return token;
  },

  // Busca um token existente
  getAccessToken: async (accessToken) => {
    return await db.tokens.findOne({ 
      where: { accessToken } 
    });
  }
};
```

## Passo 3: Registrar um Client

Antes de usar, você precisa registrar o client no seu Authorization Server:

```javascript
// Exemplo de registro de client no banco de dados
await db.clients.create({
  clientId: 'meu-app-mobile',
  clientSecret: 'segredo-super-seguro-123',
  redirectUri: 'com.meuapp://oauth/callback',
  grants: ['authorization_code', 'refresh_token']
});
```

## Passo 4: Como o Client se Comunica

### Fluxo Authorization Code (recomendado):

1. **Client redireciona usuário**:
   ```
   GET /authorize?
     response_type=code
     &client_id=meu-app-mobile
     &redirect_uri=com.meuapp://oauth/callback
     &scope=read write
     &state=xyz123
   ```

2. **Authorization Server**:
   - Autentica o usuário (se não estiver logado)
   - Mostra tela de consentimento ("O app X quer acessar Y")
   - Redireciona de volta com código:
     ```
     com.meuapp://oauth/callback?code=AUTH_CODE&state=xyz123
     ```

3. **Client troca código por token**:
   ```javascript
   POST /token
   Headers: {
     'Content-Type': 'application/x-www-form-urlencoded',
     'Authorization': 'Basic ' + btoa('client_id:client_secret')
   }
   Body: {
     grant_type: 'authorization_code',
     code: 'AUTH_CODE',
     redirect_uri: 'com.meuapp://oauth/callback'
   }
   ```

4. **Authorization Server responde**:
   ```json
   {
     "access_token": "eyJhbGciOi...",
     "refresh_token": "eyJhbGciOi...",
     "expires_in": 3600,
     "token_type": "Bearer"
   }
   ```

## Passo 5: Protegendo APIs (Resource Server)

```javascript
// Middleware de verificação de token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  try {
    const tokenData = await db.tokens.findOne({ 
      where: { accessToken: token } 
    });
    if (!tokenData) return res.sendStatus(403);
    
    req.user = tokenData.user;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

// Rota protegida
app.get('/api/protegida', authenticateToken, (req, res) => {
  res.json({ message: 'Dados sensíveis!' });
});
```

## Configurações Importantes

1. **Segurança**:
   - Sempre use HTTPS
   - Valide strictamente redirect_uri
   - Implemente PKCE para clients públicos
   - Rotacione client secrets periodicamente

2. **Boas Práticas**:
   - Token expiration curto (1-6 horas)
   - Scope-based access control
   - Revogação de tokens
   - Logs de auditoria

## Bibliotecas Recomendadas

| Linguagem | Biblioteca Popular       |
|-----------|--------------------------|
| Node.js   | oauth2-server, node-oauth2-jwt-bearer |
| Java      | Spring Security OAuth     |
| Python    | authlib, django-oauth-toolkit |
| .NET      | IdentityServer4           |
| Ruby      | doorkeeper                |

## Exemplo Completo de Fluxo

1. **Client Registration**:
   - Você registra seu app no Auth Server obtendo client_id e client_secret

2. **Authorization Request**:
```http
GET /authorize?
response_type=code
&client_id=meu-app
&redirect_uri=https://app.com/callback
&scope=profile%20email
&state=abc123
&code_challenge=XYZ987
&code_challenge_method=S256
```

3. **Token Request**:
```http
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=CODE_RECEBIDO
&redirect_uri=https://app.com/callback
&client_id=meu-app
&code_verifier=VERIFIER_ORIGINAL
```

4. **API Access**:
```http
GET /api/userinfo
Authorization: Bearer eyJhbGciOi...
```

Implementar um Authorization Server completo requer atenção especial à segurança. Para produção, considere soluções maduras como Keycloak, Okta ou Auth0, a menos que tenha requisitos específicos que justifiquem uma implementação customizada.