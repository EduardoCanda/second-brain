docs/Web/Browser/Security/CSRF.md

# CSRF

## O que é

CSRF explora o fato de o navegador enviar cookies automaticamente, fazendo o usuário autenticado executar ações sem intenção.

## Por que isso existe

A web tradicional usa cookies de sessão; sem proteção, formulários e requests forjados mudam estado do sistema.

## Como funciona internamente

1. Atacante hospeda página maliciosa com submit automático.
2. Navegador envia cookie da vítima para o domínio alvo.
3. Servidor aceita a ação por confiar apenas na sessão.
4. Defesas combinam token anti-CSRF, SameSite e validação de Origin/Referer.

## Exemplo prático

```bash
curl -i https://app.exemplo.com/transfer \
  -H 'Cookie: session=abc' \
  -H 'Origin: https://evil.site'
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
- [[Cookies]]
- [[Same Origin Policy]]
- [[CORS]]
