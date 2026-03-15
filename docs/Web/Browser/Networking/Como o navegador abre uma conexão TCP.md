docs/Web/Browser/Networking/Como o navegador abre uma conexão TCP.md

# Como o navegador abre uma conexão TCP

## O que é

A conexão TCP estabelece um canal confiável entre navegador e servidor para troca de bytes HTTP/1.1 e HTTP/2 sobre TLS.

## Por que isso existe

Fornece ordenação, retransmissão e controle de congestionamento, reduzindo perdas e corrupção de dados na Internet.

## Como funciona internamente

1. Cliente escolhe IP/porta de destino.
2. Executa 3-way handshake (SYN, SYN-ACK, ACK).
3. Com TLS, handshake criptográfico ocorre em seguida.
4. A conexão entra no pool para reutilização quando possível.

## Exemplo prático

```bash
ss -tnp | head
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
- [[Keep Alive]]
- [[Connection pooling]]
- [[TLS handshake no navegador]]
