---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---
## 🧠 **O que é o Saga Pattern?**

O **Saga Pattern** é um **padrão de gerenciamento de transações distribuídas** em sistemas com microsserviços. Ele garante **consistência eventual** quando **uma operação envolve vários serviços independentes**, mas **não pode ser tratada com uma única transação ACID**.

> Ao invés de uma transação global com commit único, o Saga Pattern divide o processo em uma série de etapas locais, cada uma com uma "ação compensatória" em caso de falha.
> 

---

## 🔁 **Como funciona:**

1. Cada **serviço executa sua parte da transação localmente** e, se tudo correr bem, o próximo serviço é chamado.
2. Se algum passo falha, **as ações anteriores são desfeitas** por meio de **operações compensatórias**.
3. O estado global do sistema eventualmente se torna **consistente**, mesmo sem rollback atômico.

---

## 🔧 **Exemplo bancário prático (cenário PJ):**

Imagine uma operação de **criação de conta PJ com limite de crédito**:

1. Serviço A → Cria o cadastro da empresa
2. Serviço B → Gera o limite de crédito
3. Serviço C → Cria cartão empresarial
4. Serviço D → Envia SMS de boas-vindas

Se o passo 3 falha, o Saga executa:

- Ação compensatória no serviço B → remove limite
- Ação compensatória no serviço A → deleta o cadastro

---

## 🧩 **Modelos de implementação**

### 🔸 **1. Orquestrado (Command-based Saga)**

- Um **serviço central (orquestrador)** coordena as etapas da transação
- Ele envia comandos para cada serviço, e decide quando chamar compensações

🧠 **Exemplo**: AWS Step Functions, Temporal.io, Camunda

**Vantagens**:

- Controle centralizado
- Fácil rastreabilidade e debugging

**Desvantagens**:

- Introduz um ponto central de orquestração (maior acoplamento)

---

### 🔸 **2. Coreografado (Event-based Saga)**

- Não há orquestrador. Cada serviço **escuta eventos e reage** conforme sua função.
- Se algo falha, o próprio serviço publica um evento de compensação.

🧠 **Exemplo**: EventBridge, Kafka, SNS/SQS

**Vantagens**:

- Altamente desacoplado
- Escalável e flexível

**Desvantagens**:

- Complexidade maior para rastrear o fluxo
- Difícil saber "quem está no controle"

---

## ⚖️ **Saga vs Transações ACID**

| Aspecto                    | Transações ACID (monolito)    | Saga Pattern (distribuído)             |
| -------------------------- | ----------------------------- | -------------------------------------- |
| Tipo de consistência       | Forte (consistência imediata) | Consistência eventual                  |
| Rollback automático        | Sim                           | Não. Usa compensações manuais          |
| Independência dos serviços | Baixa                         | Alta                                   |
| Ideal para                 | Monólitos, banco único        | Microsserviços e sistemas distribuídos |

---

## ✅ **Quando usar cada um?**

### 🟢 **Orquestração é melhor quando:**

- Você precisa de **controle central, visibilidade e rastreabilidade**
- Fluxo é **crítico e sequencial**, e falhas precisam ser tratadas em cascata
- Precisa de **timeout, retries e rollback controlado**
- Ideal para processos **de negócio bem definidos e rígidos**

### 🟢 **Coreografia é melhor quando:**

- Você quer **desacoplamento total entre serviços**
- Os serviços devem **reagir a eventos** e serem **reutilizáveis**
- O fluxo pode evoluir naturalmente com **eventos adicionados ou removidos**
- Ideal para **event-driven architecture** em ambientes escaláveis
--- 
## ✅ **Conclusão para entrevista**

> “O Saga Pattern é uma forma de coordenar transações distribuídas em sistemas de microsserviços, garantindo consistência eventual sem depender de transações ACID globais. Ele divide a transação em passos locais com ações compensatórias para rollback em caso de falha. Já usei tanto a abordagem orquestrada com Step Functions quanto coreografada com EventBridge e SQS. É um padrão essencial para evitar inconsistência de dados em processos como onboarding de clientes, liberações de crédito e fechamento de contratos.”
> 



