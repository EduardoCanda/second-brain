---
tags:
  - NotaBibliografica
  - SRE
categoria: questoes
---
## Como você definiria bons SLOs para um serviço crítico?

### ✅ **Resposta completa:**

**SLOs (Service Level Objectives)** são compromissos explícitos de qualidade que ajudam a alinhar expectativas entre tecnologia e negócio. Para mim, um bom SLO **reflete o que realmente importa para o usuário**, é **baseado em dados históricos reais**, e permite uma **tomada de decisão clara e previsível** sobre priorização, estabilidade e capacidade de inovação.

---

### **Minha abordagem segue 5 princípios:**

---

### **1. Alinhar SLOs com a experiência do usuário**

- Pergunto: *o que realmente impacta a percepção de valor ou frustração para o cliente?*
    - Exemplo: tempo de resposta da API de login, sucesso no envio de uma proposta de crédito, disponibilidade de uma interface de cadastro.
- Defino **SLIs (Service Level Indicators)** que representem essa experiência:
    - Latência percentil P95, taxa de erro 5xx, disponibilidade de endpoint, sucesso de evento crítico.

---

### **2. Analisar dados históricos para estabelecer metas realistas**

- Extraio **telemetria e logs dos últimos 3 a 6 meses**, com:
    - Distribuição de latência.
    - Volume de requisições com sucesso.
    - Incidentes e períodos de instabilidade.
- A meta de SLO **não pode ser aspiracional** — deve refletir o nível de confiabilidade que podemos manter com segurança.
    - Exemplo: se historicamente alcançamos 99.85% de uptime, definir 99.99% sem mudança na arquitetura é arriscado.

---

### **3. Incluir margem de erro (erro budget)**

- O **error budget** define quanto do SLO podemos “gastar” com mudanças, falhas e instabilidades.
    - Exemplo: um SLO de 99.9% de disponibilidade em 30 dias permite até ~43 minutos de indisponibilidade.
- Isso cria **equilíbrio entre inovação e estabilidade**:
    - Se estamos dentro do orçamento, podemos correr mais riscos (deploys frequentes).
    - Se estamos estourando, priorizamos estabilidade.

---

### **4. Tornar os SLOs visíveis e acionáveis**

- Publico os SLOs em dashboards compartilhados com time de engenharia e negócio.
- Acompanho via alertas automáticos e uso como insumo para:
    - **Post-mortems**
    - **Revisão de priorização**
    - **Definição de débitos técnicos aceitáveis**

---

### **5. Revisar SLOs regularmente**

- SLOs não são fixos. Reviso trimestralmente com base em:
    - Mudança de volume ou perfil de usuários.
    - Alterações na infraestrutura ou arquitetura.
    - Feedback de produto ou suporte.

---

### ✅ **Exemplo prático:**

Na plataforma de onboarding PJ, definimos:

- SLI: sucesso no envio da proposta em menos de 5s (P95).
- SLO: 99.5% das propostas devem ser processadas nesse tempo nos últimos 30 dias.
- Resultado: conseguimos mensurar impacto real do autoscaling e priorizar melhorias que reduziram o tempo médio em 30%, aumentando a satisfação.

---

### ✅ Conclusão:

Um bom SLO é mais que um número — é uma **ferramenta de alinhamento, disciplina técnica e foco no que realmente importa para o cliente.** Como Staff Engineer, ajudo os times a definirem SLOs **alcançáveis, mensuráveis e conectados à visão de produto.**

