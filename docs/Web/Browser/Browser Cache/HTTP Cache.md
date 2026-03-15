docs/Web/Browser/Browser Cache/HTTP Cache.md

# HTTP Cache

## O que é

HTTP Cache é o mecanismo automático do navegador para reutilizar respostas baseado em headers de cache.

## Por que isso existe

Reduz latência, consumo de banda e carga no backend em recursos repetidos.

## Como funciona internamente

1. Resposta chega com Cache-Control/ETag/Last-Modified.
2. Browser calcula freshness e elegibilidade por método/status.
3. Se stale, pode revalidar com If-None-Match/If-Modified-Since.
4. 304 mantém corpo local e atualiza metadados.

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
- [[Cache-Control]]
- [[ETag]]
- [[Como debugar problemas de cache]]
