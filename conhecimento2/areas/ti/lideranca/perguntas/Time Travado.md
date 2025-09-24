---
tags:
  - Fundamentos
categoria: questoes
---
## Como você apoia um time que está travado em uma decisão técnica importante?

### ✅ **Resposta completa:**

Quando um time está travado tecnicamente, o papel do Staff Engineer é **destravar o pensamento, não entregar a resposta pronta**. O objetivo é **criar clareza, reduzir o medo de errar e dar ferramentas para que o próprio time avance** — com segurança e autonomia.

---

### **Minha atuação segue 4 etapas estruturadas:**

---

### **1. Entender o bloqueio real – técnico ou organizacional**

- Converso com o time para entender:
    - **É um impasse técnico real (trade-offs difíceis)?**
    - **É medo de errar ou insegurança com impacto futuro?**
    - **Falta de contexto de negócio ou alinhamento entre áreas?**
- Muitas vezes, o time já tem as opções mapeadas, mas **precisa de validação externa ou ajuda para priorizar critérios.**

---

### **2. Facilitar uma análise estruturada de trade-offs**

- Guio o time em exercícios como:
    - **Matriz de decisão técnica** (ex: simplicidade vs escalabilidade vs custo).
    - **RFC colaborativa**, com documentação dos caminhos avaliados.
    - Técnica dos **“prós e contras extremos”**: imaginar o que pode dar muito certo ou muito errado em cada caminho.
- Ajudo o time a **tirar a decisão do plano emocional e trazer para a racionalidade técnica contextualizada.**

---

### **3. Buscar dados e experimentos rápidos**

- Proponho **spikes técnicos com objetivos claros** (ex: POC de uma arquitetura, benchmark de performance, prova de conceito de dependência).
- Incentivo o uso de **protótipos ou deploys canary**, para medir impacto real com risco controlado.

---

### **4. Empoderar a decisão — com responsabilidade compartilhada**

- Evito assumir a decisão pelo time. Ao invés disso:
    - **Refaço as perguntas certas**.
    - **Mostro quais critérios eu usaria** em situações similares.
    - Valido se o time está confortável com o caminho e se há plano B.
- Quando necessário, **mediações entre times (ex: produto, segurança, dados)** são feitas com foco em remover ruídos.

---

### ✅ **Exemplo prático:**

Em uma squad discutindo entre usar Step Functions ou um orquestrador customizado, percebi que o bloqueio vinha de:

- Insegurança com limites da AWS.
- Medo de lock-in.
- Falta de benchmark.

Facilitei:

- Um spike comparando latência, visibilidade e custo.
- Um documento colaborativo com riscos e reversibilidade.
- Apoiei a escolha com plano de rollback validado.

O time saiu mais confiante, e a solução escolhida entregou 40% de economia de esforço operacional nos meses seguintes.

---

### ✅ Conclusão:

Um Staff Engineer não é o **oráculo da decisão**. Ele é **um guia técnico que dá clareza, estrutura e confiança** para que o time decida com embasamento. Minha missão é **remover atrito, ampliar visão e proteger a autonomia com responsabilidade.**
