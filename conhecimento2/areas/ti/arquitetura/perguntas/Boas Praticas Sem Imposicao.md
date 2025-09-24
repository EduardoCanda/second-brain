---
tags:
  - NotaBibliografica
  - Fundamentos
  - Arquitetura
categoria: questoes
---


## Como você dissemina boas práticas arquiteturais sem ser impositivo?

### ✅ **Resposta completa:**

Disseminar boas práticas arquiteturais exige **influência, escuta ativa e empatia com o contexto dos times**. Como Staff Engineer, não tento “ditar padrões” — minha função é **mostrar valor, promover experimentação guiada e gerar tração orgânica**, criando um ecossistema técnico mais saudável e consistente.

---

### **Minha atuação segue 4 princípios fundamentais:**

---

### **1. Começo com o “porquê” — contexto antes da prescrição**

- Ao invés de dizer *“use isso”*, explico:
    - Quais **problemas reais estamos tentando resolver** (ex: duplicidade, acoplamento, retrabalho).
    - Qual o **impacto observado em produção** sem aquele padrão.
    - Como a prática se conecta aos **valores de engenharia da empresa** (ex: observabilidade, escalabilidade, autonomia).
- Quando o time entende o *motivo*, a adesão vem naturalmente.

---

### **2. Demonstro com exemplos reais e resultados tangíveis**

- Compartilho casos práticos de squads que:
    - Reduziram bugs com uma prática de validação.
    - Aumentaram performance com uma decisão arquitetural bem pensada.
    - Agilizaram entregas com templates, SDKs ou modelos de integração.
- Transformo padrões em **templates reusáveis e ferramentas que economizam esforço**, como:
    - Repositórios de referência (ex: `infra-template`, `lambda-starter`, `observability-sdk`)
    - Cheatsheets, RFCs, vídeos curtos explicativos.

---

### **3. Crio espaços para escuta, cocriação e experimentação**

- Evito decisões unilaterais. Promovo:
    - **Guildas técnicas abertas**
    - **RFCs colaborativas com ciclos curtos de feedback**
    - **Pilotagens com squads parceiros** antes de escalar um padrão.
- Adapto a prática conforme o feedback real — isso **dá senso de pertencimento** e evita resistência.

---

### **4. Mantenho liberdade com responsabilidade**

- Não imponho por “política”. Ao invés disso:
    - Crio **recomendações versionadas**, com justificativas e trade-offs explícitos.
    - Acompanho a **adoção com métricas e impactos reais** (ex: % de serviços com tracing, % com retries corretamente configurados).
    - Apoio squads que escolhem caminhos diferentes, desde que **documentem e assumam o impacto técnico da decisão**.

---

### ✅ **Exemplo prático:**

Quando introduzimos um padrão de **tracing distribuído obrigatório com OpenTelemetry**, alguns squads achavam burocrático.

O que fiz:

- Modelei um “starter kit” com SDK e middleware plugável.
- Mostrei em guilda um caso onde o tracing salvou dias de investigação.
- Apoiei 2 squads em uma adoção guiada.
- Após 3 meses, 80% da plataforma tinha adotado o padrão sem obrigatoriedade formal.

---

### ✅ Conclusão:

Disseminar boas práticas é uma questão de **liderança por influência, não por imposição**. Como Staff, meu papel é **descomplicar o caminho, ouvir com respeito e mostrar o valor técnico com evidência — e não com hierarquia.**
