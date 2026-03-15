docs/Web/Browser/Page Loading/Critical Rendering Path.md

# Critical Rendering Path

## O que é

Critical Rendering Path é a sequência mínima para transformar HTML/CSS/JS em pixels na tela.

## Por que isso existe

É onde nascem métricas de UX como FCP e LCP.

## Como funciona internamente

1. Browser parseia HTML e constrói DOM.
2. CSS gera CSSOM e pode bloquear render.
3. DOM + CSSOM formam Render Tree para layout e paint.
4. JS síncrono pode pausar parsing e atrasar primeira pintura.

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
- [[HTML Parsing]]
- [[CSSOM]]
- [[Layout (Reflow)]]
