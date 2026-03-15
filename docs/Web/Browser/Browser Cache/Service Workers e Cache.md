docs/Web/Browser/Browser Cache/Service Workers e Cache.md

# Service Workers e Cache

## O que é

Service Worker é um worker em segundo plano que intercepta requests e permite experiências offline e caching avançado.

## Por que isso existe

Desacopla estratégia de entrega da navegação tradicional, útil para PWAs e resiliência de rede.

## Como funciona internamente

1. Script é registrado e instalado pela página.
2. No evento activate, versões antigas podem ser limpas.
3. No fetch, lógica decide entre cache e rede.
4. Atualizações são transacionais e controladas por ciclo de vida próprio.

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
- [[Cache Storage]]
- [[HTTP Cache]]
- [[IndexedDB]]
