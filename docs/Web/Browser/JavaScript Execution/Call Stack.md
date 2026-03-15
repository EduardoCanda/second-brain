docs/Web/Browser/JavaScript Execution/Call Stack.md

# Call Stack

## O que é

Call Stack é a pilha de execução de funções JavaScript ativas naquele instante.

## Por que isso existe

Ela explica erros de recursão, travamentos da UI e ordem de execução síncrona.

## Como funciona internamente

1. Cada chamada empilha um frame.
2. Retornos desempilham frames na ordem LIFO.
3. Loops/recursão profunda podem estourar limite da stack.
4. Enquanto stack não esvazia, render e outros callbacks aguardam.

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
- [[Event Loop]]
- [[Task Queue]]
- [[Promises no navegador]]
