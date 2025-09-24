---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
# Validação de Tokens no Resource Server: Online vs Offline

Você fez uma ótima observação! A validação do token é um ponto crucial na arquitetura OAuth. Vamos esclarecer como isso funciona na prática:

## Os Dois Modelos de Validação

### 1. Validação Online (Introspection)
- **Como funciona**: O Resource Server consulta o Authorization Server para cada requisição
- **Endpoint**: `/introspect` ou `/tokeninfo`
- **Vantagens**:
  - Revogação imediata de tokens
  - Sem problemas com expiração/relógios dessincronizados
- **Desvantagens**:
  - Latência adicional
  - Ponto único de falha
  - Maior carga no Authorization Server

**Exemplo de chamada**:
```http
POST /introspect
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta**:
```json
{
  "active": true,
  "scope": "api:read",
  "client_id": "meu-servico-backend",
  "exp": 1625097600
}
```

### 2. Validação Offline (JWT Auto-contido)
- **Como funciona**: O Resource Server valida localmente a assinatura do token
- **Requisitos**:
  - Tokens no formato JWT
  - Chaves públicas disponíveis (JWKS endpoint)
- **Vantagens**:
  - Sem dependência do Authorization Server
  - Mais rápido (sem chamadas de rede)
  - Escalabilidade melhor
- **Desvantagens**:
  - Revogação mais complexa (precisa de blacklist)
  - Problemas com expiração se relógios estiverem dessincronizados

**Exemplo de validação**:
```javascript
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

const client = jwksClient({
  jwksUri: 'https://auth.seudominio.com/.well-known/jwks.json'
});

function verifyToken(token) {
  const decoded = jwt.decode(token, { complete: true });
  const kid = decoded.header.kid;
  
  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey();
  
  return jwt.verify(token, signingKey, {
    algorithms: ['RS256'],
    audience: 'api-resource',
    issuer: 'https://auth.seudominio.com'
  });
}
```

## Quando Usar Cada Abordagem?

| Cenário                          | Melhor Abordagem  | Por quê?                          |
|----------------------------------|-------------------|-----------------------------------|
| APIs críticas de segurança       | Online            | Revogação imediata                |
| Microsserviços internos          | Offline           | Performance e resiliência         |
| Tokens de vida muito curta       | Offline           | Revogação implícita pela expiração|
| Sistemas com pouca conectividade | Offline           | Funciona sem rede                 |
| Compliance rigoroso (PCI DSS)    | Online            | Auditoria em tempo real           |

## Implementação Híbrida (Melhor dos Dois Mundos)

Muitos sistemas modernos usam uma abordagem mista:

1. **Validação offline inicial**:
   - Verifica assinatura JWT localmente
   - Checa expiração básica

2. **Cache de tokens válidos**:
   - Cache local por 1-5 minutos
   - Evita chamadas repetidas ao Auth Server

3. **Verificação online periódica**:
   - Para operações sensíveis
   - Quando o token está perto de expirar

**Exemplo**:
```javascript
async function validateTokenWithCache(token) {
  // Verificação offline rápida
  const decoded = verifyOffline(token); 
  
  // Verifica cache local
  if (tokenCache.isValid(token)) {
    return decoded;
  }
  
  // Verificação online completa
  const introspection = await verifyOnline(token);
  
  // Atualiza cache
  tokenCache.add(token, introspection.exp);
  
  return decoded;
}
```

## Fluxo de Revogação em Sistemas Offline

Para resolver o problema da revogação em validação offline:

1. **Lista de revogação distribuída (OCSP Stapling)**:
   - Listas assinadas periodicamente
   - Atualizadas a cada X minutos

2. **Tempo de vida curto (Short-Lived Tokens)**:
   - Tokens expiram em 5-15 minutos
   - Client obtém novo token quando necessário

3. **Eventos de revogação em broadcast**:
   - Sistemas como Redis Pub/Sub
   - Notificações em tempo real

## Exemplo de JWKS Endpoint

O Authorization Server deve fornecer chaves públicas:

```http
GET /.well-known/jwks.json
```

**Resposta**:
```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "2023-06",
      "n": "x9H3z...",
      "e": "AQAB",
      "alg": "RS256"
    }
  ]
}
```

## Conclusão: Qual Usar?

- **Para maioria dos casos**: Validação offline com JWT + JWKS é suficiente
- **Para sistemas críticos**: Adicione verificação online periódica
- **Balanceamento**: Quanto mais offline, melhor a performance mas menor o controle

A escolha depende do seu nível de tolerância a risco versus necessidade de performance. Sistemas modernos frequentemente usam JWT com validação offline complementada por mecanismos de revogação assíncronos quando necessário.