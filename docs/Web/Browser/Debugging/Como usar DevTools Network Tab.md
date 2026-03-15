docs/Web/Browser/Debugging/Como usar DevTools Network Tab.md

# Como usar DevTools Network Tab

## O que é

A aba Network mostra cada request do navegador com tempos, headers, payloads e prioridade.

## Por que isso existe

É a ferramenta principal para separar problema de frontend, rede, CDN, proxy ou backend.

## Como funciona internamente

1. Abra DevTools e recarregue com cache desabilitado.
2. Use filtros por tipo, domínio e status.
3. Inspecione timing (DNS, connect, SSL, TTFB, download).
4. Compare headers de request/resposta e flags de cache.

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
- [[Como analisar waterfall de requests]]
- [[Como debugar problemas de CORS]]
- [[HTTP request lifecycle no navegador]]
