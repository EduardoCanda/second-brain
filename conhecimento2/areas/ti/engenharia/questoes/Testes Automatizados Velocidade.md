---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
categoria: questoes
---
## Quando você abriria mão de testes automatizados em nome da velocidade?

---

### ✅ **Resposta completa:**

Como regra geral, **testes automatizados são essenciais para garantir qualidade, segurança e agilidade sustentada**. No entanto, como Staff Engineer, reconheço que há **cenários pontuais onde abrir mão de determinados testes pode ser aceitável — desde que com consciência, controle e plano de compensação.**

---

### **Minha resposta se baseia em três critérios-chave:**

---

### **1. Contexto de risco: impacto e reversibilidade**

- Abro mão **temporária e pontualmente** quando:
    - A mudança tem **impacto muito restrito** (ex: ajuste de cópia ou layout).
    - O deploy é **reversível de forma rápida**, com rollback simples (ex: feature toggle, deploy canário, blue/green).
    - A entrega atende a uma **janela de oportunidade estratégica** (ex: campanha de marketing, MVP para cliente chave).

---

### **2. Trade-off entre cobertura e ciclo de aprendizado**

- Em POCs, MVPs ou experimentos, priorizo:
    - **Feedback rápido** do usuário real > cobertura de testes formal.
    - Testes manuais bem definidos + **tracking de comportamento em produção** com métricas e logs.
- Mas defino **critérios claros para cobertura obrigatória se o código for promovido a produção estável**.

---

### **3. Conscientização e plano de mitigação**

- Quando decido não escrever ou rodar todos os testes automatizados, **documento explicitamente o motivo e o plano de cobertura posterior**.
- Promovo **compensações como:**
    - Pair programming + revisão de código rigorosa.
    - Observabilidade forte em produção (tracing, alertas, log enriquecido).
    - Testes exploratórios orientados a risco antes do deploy.

---

### ✅ **Exemplo prático:**

Durante uma entrega com prazo apertado para uma feature promocional (validação de taxas pré-aprovadas), o time optou por:

- Testes manuais dirigidos + deploy com feature flag desligada.
- Alertas e dashboards para acompanhar o comportamento inicial.
- Testes automatizados de cobertura regressiva criados na sprint seguinte.

O risco era calculado, o rollback era rápido, e a transparência com produto e engenharia foi total.

---

### ✅ Conclusão:

Abrir mão de testes automatizados **não é uma escolha técnica, é uma decisão estratégica**. Só faço isso quando:

- **Entendo os riscos, tenho reversibilidade e visibilidade em produção.**
- Há um **compromisso claro de endereçar a lacuna** em breve.
    
    Como Staff, minha responsabilidade é **manter o equilíbrio entre velocidade e qualidade**, protegendo a saúde do sistema e a confiança do time.
    

