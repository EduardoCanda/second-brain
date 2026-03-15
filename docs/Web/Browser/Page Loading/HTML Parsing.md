docs/Web/Browser/Page Loading/HTML Parsing.md

# HTML Parsing

## O que é

HTML Parsing converte bytes do documento em nós DOM seguindo regras tolerantes a erro do HTML5.

## Por que isso existe

Define ordem de descoberta de recursos e o momento em que scripts podem bloquear parsing.

## Como funciona internamente

1. Tokenizer lê tokens HTML.
2. Tree builder monta DOM com algoritmo de inserção.
3. Scripts sem async/defer podem pausar parsing.
4. Pré-carregador paralelo tenta antecipar recursos externos.

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
- [[DOM Construction]]
- [[Critical Rendering Path]]
- [[Render Tree]]
