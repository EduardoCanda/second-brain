---
tags:
  - Fundamentos
  - SRE
  - NotaBibliografica
---
## 🧠 **O que é um Span?**

Um **span** é a **unidade básica de rastreamento (trace) em sistemas distribuídos**.

Ele representa **uma operação individual** dentro de uma requisição maior (chamada de **trace**).

> Pense no span como um "bloco de execução" que contém início, fim, duração, e metadados sobre o que foi executado.
> 
---

## 🧩 **O que um span contém:**

- **Nome** da operação (ex: `HTTP GET /clientes`)
- **Timestamp de início e fim** (para medir duração)
- **Metadados (tags)**: status code, ID do usuário, tipo de banco, etc.
- **ID único do span**
- **Span pai (parent span)** — para formar uma hierarquia de chamadas
- **Trace ID** — identifica toda a cadeia de spans relacionados

---

## 🔗 **Span vs Trace**

| Conceito | O que representa |
| --- | --- |
| **Span** | Uma **única operação** (ex: chamada a DB, REST, cache) |
| **Trace** | Um **conjunto de spans** conectados, representando uma requisição ponta a ponta |

🧠 Exemplo de trace com spans:

```
css
CopiarEditar
→ Requisição HTTP recebida       (span 1)
  → Validação de dados           (span 2)
    → Chamada a microserviço B   (span 3)
      → Query no banco de dados  (span 4)

```

---

## 🔧 **Exemplo prático (API de crédito PJ):**

Imagine uma requisição ao endpoint `POST /propostas`:

- `Span 1`: recebimento da requisição (API Gateway ou ALB)
- `Span 2`: execução do handler na API de crédito
- `Span 3`: chamada para o microserviço de análise antifraude
- `Span 4`: query no banco de dados para salvar a proposta

Todos esses spans são **filhos de um mesmo trace**, e são usados para:

- Identificar gargalos (ex: "chamada ao serviço de antifraude demorou 800ms")
- Rastrear falhas em cadeia
- Monitorar tempo gasto em cada etapa

---

## 🧰 **Ferramentas que usam spans:**

- **AWS X-Ray**
- **OpenTelemetry**
- **Jaeger**
- **Datadog APM**
- **Elastic APM**
- **New Relic**

---

## ✅ **Conclusão para entrevista**

> “Um span é a menor unidade de rastreamento em um sistema distribuído. Ele representa uma única operação, como uma chamada HTTP ou uma query no banco, e inclui informações como duração, status, e relação com outros spans. Spans são encadeados para formar traces, que mostram o caminho completo de uma requisição. Já utilizei spans para analisar tempo de resposta entre microsserviços, encontrar gargalos e melhorar SLIs relacionados à latência em APIs críticas.”
> 
