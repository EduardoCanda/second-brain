docs/Web/Browser/Security/Mixed Content.md

# Mixed Content

## O que é

Mixed Content acontece quando página HTTPS tenta carregar recurso inseguro via HTTP.

## Por que isso existe

Evita que um atacante na rede injete ou altere recursos em uma sessão teoricamente protegida por TLS.

## Como funciona internamente

1. Documento principal é HTTPS.
2. Subrecursos HTTP são classificados como bloqueáveis ou passive display.
3. Browsers modernos bloqueiam ativo (scripts/iframes) e fazem upgrade automático quando possível.
4. Falhas aparecem no console e em auditorias de segurança.

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
- [[TLS handshake no navegador]]
- [[CSP (Content Security Policy)]]
