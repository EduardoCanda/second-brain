docs/Web/Browser/JavaScript Execution/Web APIs.md

# Web APIs

## O que é

Web APIs são interfaces do navegador (fetch, timers, DOM, storage) fora do motor JS puro.

## Por que isso existe

Permitem que JS interaja com rede, interface e sistema sem bloquear a linguagem.

## Como funciona internamente

1. JS chama uma API do navegador.
2. A implementação ocorre em subsistemas nativos.
3. Quando termina, callback/promise retorna via filas do event loop.
4. Permissões e políticas de segurança definem o que é permitido.

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
- [[Browser JavaScript Engine]]
- [[Como o navegador resolve DNS]]
