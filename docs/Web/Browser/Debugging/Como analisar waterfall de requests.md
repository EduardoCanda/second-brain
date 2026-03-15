docs/Web/Browser/Debugging/Como analisar waterfall de requests.md

# Como analisar waterfall de requests

## O que é

Waterfall organiza requests no tempo para evidenciar dependências, bloqueios e paralelismo do carregamento.

## Por que isso existe

Ajuda a encontrar cadeia crítica que aumenta LCP/TTI e incidentes de lentidão percebida.

## Como funciona internamente

1. Ordene por start time para ver sequência real.
2. Identifique recursos que bloqueiam render (CSS/JS síncronos).
3. Observe gaps entre etapas de rede e espera no servidor.
4. Cruze com tracing backend para localizar gargalo exato.

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
- [[Como usar DevTools Network Tab]]
- [[Critical Rendering Path]]
- [[Preload]]
