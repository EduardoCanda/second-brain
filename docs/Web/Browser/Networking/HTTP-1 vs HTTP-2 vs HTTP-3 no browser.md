docs/Web/Browser/Networking/HTTP-1 vs HTTP-2 vs HTTP-3 no browser.md

# HTTP-1 vs HTTP-2 vs HTTP-3 no browser

## O que é

Cada versão do HTTP muda forma de transporte, multiplexação e recuperação de perda, impactando latência real no navegador.

## Por que isso existe

Escolher protocolo certo influencia TTFB, head-of-line blocking e custo de infraestrutura.

## Como funciona internamente

1. HTTP/1.1 usa texto e paralelismo limitado por conexão.
2. HTTP/2 multiplexa streams sobre TCP com compressão de headers.
3. HTTP/3 usa QUIC/UDP para reduzir HOL no transporte e acelerar retomadas.
4. Navegador negocia versão via ALPN/Alt-Svc.

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
- [[TLS handshake no navegador]]
- [[Connection pooling]]
- [[Como analisar waterfall de requests]]
