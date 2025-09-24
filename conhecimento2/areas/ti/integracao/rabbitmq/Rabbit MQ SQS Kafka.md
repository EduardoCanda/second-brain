---
tags:
  - Fundamentos
  - NotaBibliografica
  - Integracoes
---
## 🧠 **Quando usar RabbitMQ, SQS ou Kafka?**

Essas três soluções são ferramentas de **mensageria**, mas com **características muito diferentes**.

| Ferramenta                           | Tipo principal                     | Modelo de entrega   |
| ------------------------------------ | ---------------------------------- | ------------------- |
| **[[Oque é o Rabbit MQ\|RabbitMQ]]** | Message Broker (fila + roteamento) | Push-based (AMQP)   |
| **[[SQS]]**                          | Managed Queue (AWS)                | Pull-based, simples |
| **[[Kafka]]**                        | Event Log distribuído (stream)     | Pull-based, pub/sub |

---

## 🔁 **1. Amazon SQS (Simple Queue Service)**

### ☁️ **O que é?**

Uma **fila gerenciada pela AWS**, altamente escalável e simples de operar.

### 🟢 **Quando usar:**

- Precisa de **mensageria simples e confiável**, com mínimo overhead
- Deseja **desacoplar serviços com baixa complexidade**
- Precisa garantir **entregas no mínimo uma vez** (*at-least-once*)
- Precisa de **retries, DLQ, visibilidade de mensagem, ordering limitado**
- Quer **resiliência nativa e operação totalmente serverless**

### 🔴 **Evite quando:**

- Precisa de alto throughput em tempo real
- Precisa de **reprocessamento/releitura** de mensagens
- Precisa de **event streaming** ou múltiplos consumidores lendo o mesmo dado

### 🧠 **Exemplo prático:**

> Pipeline de pedidos bancários enviados para análise assíncrona — o app envia para SQS e um Lambda processa com retries e DLQ.
> 

---

## 🐇 **2. RabbitMQ**

### 🧰 **O que é?**

Um **message broker tradicional**, com suporte a filas, **roteamento avançado**, e o protocolo **AMQP 0.9.1**.

### 🟢 **Quando usar:**

- Precisa de **controle detalhado de roteamento** (ex: fanout, direct, topic exchanges)
- Precisa de **baixa latência**, resposta rápida e priorização de mensagens
- Precisa de **confirmação de recebimento manual (ACKs)**
- Quer ter múltiplos padrões de entrega com boa maturidade

### 🔴 **Evite quando:**

- Precisa de alto volume de mensagens em escala horizontal
- Precisa de **retenção longa de eventos** ou replay
- Precisa de arquitetura orientada a eventos com múltiplos consumidores independentes

### 🧠 **Exemplo prático:**

> Sistema interno de aprovação de crédito com múltiplos fluxos e regras específicas: mensagens de diferentes tipos roteadas para múltiplas filas específicas.
> 

---

## ⚡ **3. Apache Kafka**

### 📦 **O que é?**

Uma **plataforma de streaming distribuída**, baseada em **log de eventos imutável**, com **alta durabilidade e throughput**.

### 🟢 **Quando usar:**

- Precisa de **event streaming em larga escala**
- Precisa de **reprocessamento de eventos históricos**
- Quer permitir **múltiplos consumidores com independência**
- Precisa de **garantia de ordem de mensagens por partição**
- Casos de **ETL, CDC, auditoria, análise de eventos em tempo real**

### 🔴 **Evite quando:**

- Precisa de algo simples ou com baixa taxa de eventos
- Você não quer gerenciar infraestrutura (a menos que use MSK ou Confluent Cloud)
- Precisa de push simples e não de retenção

### 🧠 **Exemplo prático:**

> Eventos de transação bancária sendo publicados por diversos microserviços e consumidos por múltiplos sistemas: antifraude, contabilidade, auditoria e CRM — todos ouvindo o mesmo log de eventos via Kafka.
> 

---

## 📊 **Resumo comparativo:**

| Característica | **SQS** | **RabbitMQ** | **Kafka** |
| --- | --- | --- | --- |
| Tipo | Fila gerenciada | Message broker com roteamento | Event streaming platform |
| Modelo | Pull | Push | Pull |
| Ordering | Limitado (FIFO) | Garantido por fila | Garantido por partição |
| Reprocessamento | ❌ (sem retenção longa) | ⚠️ difícil | ✅ (leitura múltipla por offset) |
| Throughput | Médio | Médio | **Muito alto (milhões/sec)** |
| Múltiplos consumidores | ❌ | ⚠️ (necessita múltiplas filas) | ✅ (cada consumidor tem offset) |
| Operação | Gerenciado (AWS) | Precisa de manutenção | Complexo (ou MSK gerenciado) |
| Uso ideal | Desacoplamento simples | Roteamento + latência baixa | Eventos em escala / stream replay |

---

## ✅ **Conclusão para entrevista**

> “Escolho entre SQS, RabbitMQ e Kafka com base no nível de complexidade e requisitos de processamento. Uso SQS quando quero mensageria simples, confiável e serverless. Uso RabbitMQ quando preciso de roteamento avançado e controle fino de fluxo de mensagens. Já Kafka entra quando preciso de streaming distribuído, retenção de eventos, múltiplos consumidores independentes e reprocessamento histórico. Já utilizei todos em diferentes contextos: desde pipelines assíncronos com SQS até arquiteturas orientadas a eventos com Kafka para sistemas de auditoria em ambientes bancários.”
> 
