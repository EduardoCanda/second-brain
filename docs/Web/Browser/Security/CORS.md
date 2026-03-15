docs/Web/Browser/Security/CORS.md

# CORS

## O que é

CORS controla quando um script em uma origem pode ler respostas de outra origem. O bloqueio é no navegador: o servidor pode responder 200 e ainda assim o JS não receber os dados.

## Por que isso existe

Sem CORS, qualquer site conseguiria ler APIs autenticadas abertas no navegador do usuário, quebrando o isolamento de origem.

## Como funciona internamente

1. O browser envia a requisição com header Origin.
2. Para métodos/headers não simples, dispara preflight OPTIONS com Access-Control-Request-*.
3. O servidor responde com Access-Control-Allow-*; se incompatível, a resposta é bloqueada para o JS.
4. Credenciais (cookies/Authorization) exigem configuração explícita e nunca combinam com origem * .

## Exemplo prático

```bash
curl -i -X OPTIONS https://api.exemplo.com/orders \
  -H 'Origin: https://app.exemplo.com' \
  -H 'Access-Control-Request-Method: POST'
```

```http
Access-Control-Allow-Origin: https://app.exemplo.com
Access-Control-Allow-Methods: GET,POST
Vary: Origin
```

## Quando isso é importante para backend/devops

- Facilita a análise de incidentes sem depender apenas de hipótese no servidor.
- Ajuda a escolher headers, timeouts, políticas de cache e segurança mais coerentes.
- Melhora correlação entre DevTools, logs de aplicação e métricas de infraestrutura.

## Problemas comuns

- Interpretar sintomas de frontend sem validar o que o navegador decidiu internamente.
- Confiar apenas no status HTTP e ignorar headers/políticas que bloqueiam uso da resposta.
- Não reproduzir o cenário real (CDN, proxy, HTTPS, cache quente/frio).

## Relação com outros conceitos

Relaciona-se com:
- [[Same Origin Policy]]
- [[CSRF]]
- [[Como debugar problemas de CORS]]
