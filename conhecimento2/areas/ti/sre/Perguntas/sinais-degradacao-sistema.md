---
tags:
  - NotaBibliografica
  - SRE
categoria: questoes
---

## Quais são os sinais de que um sistema está degradando silenciosamente?

### ✅ **Resposta completa:**

Um sistema **pode parecer saudável à primeira vista** — sem alarmes ou erros explícitos — mas ainda assim estar **degradando de forma silenciosa**. Como Staff Engineer, minha função é garantir que os times estejam atentos a esses sinais ocultos, **antecipando falhas antes que elas afetem o cliente.**

---

### **Os sinais que observo são divididos em três categorias principais:**

---

### **1. Alterações sutis em comportamento e performance**

- **Aumento progressivo de latência em percentis altos** (P95/P99), mesmo com média estável.
- **Aumento da taxa de timeouts client-side**, que podem não gerar erro 5xx no servidor.
- **Erro intermitente (flaky)**: falhas esporádicas que não disparam alarmes convencionais.
- **Spike de cold starts** (em Lambdas ou serviços containerizados) que afetam apenas parte dos usuários.

---

### **2. Sinais de estresse em recursos e dependências**

- **Consumo crescente de CPU ou memória**, com uso médio acima de 70% por períodos prolongados.
- **Filas de mensagens crescendo sem esvaziar** no ritmo esperado (ex: SQS, Kafka), indicando gargalo nos consumidores.
- **Retry rate elevado** em chamadas downstream, especialmente se mascarado por lógica de retry ou circuit breakers.
- **Erro de deserialização ou mensagens malformadas** sendo descartadas silenciosamente.

---

### **3. Sinais indiretos do usuário e do negócio**

- **Aumento em chamadas repetidas da mesma requisição**, sugerindo que o usuário não recebeu resposta satisfatória.
- **Queda súbita em métricas de conversão** ou abandono em etapas críticas (ex: cadastro, checkout).
- **Reclamações no suporte sem alertas técnicos correspondentes.**
- **Logs ou traces reduzidos** por falhas no sistema de observabilidade (ex: agentes caindo, buffers cheios).

---

### **Como eu atuo diante desses sinais:**

---

### ✅ **1. Configuro alertas inteligentes além de erros explícitos**

- Alerto sobre:
    - **Latência em P95/P99 acima de baseline.**
    - **Crescimento anormal de filas ou taxas de retry.**
    - **Anomalias detectadas via machine learning** (Datadog, CloudWatch Anomaly Detection).

---

### ✅ **2. Amplifico observabilidade com métricas de saúde detalhadas**

- Tracing com **open telemetry + correlação com logs e métricas**.
- Dashboards que mostram **tendências, não apenas estados binários** (ok/erro).
- Uso de **probes de experiência real (RUM)** ou **canary requests**.

---

### ✅ **3. Promovo revisões regulares de sinais fracos**

- Reuniões mensais de **“resiliência proativa”** para analisar padrões silenciosos.
- Incluo o conceito de **"near misses"** em post-mortems: situações que *quase* causaram falhas.

---

### ✅ **Exemplo prático:**

Em um sistema de proposta PJ, identificamos que:

- O tempo de envio de eventos para o Kafka aumentava em P99.
- A fila crescia discretamente, e os consumidores não escalavam a tempo.
- Nenhum alerta foi disparado porque os tempos estavam abaixo dos thresholds absolutos.
- Após ajustes nos autoscalers e tuning de batch size, estabilizamos o consumo e reduzimos o lag em 60%.

---

### ✅ Conclusão:

Falhas silenciosas são **mais perigosas que falhas evidentes**, porque **erosionam a confiança gradualmente**. Meu papel é **criar mecanismos que enxerguem além do “status verde”**, e ajudem o time a agir antes que o cliente perceba.
