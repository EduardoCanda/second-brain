---
tags:
  - NotaBibliografica
  - SRE
categoria: questoes
---
## O que você considera fundamental em um bom post-mortem técnico?

### ✅ **Resposta completa:**

Um bom **post-mortem técnico** não serve apenas para entender *o que deu errado*, mas principalmente para garantir que **o aprendizado seja incorporado de forma estruturada e duradoura**. Como Staff Engineer,

incentivo uma cultura de post-mortems que seja **colaborativa, sem culpa e orientada à melhoria contínua**, com foco real em prevenção.

---

### **Minha estrutura para um post-mortem eficaz se baseia em 5 pilares:**

---

### **1. Cultura sem culpados (blameless)**

- O objetivo não é **atribuir falha individual**, mas entender **como o sistema (técnico, processual ou organizacional)** permitiu o erro.
- Promovo um ambiente seguro onde as pessoas **se sentem confortáveis para compartilhar decisões e falhas honestamente**, sem medo de punição.

---

### **2. Linha do tempo clara e objetiva**

- Detalho:
    - **Quando começou o problema** (real e percebido).
    - **Sintomas e impactos visíveis**.
    - **Ações tomadas em cada etapa** (detecção, resposta, mitigação).
    - **Tempo até resolução e tempo total de indisponibilidade (TTR).**
- Isso ajuda a entender **gaps na comunicação, observabilidade ou processos de escalonamento**.

---

### **3. Análise de causa raiz (root cause analysis)**

- Vou além da falha visível e busco as **causas estruturais**, com técnicas como:
    - **5 Porquês**
    - **Diagrama de Ishikawa**
    - **Eventos concorrentes e condições que facilitaram a falha**
- Se a falha foi causada por um humano, o foco é entender **por que o sistema permitiu que isso acontecesse**.

---

### **4. Lições aprendidas acionáveis**

- Documento **o que aprendemos** tecnicamente e organizacionalmente.
- Identifico **pontos cegos, processos frágeis, falhas de comunicação ou ausência de testes.**
- Classifico os aprendizados entre:
    - Oportunidades imediatas de correção.
    - Melhorias contínuas.
    - Insights para outros times.

---

### **5. Plano de ação concreto com responsáveis e prazos**

- Cada ação é descrita com:
    - **Responsável nomeado**
    - **Prazo realista**
    - **Critério de aceite (ex: teste automatizado, dashboard, ajuste de config)**
- Monitoro o **follow-up do plano de ação** em ritos de engenharia ou via ticket tracking.

---

### ✅ **Exemplo prático:**

Após um incidente onde falhas de latência intermitente passaram despercebidas por dias, conduzi um post-mortem com:

- Linha do tempo detalhada com timeline em minutos.
- Identificação de causas estruturais: ausência de P95 monitorado e lógica de retry silenciosa.
- Plano com ações de observabilidade (dashboards, alertas percentilizados), aumento de cobertura de testes, e reuniões técnicas para revisão do padrão de retries.
- O aprendizado foi reaproveitado por **outros 3 squads**, que evitaram falhas semelhantes.

---

### ✅ Conclusão:

Post-mortems são um pilar de maturidade técnica. Um bom post-mortem **não é um documento, é uma prática viva**: ele guia a evolução do sistema, melhora a colaboração entre times e mostra que **cada incidente é uma chance real de crescer.**

