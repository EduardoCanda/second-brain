---
aliases:
  - "CSSOM"
  - "Composite"
  - "Critical Rendering Path"
  - "DOM Construction"
  - "HTML Parsing"
  - "Layout (Reflow)"
  - "O que acontece quando digitamos uma URL no navegador"
  - "Paint"
  - "Render Tree"
---

# Page Loading — Guia Consolidado

Esta nota agrupa os tópicos de **Page Loading** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [CSSOM](#cssom)
- [Composite](#composite)
- [Critical Rendering Path](#critical-rendering-path)
- [DOM Construction](#dom-construction)
- [HTML Parsing](#html-parsing)
- [Layout (Reflow)](#layout-reflow)
- [O que acontece quando digitamos uma URL no navegador](#o-que-acontece-quando-digitamos-uma-url-no-navegador)
- [Paint](#paint)
- [Render Tree](#render-tree)

---

## CSSOM

### O que é

CSSOM é a representação em memória das regras CSS aplicáveis ao documento.

### Por que isso existe

Sem CSSOM completo, browser não consegue calcular estilos finais e avançar para render tree.

### Como funciona internamente

1. CSS é baixado e parseado em regras.
2. Regras são combinadas com especificidade/cascata/herança.
3. Media queries e pseudo-classes alteram regras ativas.
4. Resultado participa do cálculo de estilo por nó DOM.

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
- [Render Tree](#render-tree)
- [Layout (Reflow)](#layout-reflow)
- [Critical Rendering Path](#critical-rendering-path)

## Composite

### O que é

Compositing combina camadas pintadas em uma imagem final exibida na tela.

### Por que isso existe

Permite animações mais suaves ao mover camadas sem repintar tudo.

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
- [Paint](#paint)
- [Layout (Reflow)](#layout-reflow)
- [Browser Multi Process Architecture](../Browser%20Architecture/Browser%20Architecture%20-%20Guia%20Consolidado.md)

## Critical Rendering Path

### O que é

Critical Rendering Path é a sequência mínima para transformar HTML/CSS/JS em pixels na tela.

### Por que isso existe

É onde nascem métricas de UX como FCP e LCP.

### Como funciona internamente

1. Browser parseia HTML e constrói DOM.
2. CSS gera CSSOM e pode bloquear render.
3. DOM + CSSOM formam Render Tree para layout e paint.
4. JS síncrono pode pausar parsing e atrasar primeira pintura.

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
- [HTML Parsing](#html-parsing)
- [CSSOM](#cssom)
- [Layout (Reflow)](#layout-reflow)

## DOM Construction

### O que é

DOM Construction é o processo de construir a árvore de objetos manipulável por JavaScript a partir do HTML.

### Por que isso existe

A estrutura do DOM determina custo de seleção, mutação e reflow durante a vida da página.

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
- [HTML Parsing](#html-parsing)
- [Layout (Reflow)](#layout-reflow)
- [Event Loop](../JavaScript%20Execution/JavaScript%20Execution%20-%20Guia%20Consolidado.md)

## HTML Parsing

### O que é

HTML Parsing converte bytes do documento em nós DOM seguindo regras tolerantes a erro do HTML5.

### Por que isso existe

Define ordem de descoberta de recursos e o momento em que scripts podem bloquear parsing.

### Como funciona internamente

1. Tokenizer lê tokens HTML.
2. Tree builder monta DOM com algoritmo de inserção.
3. Scripts sem async/defer podem pausar parsing.
4. Pré-carregador paralelo tenta antecipar recursos externos.

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
- [DOM Construction](#dom-construction)
- [Critical Rendering Path](#critical-rendering-path)
- [Render Tree](#render-tree)

## Layout (Reflow)

### O que é

Layout (reflow) calcula posição e dimensão dos elementos da render tree.

### Por que isso existe

Mudanças de layout frequentes custam caro e degradam fluidez da interface.

### Como funciona internamente

1. Browser percorre render tree e resolve box model.
2. Calcula tamanhos relativos, quebras de linha e posicionamento.
3. Mudanças em geometria invalidam nós e podem propagar reflow.
4. Resultados alimentam etapa de paint/composition.

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
- [Render Tree](#render-tree)
- [Paint](#paint)
- [Composite](#composite)

## O que acontece quando digitamos uma URL no navegador

### O que é

Ao digitar uma URL, o navegador executa uma cadeia completa: resolução, conexão segura, request, parsing e renderização.

### Por que isso existe

Conhecer essa cadeia ajuda a diagnosticar gargalos ponta a ponta e melhorar tempo de carregamento.

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
- [HTTP request lifecycle no navegador](../Networking/Networking%20-%20Guia%20Consolidado.md)
- [Critical Rendering Path](#critical-rendering-path)
- [Como analisar waterfall de requests](../Debugging/Debugging%20-%20Guia%20Consolidado.md)

## Paint

### O que é

Paint transforma nós com estilo/layout resolvidos em comandos de desenho.

### Por que isso existe

Separar paint de layout permite otimizações de camadas e aceleração por GPU.

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
- [Layout (Reflow)](#layout-reflow)
- [Composite](#composite)
- [Critical Rendering Path](#critical-rendering-path)

## Render Tree

### O que é

Render Tree combina DOM e CSSOM apenas com nós visíveis para etapa de layout.

### Por que isso existe

Separa estrutura lógica (DOM) da estrutura renderizável, reduzindo trabalho desnecessário.

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
- [CSSOM](#cssom)
- [Layout (Reflow)](#layout-reflow)
- [Paint](#paint)

## Pontos comuns da família (backend/devops)

- Fundamental para atacar gargalos do caminho crítico e melhorar Core Web Vitals.
- Mostra onde CSS/JS/HTML bloqueiam descoberta, layout e paint.
- Orienta priorização de recursos críticos e redução de jank visual.

## Problemas comuns da família

- Focar apenas em tamanho de arquivo e ignorar ordem/prioridade de carregamento.
- Medir só TTFB e não acompanhar FCP/LCP/CLS/INP.
- Subestimar impacto de scripts e estilos de terceiros no render inicial.
