docs/Web/Browser/Browser Storage/SessionStorage.md

# SessionStorage

## O que é

SessionStorage armazena dados por origem e por aba/janela durante a sessão corrente.

## Por que isso existe

Útil para estado temporário que não deve sobreviver ao fechamento da aba.

## Como funciona internamente

1. Criado ao abrir contexto de navegação.
2. Escopo isolado por aba, mesmo na mesma origem.
3. API síncrona similar ao LocalStorage.
4. Dados são limpos ao encerrar a aba.

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
- [[LocalStorage]]
- [[IndexedDB]]
- [[Cookies]]
