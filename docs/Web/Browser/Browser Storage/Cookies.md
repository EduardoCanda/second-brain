docs/Web/Browser/Browser Storage/Cookies.md

# Cookies

## O que é

Cookies são pequenos pares chave/valor enviados automaticamente pelo navegador em requests para o domínio correspondente.

## Por que isso existe

São base de autenticação de sessão e preferências compartilhadas entre cliente e servidor.

## Como funciona internamente

1. Servidor envia Set-Cookie com atributos.
2. Browser salva e reenvia conforme domínio/caminho/expiração.
3. Flags HttpOnly, Secure e SameSite alteram segurança e exposição.
4. Excesso de cookies aumenta tamanho de request e latência.

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
- [[CSRF]]
- [[Same Origin Policy]]
- [[HTTP request lifecycle no navegador]]
