docs/Web/Browser/JavaScript Execution/Promises no navegador.md

# Promises no navegador

## O que é

Promises representam valores assíncronos e padronizam composição de operações no navegador.

## Por que isso existe

Substituem cascatas de callbacks e integram com microtasks para previsibilidade.

## Como funciona internamente

1. Promise inicia pendente.
2. Resolve/reject agenda handlers no microtask queue.
3. then/catch encadeiam transformações e tratamento de erro.
4. async/await é açúcar sintático sobre promises.

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
- [[Microtask Queue]]
- [[Event Loop]]
- [[Web APIs]]
