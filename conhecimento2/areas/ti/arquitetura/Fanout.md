---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---

## 🧠 **O que é Fanout?**

**Fanout** é um **padrão de publicação** onde **uma única mensagem é enviada a múltiplos destinos simultaneamente**.

> Em vez de enviar uma mensagem individual para cada consumidor, você publica uma única vez, e o sistema garante que todos os inscritos recebam uma cópia.
> 

---

## 📦 **Como funciona (resumo):**

- Um produtor (serviço A) **publica um evento/mensagem**
- O sistema de mensageria **distribui a mesma mensagem para múltiplos consumidores (B, C, D...)**
- Cada consumidor **processa de forma independente**

---

## 🎯 **Onde o fanout é usado?**

- **SNS + SQS** (AWS)
- **RabbitMQ** (Exchange do tipo `fanout`)
- **EventBridge** (com múltiplos targets)
- **Kafka** (com múltiplos consumers no mesmo tópico e consumer groups diferentes)

---

## 🔧 **Exemplo prático no contexto bancário:**

Quando uma **nova proposta de crédito PJ é aprovada**, você pode disparar:

1. Um evento `PropostaAprovada` no SNS
2. Esse evento é entregue via fanout para:
    - SQS do antifraude (para revalidação)
    - Lambda de notificação (envia e-mail)
    - Serviço de CRM (atualiza histórico do cliente)
    - Firehose para auditoria (salva no S3)

> Todos os destinos recebem a mesma mensagem simultaneamente — sem acoplamento entre produtor e consumidores.
> 

---

## 🔁 **Fanout vs outros padrões**

| Padrão | Mensagem vai para | Ideal para |
| --- | --- | --- |
| **Fanout** | Vários consumidores | Notificações paralelas, broadcast |
| **Direct** | Um destino específico | Roteamento direto (via chave) |
| **Topic** | Consumidores filtram | Subscrição seletiva |
| **Work queue** | Um consumidor por mensagem | Balanceamento de carga (ex: SQS) |

---

## ✅ **Vantagens do Fanout**

- **Alta escalabilidade**: todos os consumidores processam paralelamente
- **Desacoplamento**: produtor não conhece os consumidores
- **Reutilização**: você pode adicionar novos destinos sem alterar o produtor

---

## ⚠️ **Cuidados**

- O fanout **não garante ordenação entre consumidores**
- Cada consumidor deve ser **idempotente** (evitar efeitos colaterais se processar mais de uma vez)
- Se usar SNS + SQS, você precisa **gerenciar falhas com DLQ** ou retries

---

## ✅ **Conclusão para entrevista**

> “Fanout é um padrão onde uma mensagem é distribuída para múltiplos consumidores simultaneamente, como em SNS com múlticas filas SQS ou Lambdas. Já usei fanout em arquiteturas orientadas a eventos para permitir que múltiplos domínios — como antifraude, CRM e auditoria — reagissem à aprovação de uma proposta PJ, sem acoplamento entre serviços. Esse padrão promove escalabilidade e flexibilidade, essenciais em ambientes bancários modernos.”
