docs/Web/Browser/Security/Same Origin Policy.md

# Same Origin Policy

## O que é

Same Origin Policy (SOP) é a regra-base que impede scripts de uma origem de acessar dados sensíveis de outra origem.

## Por que isso existe

Ela limita impacto de sites maliciosos e força autorização explícita para compartilhamento entre domínios.

## Como funciona internamente

1. Origem = esquema + host + porta.
2. Leitura de DOM, LocalStorage e respostas XHR/fetch é restrita por origem.
3. Alguns recursos podem ser carregados cross-origin (img/script), mas não necessariamente lidos.
4. Mecanismos como CORS, postMessage e COOP/COEP criam exceções controladas.

## Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
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
- [[CORS]]
- [[CSRF]]
- [[Cookies]]
