---
tags:
  - Fundamentos
  - SRE
  - NotaBibliografica
---
Os **Golden Signals** são os **quatro principais indicadores de saúde de um sistema** que devem ser monitorados para **detectar, diagnosticar e responder rapidamente a problemas de performance ou disponibilidade.**

> O conceito foi formalizado pelo time de SRE da Google e é usado amplamente como base de monitoramento em sistemas modernos.
> 

---

### 🧩 **Os 4 Golden Signals são:**

| Sinal | O que mede | Pergunta que responde |
| --- | --- | --- |
| **Latency** | Tempo para responder a uma requisição | *O sistema está respondendo rápido o suficiente?* |
| **Traffic** | Volume de requisições recebidas | *Quantas requisições estão chegando?* |
| **Errors** | Taxa de falhas ou respostas inválidas | *O sistema está falhando ou retornando erro?* |
| **Saturation** | Grau de utilização dos recursos (CPU, memória, I/O, etc.) | *O sistema está perto do limite de capacidade?* |

---

## 🔍 **1. Latency (Latência)**

Mede quanto tempo leva para o sistema **responder a uma requisição**, seja com sucesso ou erro.

- Pode ser medido com [[percentils|percentis]] (p50, p95, p99)
- Deve ser analisada **separadamente para requisições bem-sucedidas e com erro**
- Alta latência, mesmo sem erro, indica **experiência degradada**

🧠 *Exemplo:*

> Requisições ao serviço de autenticação demorando mais de 2s para retornar, mesmo sem erros → o usuário sente lentidão.
> 

---

## 📈 **2. Traffic (Tráfego)**

Mede a **quantidade de carga** recebida pelo sistema. Pode ser:

- Requisições por segundo (RPS)
- Mensagens em filas (eventos)
- Transações por segundo (TPS)

🧠 *Exemplo:*

> Durante uma Black Friday, a API de checkout subiu de 1.000 para 10.000 RPS → precisa de escalabilidade automática ou throttling.
> 

---

## ❌ **3. Errors (Erros)**

Mede a **taxa de requisições que falham** — por código HTTP (4xx/5xx), exceções, timeouts, circuit breakers, etc.

🧠 *Exemplo:*

> Um serviço de pagamentos retorna HTTP 500 em 12% das chamadas → possível falha interna ou dependência instável.
> 

---

## 📉 **4. Saturation (Saturação)**

Mede o **grau de uso de recursos**, como:

- CPU, memória, disco, threads, conexões abertas
- Fila de mensagens em backlog
- Latência crescente em função de sobrecarga

🧠 *Exemplo:*

> Lambda com uso de CPU constante em 100% e filas acumulando → precisa de aumento de memória ou concorrência.
> 

---

## 🔁 **Por que monitorar os Golden Signals?**

Eles ajudam a responder rapidamente:

- O sistema está lento? (**latency**)
- Está recebendo mais tráfego que o normal? (**traffic**)
- Está falhando? (**errors**)
- Está no limite da capacidade? (**saturation**)

> Ao monitorar esses 4 sinais, você consegue identificar e agir em incidentes mesmo antes de os usuários reclamarem.
> 

---

## 🧠 **Exemplo no contexto bancário**

Em um serviço de análise de crédito:

- **Latency**: tempo para avaliar uma proposta
- **Traffic**: número de propostas analisadas por minuto
- **Errors**: requisições com erro (ex: documentos inválidos ou timeouts no antifraude)
- **Saturation**: CPU e memória dos pods, backlog em Kafka ou DynamoDB

---

## ✅ **Conclusão para entrevista**

> “Golden Signals são os quatro sinais essenciais que usamos para medir a saúde de sistemas distribuídos: latência, tráfego, erros e saturação. Eles ajudam a detectar anomalias rapidamente e servem como base para definir SLOs, dashboards e alertas. Já implementei painéis no CloudWatch e Grafana baseados nesses sinais para monitorar APIs críticas, identificar gargalos e automatizar respostas, inclusive em sistemas bancários com tráfego variável e requisitos rigorosos de SLA.”
> 