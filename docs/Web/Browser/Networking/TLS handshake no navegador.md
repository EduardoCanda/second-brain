docs/Web/Browser/Networking/TLS handshake no navegador.md

# TLS handshake no navegador

## O que é

O TLS handshake negocia parâmetros criptográficos e autentica o servidor antes do envio de dados HTTP.

## Por que isso existe

É a base prática do cadeado do navegador e da proteção contra MITM.

## Como funciona internamente

1. ClientHello anuncia versões, suites e ALPN.
2. ServerHello define parâmetros e envia certificado.
3. Browser valida cadeia, hostname e validade.
4. Após troca de chaves, tráfego da aplicação passa cifrado.

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
- [[HTTPS]]
- [[HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[Como o navegador abre uma conexão TCP]]
