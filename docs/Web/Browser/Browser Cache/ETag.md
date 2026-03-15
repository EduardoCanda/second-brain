docs/Web/Browser/Browser Cache/ETag.md

# ETag

## O que é

ETag é um identificador de versão da resposta para revalidação condicional no cache do navegador.

## Por que isso existe

Evita baixar novamente recursos inalterados, economizando banda.

## Como funciona internamente

1. Servidor responde com ETag.
2. Browser envia If-None-Match em nova request.
3. Servidor compara versão e retorna 304 ou 200 com novo corpo.
4. ETag fraco/forte influencia sensibilidade a mudanças.

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
- [[Keep Alive]]
