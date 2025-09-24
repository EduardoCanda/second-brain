---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
categoria: mensageria
---
## 🧠 **O que é o Kafka?**

**Apache Kafka** é uma **plataforma distribuída de *streaming* e mensageria**, projetada para **publicar, armazenar e consumir eventos (mensagens) em tempo real** com **alta performance, durabilidade e escalabilidade horizontal**.

> Em vez de ser apenas uma "fila", o Kafka atua como um log distribuído imutável e ordenado de eventos que podem ser processados por múltiplos consumidores de forma paralela e assíncrona.
> 

---

## 🔧 **Componentes principais do Kafka:**

### 1. **Producer**

> Componente que publica mensagens em um tópico.
> 

Ex: um serviço de cadastro PJ envia um evento `ClienteCriado` para o Kafka.

---

### 2. **Topic**

> Canal lógico onde os dados são publicados.
> 
- É dividido em **partições**, o que permite **paralelismo**.
- Cada tópico pode ter **1 ou mais partições**, distribuídas entre os **brokers**.

🧠 *“Kafka escala horizontalmente particionando os tópicos.”*

---

### 3. **Broker**

> Servidor Kafka que armazena as mensagens e serve os consumidores.
> 
- Kafka funciona como um **cluster de brokers**.
- Cada broker pode conter várias partições de diferentes tópicos.

---

### 4. **Consumer**

> Lê mensagens de um tópico. Pode fazer parte de um Consumer Group.
> 
- Cada partição de um tópico é **atribuída a um único consumidor por grupo** → garante paralelismo com controle

---

### 5. **ZooKeeper** (legado) / **KRaft** (novo)

> Gerencia a coordenação e eleição de líderes entre os brokers.
> 
> 
> (Nota: a partir do Kafka 3.3+, o Zookeeper está sendo substituído pelo modo KRaft – Kafka-native consensus.)
> 

---

## 🔁 **Como funciona o fluxo de dados no Kafka?**

1. O **Producer** publica uma mensagem em um **Topic**
2. A mensagem é gravada em **partições**, e replicada em múltiplos brokers (tolerância a falhas)
3. Os **Consumers** leem mensagens das partições, mantendo seu **offset** (posição no log)

> Kafka não apaga a mensagem após o consumo → ela fica disponível por um tempo configurável (ex: 7 dias), mesmo após lida.
> 

---

## 📦 **Diferenciais do Kafka:**

| Característica                | O que significa                                                |
| ----------------------------- | -------------------------------------------------------------- |
| **Alto throughput**           | Pode processar **milhões de mensagens por segundo**            |
| **Baixa latência**            | Milissegundos entre publicação e consumo                       |
| **Durabilidade**              | Mensagens são armazenadas em disco com replicação              |
| **Escalabilidade horizontal** | Partições e consumidores paralelos permitem escalar facilmente |
| **Reprocessamento**           | Mensagens **não são apagadas automaticamente**                 |
| **Persistência configurável** | Pode reter por tempo, tamanho, ou indefinidamente              |

---

## 🧠 **Exemplo prático bancário (arquitetura com Kafka):**

Imagine um fluxo de análise de crédito PJ:

1. O serviço de proposta envia o evento `PropostaCriada` → tópico `propostas`
2. Múltiplos consumidores independentes escutam esse evento:
    - Antifraude
    - Compliance
    - Score de crédito
3. Cada serviço processa **de forma independente**, sem acoplamento direto
4. O Kafka garante ordenação por partição, tolerância a falhas e possibilidade de reprocessamento

---

## 📊 **Kafka vs outras soluções:**

| Sistema | Tipo | Características principais |
| --- | --- | --- |
| **Kafka** | Log distribuído | Alta retenção, ordenação, leitura paralela |
| **RabbitMQ** | Fila (AMQP) | Mais voltado a entrega imediata |
| **SQS (AWS)** | Fila distribuída simples | Fácil uso, sem ordenação garantida |
| **Kinesis (AWS)** | Log de streams similar | Gerenciado, mas menos flexível que Kafka |

---

## 🔧 **Casos de uso típicos:**

- **Arquitetura orientada a eventos (EDA)**
- **ETL em tempo real**
- **Log de auditoria**
- **Fila de tarefas em paralelo**
- **Pipelines de dados entre microserviços**
- **Event sourcing + CQRS**

---

## ✅ **Conclusão para entrevista**

> “Kafka é uma plataforma distribuída de streaming de eventos, projetada para ser altamente performática, durável e escalável. Ele funciona como um log imutável de eventos com múltiplos consumidores em paralelo, tornando-o ideal para arquitetura orientada a eventos. Já usei Kafka em sistemas de crédito PJ para desacoplar serviços de antifraude, compliance e CRM, garantindo processamento assíncrono, tolerância a falhas e rastreabilidade completa.”
>