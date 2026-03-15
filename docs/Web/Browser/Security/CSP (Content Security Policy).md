docs/Web/Browser/Security/CSP (Content Security Policy).md

# CSP (Content Security Policy)

## O que é

CSP define de quais fontes scripts, estilos, imagens e conexões podem ser carregados/executados.

## Por que isso existe

Reduz superfície de XSS e supply-chain ao transformar execução de código em allowlist explícita.

## Como funciona internamente

1. Servidor envia header Content-Security-Policy.
2. Browser compara cada recurso com diretivas (script-src, connect-src etc.).
3. Recursos fora da política são bloqueados e logados.
4. Pode operar em Report-Only para validar antes de bloquear.

## Exemplo prático

```bash
curl -i https://example.com
```

```http
Content-Security-Policy: default-src "self"; script-src "self" https://cdn.exemplo.com; object-src "none"
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
- [[XSS]]
- [[Mixed Content]]
- [[HTTPS]]
