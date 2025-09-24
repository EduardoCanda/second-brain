---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---
### 🎯 **Orquestração**

É quando **um componente central (orquestrador)** **controla explicitamente o fluxo** entre os serviços. Ele conhece as etapas do processo e **invoca cada serviço diretamente**, lidando com ordens, falhas, tentativas, e exceções.

### 🧰 Exemplos de ferramentas de orquestração:

- AWS Step Functions
- Apache Airflow
- Temporal.io
- Camunda (BPMN)
- Workflows definidos via código em orquestradores próprios

### 🧠 Exemplo prático:

> Uma análise de crédito que envolve:
> 
> - consultar dados cadastrais,
> - consultar score externo,
> - aplicar regras internas,
> - gerar resposta final.

Um **Step Function** orquestra todas essas chamadas na ordem correta, com tratamento de erro e decisão condicional.

---

### 💃 **Coreografia**

É quando **não há um componente central controlando o fluxo**. Cada serviço sabe **como reagir a eventos publicados no sistema**, e executa suas tarefas com base nisso.

### 🧰 Exemplos de tecnologias:

- Amazon EventBridge
- Apache Kafka
- RabbitMQ com eventos
- SNS + SQS

### 🧠 Exemplo prático:

> Quando uma nova proposta de financiamento é criada:
> 
> - o serviço de antifraude ouve o evento `PropostaCriada` e inicia validações
> - o serviço de auditoria grava logs
> - o serviço de risco escuta e calcula risco
> - o serviço de CRM envia notificação ao gerente

Nenhum serviço central diz quem deve fazer o quê. Tudo é baseado em **eventos** e **assinaturas**.

---

## 🧩 **Comparação com analogias**

- **Orquestração** é como um **maestro** conduzindo uma orquestra: cada instrumento só toca quando o maestro manda.
- **Coreografia** é como uma **dança**: cada dançarino sabe quando entrar e sair, reagindo ao ritmo e aos outros dançarinos — sem um maestro.

---

## ✅ Conclusão para entrevista

> “Orquestração e Coreografia são dois estilos de coordenação entre serviços. Na orquestração, um componente central coordena explicitamente o processo, o que dá mais controle e rastreabilidade, como em AWS Step Functions. Já na coreografia, os serviços são autônomos e reagem a eventos, promovendo maior desacoplamento e flexibilidade, como em arquiteturas orientadas a eventos com Kafka ou EventBridge. Já utilizei ambos: orquestração para fluxos sensíveis e coreografia para promover escalabilidade e reuso entre domínios de negócio.”
> 
