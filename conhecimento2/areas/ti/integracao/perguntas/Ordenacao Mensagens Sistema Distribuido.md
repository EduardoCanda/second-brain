---
tags:
  - Fundamentos
  - Integracoes
  - Arquitetura
categoria: questoes
---
## O que você levaria em conta para garantir a ordenação de mensagens em um sistema distribuído?

### ✅ **Resposta completa:**

Garantir a **ordem de mensagens** em um sistema distribuído é desafiador porque múltiplos produtores e consumidores, além de diferentes pontos de falha e latência, podem interferir na sequência esperada. No entanto, em muitos casos — como em **processos financeiros, logística ou controle de estado** — a ordem correta das mensagens é crítica.

---

### **Minha abordagem envolve os seguintes pilares:**

---

### **1. Entender o escopo da ordenação**

- A ordenação precisa ser **global** (entre todos os eventos do sistema) ou **por chave de entidade** (ex: um cliente ou contrato)?
- Em sistemas reais, geralmente a ordenação **por chave lógica** (chave de partição) é suficiente e mais escalável.

---

### **2. Escolher o broker/mecanismo de fila adequado**

- **[[Kafka]]**: oferece ordenação garantida dentro de uma **partição**, então particionar corretamente é essencial (ex: `partition key = contrato_id`).
- **[[SQS]]**: padrão não garante ordem. Para isso, usamos **FIFO queues** com `MessageGroupId`.
- **[[Resumo Event Bridge|EventBridge]] / [[Resumo SNS|SNS]]**: não garantem ordenação — nesses casos, ordenação precisa ser imposta no consumidor.

---

### **3. Controlar concorrência no consumo**

- Consumidores concorrentes podem processar mensagens fora de ordem mesmo que o broker tenha entregue corretamente.
- Para isso, uso:
    - **[[Locks em concorrencia|Locks]] por entidade** (optimistic/pessimistic) ou filas internas por chave.
    - Estratégias de **processamento sequencial por partição/grupo**.

---

### **4. Garantir monotonicidade no domínio**

- Em casos mais críticos, incluo no payload uma **versão ou timestamp sequencial**, e o consumidor valida se está recebendo uma mensagem “nova” ou fora de ordem.
- Isso permite **detecção e descarte de mensagens inválidas**.

---

### **5. Evitar reordenação acidental em processos intermediários**

- Transformações ou reprocessamentos manuais podem “embaralhar” a ordem.
- Para isso, **centralizo lógica de roteamento**, ou uso **[[Saga Pattern|sagas]]**/**event sourcing** para preservar contexto e reprocessamento correto.

---

### ✅ **Exemplo prático:**

No Itaú, ao processar atualizações em propostas de crédito, optamos por:

- Kafka com partições baseadas no `id da proposta`.
- Consumidores configurados para processar uma partição por vez.
- Inclusão de um `event_version` no payload para detectar mensagens duplicadas ou fora de ordem.
- Testes de carga simulando concorrência e falha para validar preservação da ordem.

---

### ✅ Conclusão:

Garantir ordenação em sistemas distribuídos **não é só sobre o broker**, mas também sobre **design de partição, controle de concorrência, detecção de inconsistências e testes rigorosos**. O segredo está em **assumir que desordem pode acontecer e construir sistemas que saibam reagir a isso.**
