docs/Web/Browser/Browser Storage/IndexedDB.md

# IndexedDB

## O que é

IndexedDB é banco NoSQL no navegador, assíncrono e orientado a objetos, com suporte a índices e transações.

## Por que isso existe

Permite armazenar grandes volumes offline sem bloquear thread principal.

## Como funciona internamente

1. Aplicação abre database/versionamento.
2. Object stores e índices organizam os dados.
3. Operações rodam em transações atômicas.
4. Uso comum: sync offline, cache de API e filas locais.

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
- [[Cache Storage]]
- [[LocalStorage]]
- [[Service Workers e Cache]]
