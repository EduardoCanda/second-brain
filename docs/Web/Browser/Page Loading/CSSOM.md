docs/Web/Browser/Page Loading/CSSOM.md

# CSSOM

## O que é

CSSOM é a representação em memória das regras CSS aplicáveis ao documento.

## Por que isso existe

Sem CSSOM completo, browser não consegue calcular estilos finais e avançar para render tree.

## Como funciona internamente

1. CSS é baixado e parseado em regras.
2. Regras são combinadas com especificidade/cascata/herança.
3. Media queries e pseudo-classes alteram regras ativas.
4. Resultado participa do cálculo de estilo por nó DOM.

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
- [[Layout (Reflow)]]
- [[Critical Rendering Path]]
