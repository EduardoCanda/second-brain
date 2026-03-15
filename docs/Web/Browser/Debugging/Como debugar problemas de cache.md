docs/Web/Browser/Debugging/Como debugar problemas de cache.md

# Como debugar problemas de cache

## O que é

Debugar cache no navegador exige validar chaves de cache, headers e comportamento de Service Worker/CDN.

## Por que isso existe

Muitos bugs de “funciona em uma máquina” são versões antigas servidas por camadas diferentes de cache.

## Como funciona internamente

1. Reproduza com hard reload e cache desabilitado.
2. Cheque Cache-Control, ETag, Age e Vary.
3. Verifique se Service Worker intercepta a rota.
4. Compare resposta no browser com curl para isolar camada.

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
- [[HTTP Cache]]
- [[Cache-Control]]
- [[Service Workers e Cache]]
