---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
categoria: questoes
---
## Como você abordaria a escolha entre consistência e disponibilidade em um sistema crítico?

### ✅ **Resposta completa:**

A escolha entre **consistência** e **disponibilidade** em um sistema crítico deve ser guiada pelos **requisitos do negócio** e pela **tolerância ao risco** daquele domínio específico. Essa decisão está intimamente ligada ao **[[Teorema CAP]]**, que afirma que, em sistemas distribuídos, é impossível garantir simultaneamente Consistência, Disponibilidade e Tolerância a Partições — sendo necessário abrir mão de um deles em momentos de falha.

**Minha abordagem seria a seguinte:**

---

### **1. Entender o domínio e o impacto da inconsistência**

- Em sistemas financeiros (como movimentações bancárias), **consistência forte** é essencial — não posso permitir que o saldo de uma conta esteja diferente entre dois nós.
- Em sistemas de recomendação ou métricas analíticas, **eventual consistency** pode ser aceitável para manter a disponibilidade.

---

### **2. Avaliar o tipo de operação**

- Para **operações de escrita**, inconsistências podem ser mais graves e merecem mais cuidado.
- Para **operações de leitura**, podemos tolerar delays e aplicar caching, replicação assíncrona e estratégias como read-repair.

---

### **3. Escolher a estratégia adequada com base no perfil da aplicação**

- Se a aplicação não pode tolerar divergência de dados (ex: compensações financeiras, ordens de compra), uso bancos com **consistência forte** ou **transações distribuídas** (com muito critério).
- Se a aplicação prioriza disponibilidade (ex: sistemas de conteúdo, notificações), aplico **eventual consistency**, com **monitoramento de divergência** e mecanismos de reconciliação.

---

### **4. Adotar padrões arquiteturais de mitigação**

- **CQRS + Event Sourcing**, para isolar caminhos de leitura e escrita e ter reprocessamento controlado.
- **Dead letter queues e compensação**, para garantir consistência eventual em processos assíncronos.
- **Circuit breakers**, para não sacrificar toda a experiência do usuário em caso de falha parcial.

---

### **Exemplo prático:**

No Itaú, atuando em sistemas que lidam com empréstimos PJ, se eu precisasse registrar uma contratação, **escolheria consistência forte**, mesmo sacrificando momentaneamente a disponibilidade. Já para exibir o histórico de propostas ou enviar notificações sobre condições pré-aprovadas, **priorizaria disponibilidade**, com uma estratégia baseada em cache, replicação e sincronização assíncrona via eventos.

---

### ✅ Conclusão:

A decisão entre consistência e disponibilidade não é técnica apenas — ela é estratégica. O mais importante é **alinhar a escolha ao risco de negócio**, **comunicar claramente os trade-offs ao time** e **implementar observabilidade adequada para monitorar desvios**.
