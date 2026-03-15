docs/Web/Browser/Debugging/Como debugar problemas de CORS.md

# Como debugar problemas de CORS

## O que é

Um guia prático para diagnosticar falhas de CORS olhando a troca real entre navegador e servidor (preflight + request final), em vez de confiar só na mensagem do console.

## Por que isso existe

Erros de CORS costumam mascarar problemas diferentes (origem errada, headers ausentes, credenciais incompatíveis), e sem inspeção detalhada é fácil corrigir o ponto errado.

## Como funciona internamente

1. Abra DevTools > Network e habilite **Preserve log**.
2. Reproduza a chamada e localize primeiro a request **OPTIONS** (preflight), depois a request real.
3. Compare `Origin`, `Access-Control-Request-Method` e `Access-Control-Request-Headers` enviados pelo navegador.
4. Valide se a resposta devolve `Access-Control-Allow-*` compatível e `Vary: Origin` quando aplicável.

## Exemplo prático

```bash
curl -i -X OPTIONS https://api.exemplo.com/orders \
  -H 'Origin: https://app.exemplo.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: authorization,content-type'
```

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.exemplo.com
Access-Control-Allow-Methods: GET,POST,PUT,DELETE
Access-Control-Allow-Headers: authorization,content-type
Access-Control-Allow-Credentials: true
Vary: Origin
```

## Quando isso é importante para backend/devops

- Evita incidentes de produção causados por configuração incorreta em API Gateway, Nginx, CDN ou WAF.
- Ajuda a separar erro de aplicação de erro de política de navegador.
- Melhora tempo de resposta em incidentes frontend/backend compartilhados.

## Problemas comuns

- Liberar `Access-Control-Allow-Origin: *` junto com credenciais (inválido no navegador).
- Esquecer de responder `OPTIONS` na rota ou no proxy reverso.
- Cachear resposta CORS sem `Vary: Origin`, misturando políticas entre clientes.

## Relação com outros conceitos

Relaciona-se com:
- [[CORS]]
- [[Same Origin Policy]]
- [[Como usar DevTools Network Tab]]
- [[HTTP request lifecycle no navegador]]
