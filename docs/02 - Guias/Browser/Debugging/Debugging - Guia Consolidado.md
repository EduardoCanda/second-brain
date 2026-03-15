---
aliases:
  - "Como analisar waterfall de requests"
  - "Como debugar problemas de CORS"
  - "Como debugar problemas de cache"
  - "Como usar DevTools Network Tab"
---

# Debugging — Guia Consolidado

Esta nota agrupa os tópicos de **Debugging** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [[#Como analisar waterfall de requests|Como analisar waterfall de requests]]
- [[#Como debugar problemas de CORS|Como debugar problemas de CORS]]
- [[#Como debugar problemas de cache|Como debugar problemas de cache]]
- [[#Como usar DevTools Network Tab|Como usar DevTools Network Tab]]

---

## Como analisar waterfall de requests

### O que é

Waterfall organiza requests no tempo para evidenciar dependências, bloqueios e paralelismo do carregamento.

### Por que isso existe

Ajuda a encontrar cadeia crítica que aumenta LCP/TTI e incidentes de lentidão percebida.

### Como funciona internamente

1. Ordene por start time para ver sequência real.
2. Identifique recursos que bloqueiam render (CSS/JS síncronos).
3. Observe gaps entre etapas de rede e espera no servidor.
4. Cruze com tracing backend para localizar gargalo exato.

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
- [[Como usar DevTools Network Tab]]
- [[Critical Rendering Path]]
- [[Preload]]

## Como debugar problemas de CORS

### O que é

Um guia prático para diagnosticar falhas de CORS olhando a troca real entre navegador e servidor (preflight + request final), em vez de confiar só na mensagem do console.

### Por que isso existe

Erros de CORS costumam mascarar problemas diferentes (origem errada, headers ausentes, credenciais incompatíveis), e sem inspeção detalhada é fácil corrigir o ponto errado.

### Como funciona internamente

1. Abra DevTools > Network e habilite **Preserve log**.
2. Reproduza a chamada e localize primeiro a request **OPTIONS** (preflight), depois a request real.
3. Compare `Origin`, `Access-Control-Request-Method` e `Access-Control-Request-Headers` enviados pelo navegador.
4. Valide se a resposta devolve `Access-Control-Allow-*` compatível e `Vary: Origin` quando aplicável.

### Exemplo prático

```bash
curl -i -X OPTIONS https://api.exemplo.com/orders \
  -H 'Origin: https://app.exemplo.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: authorization,content-type'
```

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.exemplo.com
Access-Control-Allow-Methods: GET,POST,PUT,DELETE
Access-Control-Allow-Headers: authorization,content-type
Access-Control-Allow-Credentials: true
Vary: Origin
```

### Relação com outros conceitos

Relaciona-se com:
- [[CORS]]
- [[Same Origin Policy]]
- [[Como usar DevTools Network Tab]]
- [[HTTP request lifecycle no navegador]]

## Como debugar problemas de cache

### O que é

Debugar cache no navegador exige validar chaves de cache, headers e comportamento de Service Worker/CDN.

### Por que isso existe

Muitos bugs de “funciona em uma máquina” são versões antigas servidas por camadas diferentes de cache.

### Como funciona internamente

1. Reproduza com hard reload e cache desabilitado.
2. Cheque Cache-Control, ETag, Age e Vary.
3. Verifique se Service Worker intercepta a rota.
4. Compare resposta no browser com curl para isolar camada.

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
- [[Service Workers e Cache]]

## Como usar DevTools Network Tab

### O que é

A aba Network mostra cada request do navegador com tempos, headers, payloads e prioridade.

### Por que isso existe

É a ferramenta principal para separar problema de frontend, rede, CDN, proxy ou backend.

### Como funciona internamente

1. Abra DevTools e recarregue com cache desabilitado.
2. Use filtros por tipo, domínio e status.
3. Inspecione timing (DNS, connect, SSL, TTFB, download).
4. Compare headers de request/resposta e flags de cache.

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
- [[Como analisar waterfall de requests]]
- [[Como debugar problemas de CORS]]
- [[HTTP request lifecycle no navegador]]

## Pontos comuns da família (backend/devops)

- Fundamental para encurtar MTTR em incidentes web, correlacionando sintomas de UI com rede/políticas do browser.
- Dá linguagem comum entre frontend, backend e plataforma usando evidências de DevTools/HAR.
- Evita diagnóstico por suposição ao reproduzir o problema com contexto real de origem, cache e segurança.

## Problemas comuns da família

- Analisar apenas status HTTP e ignorar bloqueios por CORS, CSP, mixed content ou cache.
- Coletar evidência parcial (sem timing, sem headers completos, sem initiator).
- Reproduzir fora do contexto real (sem HTTPS/CDN/proxy) e mascarar causa raiz.
