---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
categoria: mensageria
---
## 🧠 **Como o Kafka funciona em detalhes?**

O **Apache Kafka** funciona como um **log distribuído e particionado**, onde **produtores publicam eventos**, e **consumidores os leem de forma assíncrona**. Ele é otimizado para **throughput altíssimo, tolerância a falhas e retenção de mensagens**, mesmo após consumo.

---

## 🧩 **1. Tópicos e Partições**

- Os dados são organizados em **tópicos** (`topics`)
- Cada tópico é dividido em **partições** (`partitions`)
- Cada partição é **uma fila ordenada e imutável de eventos**
- A ordenação é garantida **dentro de cada partição**, e não entre partições diferentes

### Exemplo:

```
Tópico: pedidos_novos
Partições:
- Partition 0 → pedido_id 1001, 1002, 1003...
- Partition 1 → pedido_id 1004, 1005, ...

```

---

## 🧩 **2. Producers (publicadores)**

- Enviam mensagens para um tópico
- Escolhem a partição com base:
    - **Chave (key)** → mesma chave sempre vai para a mesma partição
    - **Round-robin** (sem chave) → balanceamento automático
- Possuem confirmação configurável: `acks=0|1|all`

🧠 *Exemplo:*

> acks=all garante que a mensagem só será considerada publicada após replicada em todas as réplicas ISR (In-Sync Replicas).
> 

---

## 🧩 **3. Brokers (servidores Kafka)**

- Cada **broker** armazena partições
- Um cluster Kafka tem múltiplos brokers → garante **distribuição e tolerância a falhas**
- Cada partição tem um **líder**, e réplicas em outros brokers (configurável com `replication.factor`)
- Os **consumidores e produtores se comunicam com o broker líder da partição**

---

## 🧩 **4. Replicação**

- Cada partição pode ter **1 ou mais réplicas** (ex: 3 brokers com réplica fator 3)
- Uma réplica é **líder**, as outras são **followers**
- Apenas o líder pode aceitar leitura/escrita
- As followers replicam o conteúdo do líder de forma assíncrona

🧠 Isso garante **alta disponibilidade**: se o líder cair, uma follower é promovida.

---

## 🧩 **5. Consumidores e Offsets**

- Os **consumidores** leem dados diretamente das partições
- O Kafka **não deleta mensagens após consumo**
- Em vez disso, cada consumidor **gerencia seu próprio *offset*** → a posição da leitura na partição

### Offset:

- Pode ser **armazenado no Kafka** (em `_consumer_offsets`) ou **externamente**
- Consumidor pode:
    - Recomeçar desde o início (`earliest`)
    - Ler apenas novas mensagens (`latest`)
    - Resetar para qualquer ponto manualmente

### Consumer Group:

- Um grupo de consumidores lê um tópico em paralelo
- Cada partição é **atribuída a apenas um consumidor por grupo**
- Kafka garante que o grupo processa as mensagens **sem duplicação e em paralelo**

---

## 🧩 **6. Retenção**

- As mensagens são **retidas por tempo (`retention.ms`) ou tamanho (`retention.bytes`)**
- Mesmo após consumo, elas permanecem disponíveis
- Isso permite:
    - **Reprocessamento**
    - **Replay de eventos**
    - **Analytics históricos**

---

## 🔄 **Resumo do fluxo interno de funcionamento:**

```
text
CopiarEditar
[Producer]
   ↓
  (envia evento com chave para tópico X)
   ↓
[Broker com partição líder de X]
   ↓ (replicado para followers)
[mensagem persistida em disco (commit log)]
   ↓
[Consumer lê a partição]
   ↓
[Atualiza offset para continuar do ponto correto]

```

---

## 📊 **Performance e Escalabilidade**

- Kafka é projetado para **escalabilidade horizontal**
- Aumentando o número de:
    - **Partições** → mais paralelismo
    - **Brokers** → mais capacidade de armazenamento e tráfego
    - **Consumers** → mais velocidade de processamento

🧠 O Kafka também é eficiente por:

- Usar **I/O sequencial**
- Armazenar dados em **arquivos compactados por partição**
- Evitar overhead de deletar mensagem após leitura

---

## 🛡️ **Tolerância a falhas**

- **Brokers podem cair**, e outro assume as partições (alta disponibilidade)
- **Consumers são reatribuídos automaticamente** entre partições (rebalanceamento)
- **Produtores** podem configurar `acks` e `retries` para garantir entrega

---

## ✅ **Conclusão para entrevista**

> “O Kafka é um log distribuído que organiza dados em tópicos com múltiplas partições. Produtores publicam mensagens que são gravadas em disco, replicadas entre brokers e consumidas por consumidores que gerenciam seus próprios offsets. Essa arquitetura permite paralelismo, reprocessamento, alta disponibilidade e throughput altíssimo. Já usei Kafka para desacoplar microsserviços, processar eventos de crédito PJ em tempo real, com controle de offset e tolerância a falhas via consumer groups e replicação.”
> 
