docs/Web/Browser/Browser Storage/LocalStorage.md

# LocalStorage

## O que é

LocalStorage armazena pares chave/valor persistentes por origem, com API síncrona.

## Por que isso existe

É simples para preferências e flags locais sem necessidade de backend.

## Como funciona internamente

1. Dados ficam vinculados à origem.
2. Leitura/escrita é síncrona e pode bloquear a thread principal.
3. Capacidade é limitada e varia por navegador.
4. Não possui indexação ou transações avançadas.

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
- [[SessionStorage]]
- [[IndexedDB]]
- [[Cookies]]
