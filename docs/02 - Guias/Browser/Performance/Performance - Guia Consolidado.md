---
aliases:
  - "Code splitting"
  - "Compression (gzip - brotli)"
  - "Lazy Loading"
  - "Prefetch"
  - "Preload"
---

# Performance — Guia Consolidado

Esta nota agrupa os tópicos de **Performance** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [[#Code splitting|Code splitting]]
- [[#Compression (gzip - brotli)|Compression (gzip - brotli)]]
- [[#Lazy Loading|Lazy Loading]]
- [[#Prefetch|Prefetch]]
- [[#Preload|Preload]]

---

## Code splitting

### O que é

Code splitting divide bundles JavaScript em partes carregadas sob demanda.

### Por que isso existe

Reduz payload inicial e acelera primeira interação em aplicações grandes.

### Como funciona internamente

1. O navegador avalia contexto da página (origem, tipo de recurso e prioridade).
2. A engine aplica regras do protocolo/política correspondente.
3. A decisão impacta rede, execução de JavaScript e renderização.
4. O resultado fica visível em headers, DevTools e métricas de performance.

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
- [[Lazy Loading]]
- [[Preload]]
- [[Critical Rendering Path]]

## Compression (gzip - brotli)

### O que é

Compressão (gzip/brotli) reduz tamanho de payloads HTTP transferidos ao navegador.

### Por que isso existe

Menos bytes trafegados significam menor tempo de download e menor custo de banda.

### Como funciona internamente

1. O navegador avalia contexto da página (origem, tipo de recurso e prioridade).
2. A engine aplica regras do protocolo/política correspondente.
3. A decisão impacta rede, execução de JavaScript e renderização.
4. O resultado fica visível em headers, DevTools e métricas de performance.

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
- [[HTTP request lifecycle no navegador]]
- [[Keep Alive]]
- [[Performance]]

## Lazy Loading

### O que é

Lazy loading adia download/execução de recursos não críticos até que sejam necessários.

### Por que isso existe

Diminui custo de rede e CPU no carregamento inicial.

### Como funciona internamente

1. O navegador avalia contexto da página (origem, tipo de recurso e prioridade).
2. A engine aplica regras do protocolo/política correspondente.
3. A decisão impacta rede, execução de JavaScript e renderização.
4. O resultado fica visível em headers, DevTools e métricas de performance.

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
- [[Code splitting]]
- [[Prefetch]]
- [[Preload]]

## Prefetch

### O que é

Prefetch baixa recursos com baixa prioridade para provável navegação futura.

### Por que isso existe

Antecipar recursos melhora sensação de instantaneidade em transições.

### Como funciona internamente

1. O navegador avalia contexto da página (origem, tipo de recurso e prioridade).
2. A engine aplica regras do protocolo/política correspondente.
3. A decisão impacta rede, execução de JavaScript e renderização.
4. O resultado fica visível em headers, DevTools e métricas de performance.

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
- [[Preload]]
- [[HTTP Cache]]
- [[Lazy Loading]]

## Preload

### O que é

Preload sinaliza recursos críticos que o navegador deve buscar cedo e com alta prioridade.

### Por que isso existe

Evita descoberta tardia de fontes, scripts e estilos essenciais.

### Como funciona internamente

1. O navegador avalia contexto da página (origem, tipo de recurso e prioridade).
2. A engine aplica regras do protocolo/política correspondente.
3. A decisão impacta rede, execução de JavaScript e renderização.
4. O resultado fica visível em headers, DevTools e métricas de performance.

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
- [[Prefetch]]
- [[Critical Rendering Path]]
- [[Como analisar waterfall de requests]]

## Pontos comuns da família (backend/devops)

- Importante para combinar técnicas (preload, prefetch, lazy, compressão) conforme contexto de navegação.
- Suporta estratégia de performance contínua com hipóteses, experimentos e validação.
- Reduz custo de CPU/rede sem sacrificar UX percebida.

## Problemas comuns da família

- Aplicar otimizações genéricas sem baseline e sem métrica de sucesso.
- Confundir otimização de laboratório com ganho real em campo.
- Usar hints agressivos e aumentar competição por banda no momento errado.
