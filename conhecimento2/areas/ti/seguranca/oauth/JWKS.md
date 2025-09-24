---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
**JWKS** significa **JSON Web Key Set**, que é um conjunto de chaves públicas usadas para verificar tokens JWT (JSON Web Tokens) assinados, como os tokens **JWS (JSON Web Signature)** ou **JWE (JSON Web Encryption)**.

### **O que é um JWKS?**
- É um formato padrão (**RFC 7517**) que define uma estrutura JSON contendo uma ou mais chaves públicas (JWK - **JSON Web Key**).
- Essas chaves são usadas por sistemas para validar a assinatura de tokens JWT, garantindo sua autenticidade.

### **Estrutura de um JWKS**
Um exemplo de JWKS:
```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "12345",
      "alg": "RS256",
      "n": "modulus_value",
      "e": "exponent_value"
    }
  ]
}
```
#### **Campos importantes:**
- **`kty`**: Tipo da chave (ex: `RSA`, `EC`, `oct`).
- **`use`**: Finalidade (`sig` para assinatura, `enc` para criptografia).
- **`kid`**: Identificador único da chave (usado para selecionar a chave correta).
- **`alg`**: Algoritmo usado (ex: `RS256`, `ES256`).
- **`n` e `e`**: Parâmetros da chave RSA (modulus e exponent).

### **Para que serve o JWKS?**
- **Autenticação OAuth/OIDC**: Serviços como Auth0, AWS Cognito e Keycloak disponibilizam um endpoint JWKS (`/.well-known/jwks.json`) para validar tokens JWT.
- **Microserviços**: Sistemas distribuídos usam JWKS para verificar tokens sem compartilhar segredos privados.
- **Assinatura digital**: Garante que um JWT não foi alterado.

### **Como funciona?**
1. Um serviço emite um JWT assinado com uma chave privada.
2. O cliente envia o JWT para um serviço que precisa validá-lo.
3. O serviço busca a chave pública correspondente no JWKS (usando o `kid` do token).
4. A validação é feita usando a chave pública.

### **Exemplo de Uso**
Se você estiver usando um JWT RS256, o servidor buscará a chave pública no JWKS para verificar a assinatura, sem precisar da chave privada.

#### **Endpoint JWKS comum**
Muitos provedores de identidade expõem um endpoint como:
```
https://seu-dominio/.well-known/jwks.json
```

### **Conclusão**
O JWKS é essencial para sistemas que usam JWT, permitindo a validação segura de tokens usando chaves públicas. Ele evita a necessidade de compartilhar chaves privadas, melhorando a segurança.

Precisa de mais detalhes ou exemplos práticos? Posso ajudar!