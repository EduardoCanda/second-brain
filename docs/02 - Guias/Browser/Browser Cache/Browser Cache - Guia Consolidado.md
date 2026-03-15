---
aliases:
  - "Cache-Control"
  - "ETag"
  - "HTTP Cache"
  - "Service Workers e Cache"
---

# Browser Cache — Guia Consolidado

Esta nota agrupa os tópicos de **Browser Cache** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [[#Cache-Control|Cache-Control]]
- [[#ETag|ETag]]
- [[#HTTP Cache|HTTP Cache]]
- [[#Service Workers e Cache|Service Workers e Cache]]

---

## Cache-Control

### O que é

Cache-Control define políticas de cache para browser, proxies e CDNs.

### Por que isso existe

Sem diretivas claras, cada camada aplica heurísticas diferentes e gera inconsistência.

### Como funciona internamente

1. Servidor envia diretivas (max-age, no-store, public/private).
2. Browser decide frescor sem contato com origem enquanto válido.
3. Com must-revalidate/stale-* ajusta comportamento sob erro/latência.
4. Diretivas interagem com ETag/Last-Modified para revalidação.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[HTTP Cache]]
- [[ETag]]
- [[Como debugar problemas de cache]]

## ETag

### O que é

ETag é um identificador de versão da resposta para revalidação condicional no cache do navegador.

### Por que isso existe

Evita baixar novamente recursos inalterados, economizando banda.

### Como funciona internamente

1. Servidor responde com ETag.
2. Browser envia If-None-Match em nova request.
3. Servidor compara versão e retorna 304 ou 200 com novo corpo.
4. ETag fraco/forte influencia sensibilidade a mudanças.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[HTTP Cache]]
- [[Cache-Control]]
- [[Keep Alive]]

## HTTP Cache

### O que é

HTTP Cache é o mecanismo automático do navegador para reutilizar respostas baseado em headers de cache.

### Por que isso existe

Reduz latência, consumo de banda e carga no backend em recursos repetidos.

### Como funciona internamente

1. Resposta chega com Cache-Control/ETag/Last-Modified.
2. Browser calcula freshness e elegibilidade por método/status.
3. Se stale, pode revalidar com If-None-Match/If-Modified-Since.
4. 304 mantém corpo local e atualiza metadados.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Cache-Control]]
- [[ETag]]
- [[Como debugar problemas de cache]]

## Service Workers e Cache

### O que é

Service Worker é um worker em segundo plano que intercepta requests e permite experiências offline e caching avançado.

### Por que isso existe

Desacopla estratégia de entrega da navegação tradicional, útil para PWAs e resiliência de rede.

### Como funciona internamente

1. Script é registrado e instalado pela página.
2. No evento activate, versões antigas podem ser limpas.
3. No fetch, lógica decide entre cache e rede.
4. Atualizações são transacionais e controladas por ciclo de vida próprio.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Cache Storage]]
- [[HTTP Cache]]
- [[IndexedDB]]

## Pontos comuns da família (backend/devops)

- Essencial para reduzir latência percebida e custo de tráfego em assets e respostas de API repetidas.
- Ajuda a coordenar deploy com versionamento/invalidação para evitar conteúdo stale pós-release.
- Melhora previsibilidade entre browser, CDN e origem em cenários de cache quente e frio.

## Problemas comuns da família

- Misturar diretivas incompatíveis e gerar comportamento imprevisível entre camadas de cache.
- Ignorar `Vary`, ETag e estratégia de revalidação, causando miss desnecessário ou inconsistência.
- Alterar CDN/backend sem validar impacto no cache do navegador.
