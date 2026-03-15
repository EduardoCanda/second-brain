docs/Web/Browser/Security/XSS.md

# XSS

## O que é

XSS ocorre quando conteúdo controlado por usuário é interpretado como código JavaScript no navegador.

## Por que isso existe

A mistura entre dados e código em HTML/JS é comum; sem escaping e CSP, o browser executa payloads.

## Como funciona internamente

1. Entrada não sanitizada chega ao HTML/DOM.
2. O parser interpreta o payload como script/event handler.
3. Código roda com privilégios da origem legítima.
4. Impacto: roubo de sessão, ações em nome do usuário e exfiltração de dados.

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
- [[CSP (Content Security Policy)]]
- [[Cookies]]
- [[HTTPS]]
