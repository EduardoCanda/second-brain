docs/Web/Browser/Page Loading/Layout (Reflow).md

# Layout (Reflow)

## O que é

Layout (reflow) calcula posição e dimensão dos elementos da render tree.

## Por que isso existe

Mudanças de layout frequentes custam caro e degradam fluidez da interface.

## Como funciona internamente

1. Browser percorre render tree e resolve box model.
2. Calcula tamanhos relativos, quebras de linha e posicionamento.
3. Mudanças em geometria invalidam nós e podem propagar reflow.
4. Resultados alimentam etapa de paint/composition.

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
- [[Render Tree]]
- [[Paint]]
- [[Composite]]
