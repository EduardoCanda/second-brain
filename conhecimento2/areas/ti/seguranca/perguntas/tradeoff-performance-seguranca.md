---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
categoria: questoes
---

### Como você conduz trade-offs técnicos entre performance, segurança e manutenibilidade?

### ✅ **Resposta completa:**

Conduzir trade-offs entre **performance**, **segurança** e **manutenibilidade** é um dos papéis mais críticos de um Staff Engineer, pois envolve equilibrar múltiplas dimensões com impacto direto no negócio. Esses três pilares estão frequentemente em tensão: uma decisão que otimiza um, pode prejudicar outro.

---

### **Minha abordagem segue três etapas principais:**

---

### **1. Compreender os objetivos e restrições do domínio**

- Qual é a **prioridade estratégica** desse componente?
    - Em alguns casos, **performance é vital** (ex: tempo de resposta para APIs transacionais).
    - Em outros, **compliance e segurança são inegociáveis** (ex: manipulação de dados sensíveis).
    - Em ambientes com alta rotatividade ou squads diferentes, **manutenibilidade ganha peso**.
- Busco compreender o **nível de risco aceitável** com os stakeholders — isso guia o equilíbrio entre os fatores.

---

### **2. Mapear o impacto e os custos das opções**

- Avalio **alternativas técnicas**, analisando:
    - **Performance:** latência, throughput, uso de recursos.
    - **[[introducao-seguranca|Segurança]]:** exposição a vulnerabilidades, compliance, criptografia, controle de acesso.
    - **Manutenibilidade:** clareza de código, acoplamento, testes, onboarding de novos devs.
- Utilizo técnicas como **matriz de impacto**, RFCs técnicos e **brainstorm técnico entre engenheiros seniores** para explorar implicações.

---

### **3. Tomar a decisão com foco no contexto e comunicá-la bem**

- A decisão nunca é 100% técnica. Por isso:
    - Registro as premissas e trade-offs.
    - Documento o racional e os riscos aceitos.
    - Valido com stakeholders não técnicos quando o impacto extrapola engenharia (ex: risco de exposição, aumento de custo ou redução de [[sli-slo-sla|SLA]]).

---

### ✅ **Exemplo prático:**

Certa vez, em um projeto de onboarding digital, propuseram armazenar informações sensíveis no front-end localmente via sessionStorage para acelerar o processo. Isso melhorava performance percebida, mas aumentava o risco de **vazamento de dados sensíveis** em dispositivos compartilhados.

Minha abordagem foi:

- Apresentei os riscos de segurança e impactos legais.
- Sugeri uma abordagem híbrida: cache in-memory temporário com expiração agressiva + fallback criptografado backend.
- Garantimos **bom desempenho**, com segurança aderente à LGPD e sem comprometer a manutenibilidade.

---

### ✅ Conclusão:

Lidar com trade-offs é, antes de tudo, **um exercício de maturidade técnica e visão de negócio**. Não existe resposta certa universal. O que existe é **o melhor compromisso possível dentro de um determinado contexto**, desde que a decisão seja **consciente, comunicada e revisável com o tempo**.
