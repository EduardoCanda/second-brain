docs/Web/Browser/Security/HTTPS.md

# HTTPS

## O que é

HTTPS é HTTP encapsulado em TLS, garantindo confidencialidade, integridade e autenticação do servidor.

## Por que isso existe

Sem criptografia, tráfego pode ser lido/alterado por proxies, redes públicas e atacantes man-in-the-middle.

## Como funciona internamente

1. Cliente inicia handshake TLS e valida certificado.
2. Chaves de sessão são negociadas com criptografia assimétrica.
3. Após handshake, HTTP trafega criptografado.
4. HSTS e ALPN reforçam segurança e escolha de protocolo.

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
- [[TLS handshake no navegador]]
- [[HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[Mixed Content]]
