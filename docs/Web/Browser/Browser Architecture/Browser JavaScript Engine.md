docs/Web/Browser/Browser Architecture/Browser JavaScript Engine.md

# Browser JavaScript Engine

## O que é

A JavaScript engine compila e executa JS (parser, bytecode, JIT, GC) dentro do navegador.

## Por que isso existe

Desempenho da engine impacta interação, hidratação e custo de scripts pesados.

## Como funciona internamente

1. O navegador avalia contexto da página (origem, tipo de recurso e prioridade).
2. A engine aplica regras do protocolo/política correspondente.
3. A decisão impacta rede, execução de JavaScript e renderização.
4. O resultado fica visível em headers, DevTools e métricas de performance.

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
- [[Event Loop]]
- [[Web APIs]]
- [[Browser Rendering Engine]]
