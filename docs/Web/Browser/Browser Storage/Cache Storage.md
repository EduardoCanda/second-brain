docs/Web/Browser/Browser Storage/Cache Storage.md

# Cache Storage

## O que é

Cache Storage é a API usada por Service Workers para armazenar pares Request/Response controlados pela aplicação.

## Por que isso existe

Dá controle fino de estratégias offline além do cache HTTP tradicional.

## Como funciona internamente

1. Service Worker intercepta fetch.
2. Busca recurso no Cache Storage por chave de request.
3. Em cache miss, consulta rede e decide se armazena.
4. Estratégias comuns: cache-first, network-first, stale-while-revalidate.

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
- [[Service Workers e Cache]]
- [[HTTP Cache]]
- [[IndexedDB]]
