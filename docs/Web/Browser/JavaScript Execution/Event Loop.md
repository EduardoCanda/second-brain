docs/Web/Browser/JavaScript Execution/Event Loop.md

# Event Loop

## O que é

Event Loop coordena execução de callbacks, render e tarefas assíncronas na thread principal do navegador.

## Por que isso existe

Sem esse modelo, scripts longos bloqueariam UI sem previsibilidade de ordem e prioridade.

## Como funciona internamente

1. Código síncrono entra no Call Stack.
2. Tarefas assíncronas são agendadas em filas (task/microtask).
3. Microtasks drenam antes do próximo frame.
4. Render ocorre entre ciclos quando a thread está livre.

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
- [[Call Stack]]
- [[Task Queue]]
- [[Microtask Queue]]
