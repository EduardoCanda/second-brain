---
tags:
  - Fundamentos
categoria: questoes
---

## Como você toma decisões quando há incerteza técnica ou falta de dados concretos?

### ✅ **Resposta completa:**

Tomar decisões sob **incerteza técnica** é uma realidade comum no papel de Staff Engineer — especialmente em projetos com novas tecnologias, contextos ambíguos ou pressões de prazo. Nessas situações, o foco não está em “acertar de primeira”, mas em **tomar decisões conscientes, testáveis e reversíveis**.

---

### **Minha abordagem segue 5 etapas práticas:**

---

### **1. Reduzir a incerteza com aprendizado rápido**

- Busco **experimentação controlada**: spikes técnicos, provas de conceito (PoCs), benchmark de alternativas.
- Isso me dá dados rápidos para comparar impacto, complexidade, latência, custo ou aderência técnica.
- Exemplo: quando precisei decidir entre usar Step Functions ou orquestração via SQS + Lambda, construí ambos em sandbox e medi pontos de falha e desempenho.

---

### **2. Tomar decisões reversíveis sempre que possível**

- Avalio se a decisão é **“de uma via” (irreversível)** ou **“de duas vias” (reversível)**, como sugerido pelo Jeff Bezos.
- Em casos de reversibilidade, prefiro **agir com velocidade e ajustar depois** — desde que o risco seja controlado.

---

### **3. Estabelecer critérios mínimos de decisão**

- Crio uma **grade de avaliação simples**, como:
    - Viabilidade técnica (nível de esforço)
    - Alinhamento com stack atual
    - Suporte da comunidade/provedor
    - Custo e segurança
- Pontuo qualitativamente com o time, buscando reduzir vieses individuais.

---

### **4. Envolver múltiplos perfis no debate**

- Faço **revisões técnicas colaborativas** (ex: RFCs, tech reviews) com arquitetos, engenheiros do time, SREs ou até times de produto.
- A diversidade de pontos de vista ajuda a **expor riscos ocultos** e evita decisões isoladas ou apressadas.

---

### **5. Documentar as premissas e monitorar resultados**

- Registro as **hipóteses, riscos aceitos e sinais de sucesso ou falha**.
- Isso me permite reavaliar a decisão com base em dados reais depois da implementação parcial ou em ambiente de staging.

---

### ✅ **Exemplo prático:**

Ao avaliar uma mudança de arquitetura para adoção de Kinesis em vez de Kafka, enfrentei falta de dados sobre custo real e throughput. Conduzi:

- Um PoC em ambiente de carga simulada.
- Discussão técnica estruturada com dados levantados.
- Decisão inicial pelo Kinesis com plano de rollback caso o throughput não fosse suficiente.

Essa abordagem permitiu avançar sem paralisia, mantendo flexibilidade e controle.

---

### ✅ Conclusão:

Lidar com incerteza é parte do papel de liderança técnica. A chave está em **gerenciar riscos, criar visibilidade, testar suposições e manter um ciclo rápido de feedback.** Decisão em contexto ambíguo exige **curiosidade, humildade técnica e senso de urgência.**
