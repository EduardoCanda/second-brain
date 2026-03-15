docs/Web/Browser/Browser Cache/Cache-Control.md

# Cache-Control

## O que é

Cache-Control define políticas de cache para browser, proxies e CDNs.

## Por que isso existe

Sem diretivas claras, cada camada aplica heurísticas diferentes e gera inconsistência.

## Como funciona internamente

1. Servidor envia diretivas (max-age, no-store, public/private).
2. Browser decide frescor sem contato com origem enquanto válido.
3. Com must-revalidate/stale-* ajusta comportamento sob erro/latência.
4. Diretivas interagem com ETag/Last-Modified para revalidação.

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
- [[HTTP Cache]]
- [[ETag]]
- [[Como debugar problemas de cache]]
