docs/Web/Browser/Networking/Keep Alive.md

# Keep Alive

## O que é

Keep-Alive mantém conexões abertas para reutilização, reduzindo handshakes e latência entre requests consecutivas.

## Por que isso existe

Abrir conexão nova para cada recurso aumenta RTT, CPU de TLS e risco de fila no servidor.

## Como funciona internamente

1. Servidor anuncia política de persistência da conexão.
2. Browser mantém socket ocioso por tempo limitado.
3. Novas requests elegíveis reutilizam a conexão.
4. Encerramento ocorre por timeout, limite de requests ou pressão de recursos.

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
- [[Connection pooling]]
- [[HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[Como o navegador abre uma conexão TCP]]
