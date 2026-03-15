---
aliases:
  - "Browser Architecture Overview"
  - "Browser JavaScript Engine"
  - "Browser Multi Process Architecture"
  - "Browser Rendering Engine"
  - "Event Loop no navegador"
---

# Browser Architecture — Guia Consolidado

Esta nota agrupa os tópicos de **Browser Architecture** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [[#Browser Architecture Overview|Browser Architecture Overview]]
- [[#Browser JavaScript Engine|Browser JavaScript Engine]]
- [[#Browser Multi Process Architecture|Browser Multi Process Architecture]]
- [[#Browser Rendering Engine|Browser Rendering Engine]]
- [[#Event Loop no navegador|Event Loop no navegador]]

---

## Browser Architecture Overview

### O que é

A arquitetura do navegador separa responsabilidades entre processos para estabilidade, segurança e desempenho.

### Por que isso existe

Isolamento por processo reduz impacto de falhas e vulnerabilidades entre sites/abas.

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
- [[Browser Multi Process Architecture]]
- [[Browser Rendering Engine]]
- [[Browser JavaScript Engine]]

## Browser JavaScript Engine

### O que é

A JavaScript engine compila e executa JS (parser, bytecode, JIT, GC) dentro do navegador.

### Por que isso existe

Desempenho da engine impacta interação, hidratação e custo de scripts pesados.

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
- [[Event Loop]]
- [[Web APIs]]
- [[Browser Rendering Engine]]

## Browser Multi Process Architecture

### O que é

A arquitetura multiprocessos isola abas, renderers e serviços privilegiados em processos distintos.

### Por que isso existe

Melhora segurança (sandbox) e evita que um crash derrube todo o navegador.

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
- [[Browser Architecture Overview]]
- [[Browser Rendering Engine]]
- [[Security]]

## Browser Rendering Engine

### O que é

A rendering engine interpreta HTML/CSS e coordena layout, paint e composição.

### Por que isso existe

Ela determina boa parte da compatibilidade de padrões e performance percebida.

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
- [[HTML Parsing]]
- [[Critical Rendering Path]]
- [[Browser JavaScript Engine]]

## Event Loop no navegador

### O que é

Event Loop coordena execução de callbacks, render e tarefas assíncronas na thread principal do navegador.

### Por que isso existe

Sem esse modelo, scripts longos bloqueariam UI sem previsibilidade de ordem e prioridade.

### Como funciona internamente

1. Código síncrono entra no Call Stack.
2. Tarefas assíncronas são agendadas em filas (task/microtask).
3. Microtasks drenam antes do próximo frame.
4. Render ocorre entre ciclos quando a thread está livre.

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
- [[Call Stack]]
- [[Task Queue]]
- [[Microtask Queue]]

## Pontos comuns da família (backend/devops)

- Quando há consumo anormal de CPU/memória no cliente, esta família ajuda a separar gargalo de parsing, execução de JS, layout e composição.
- Em incidentes intermitentes, facilita diferenciar problema de processo/aba/extensão de problema de backend.
- Dá base para instrumentar troubleshooting no navegador (Performance, Memory, tracing) com hipóteses técnicas claras.

## Problemas comuns da família

- Tratar o navegador como “caixa-preta” única e ignorar que renderização, script e rede competem por recursos.
- Investigar apenas no servidor, sem coletar evidência de main thread, frames e long tasks.
- Otimizar bytes de rede quando o gargalo principal está no pipeline de render.
