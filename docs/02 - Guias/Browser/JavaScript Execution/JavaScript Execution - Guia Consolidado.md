---
aliases:
  - "Call Stack"
  - "Event Loop"
  - "Microtask Queue"
  - "Promises no navegador"
  - "Task Queue"
  - "Web APIs"
---

# JavaScript Execution — Guia Consolidado

Esta nota agrupa os tópicos de **JavaScript Execution** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [[#Call Stack|Call Stack]]
- [[#Event Loop|Event Loop]]
- [[#Microtask Queue|Microtask Queue]]
- [[#Promises no navegador|Promises no navegador]]
- [[#Task Queue|Task Queue]]
- [[#Web APIs|Web APIs]]

---

## Call Stack

### O que é

Call Stack é a pilha de execução de funções JavaScript ativas naquele instante.

### Por que isso existe

Ela explica erros de recursão, travamentos da UI e ordem de execução síncrona.

### Como funciona internamente

1. Cada chamada empilha um frame.
2. Retornos desempilham frames na ordem LIFO.
3. Loops/recursão profunda podem estourar limite da stack.
4. Enquanto stack não esvazia, render e outros callbacks aguardam.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Event Loop]]
- [[Task Queue]]
- [[Promises no navegador]]

## Event Loop

### O que é

Event Loop coordena execução de callbacks, render e tarefas assíncronas na thread principal do navegador.

### Por que isso existe

Sem esse modelo, scripts longos bloqueariam UI sem previsibilidade de ordem e prioridade.

### Como funciona internamente

1. Código síncrono entra no Call Stack.
2. Tarefas assíncronas são agendadas em filas (task/microtask).
3. Microtasks drenam antes do próximo frame.
4. Render ocorre entre ciclos quando a thread está livre.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Call Stack]]
- [[Task Queue]]
- [[Microtask Queue]]

## Microtask Queue

### O que é

Task Queue recebe macrotasks como timers, eventos de UI e callbacks de rede.

### Por que isso existe

Separa trabalho futuro da execução imediata e evita bloquear o fluxo síncrono.

### Como funciona internamente

1. Eventos assíncronos entram na fila de tasks.
2. Event Loop pega uma task quando stack está vazia.
3. Após cada task, microtasks são drenadas.
4. Somente então browser considera renderizar novo frame.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Event Loop]]
- [[Microtask Queue]]
- [[Web APIs]]

## Promises no navegador

### O que é

Promises representam valores assíncronos e padronizam composição de operações no navegador.

### Por que isso existe

Substituem cascatas de callbacks e integram com microtasks para previsibilidade.

### Como funciona internamente

1. Promise inicia pendente.
2. Resolve/reject agenda handlers no microtask queue.
3. then/catch encadeiam transformações e tratamento de erro.
4. async/await é açúcar sintático sobre promises.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Microtask Queue]]
- [[Event Loop]]
- [[Web APIs]]

## Task Queue

### O que é

Task Queue recebe macrotasks como timers, eventos de UI e callbacks de rede.

### Por que isso existe

Separa trabalho futuro da execução imediata e evita bloquear o fluxo síncrono.

### Como funciona internamente

1. Eventos assíncronos entram na fila de tasks.
2. Event Loop pega uma task quando stack está vazia.
3. Após cada task, microtasks são drenadas.
4. Somente então browser considera renderizar novo frame.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Event Loop]]
- [[Microtask Queue]]
- [[Web APIs]]

## Web APIs

### O que é

Web APIs são interfaces do navegador (fetch, timers, DOM, storage) fora do motor JS puro.

### Por que isso existe

Permitem que JS interaja com rede, interface e sistema sem bloquear a linguagem.

### Como funciona internamente

1. JS chama uma API do navegador.
2. A implementação ocorre em subsistemas nativos.
3. Quando termina, callback/promise retorna via filas do event loop.
4. Permissões e políticas de segurança definem o que é permitido.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Event Loop]]
- [[Browser JavaScript Engine]]
- [[Como o navegador resolve DNS]]

## Pontos comuns da família (backend/devops)

- Crítico para bugs de ordem de execução, starvation de fila e travamentos de interface.
- Explica impacto de promises/microtasks/timers na responsividade e no ciclo de render.
- Ajuda a reduzir long tasks e melhorar métricas de interação em produção.

## Problemas comuns da família

- Assumir fluxo linear em código assíncrono e ignorar prioridade entre filas.
- Superlotar microtasks/callbacks e bloquear render sem perceber.
- Depurar apenas pelo resultado final sem mapear a sequência de agendamento/executação.
