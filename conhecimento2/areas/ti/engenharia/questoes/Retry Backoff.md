---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---
## Como você lida com estratégias de retry e backoff em um sistema orientado a eventos?

### ✅ **Resposta completa:**

Em sistemas orientados a eventos — especialmente distribuídos e assíncronos — **retries mal implementados podem causar tormentas de chamadas, duplicações e efeitos colaterais indesejados**. Por isso, minha abordagem para **retry e backoff** envolve um equilíbrio entre **resiliência e proteção do sistema**.

---

### **Minha abordagem considera os seguintes pontos:**

---

### **1. Avaliação do tipo de erro**

- **Erro transitório** (ex: timeout de rede, indisponibilidade momentânea): retry com backoff é adequado.
- **Erro permanente** (ex: payload inválido, falha de negócio): não adianta repetir. Mando para **Dead Letter Queue (DLQ)** ou notifico diretamente.

---

### **2. Estratégia de retry com backoff exponencial com jitter**

- Uso **exponential backoff com jitter (aleatorização)** para evitar picos simultâneos de retries.
- Exemplo: `1s, 2s, 4s, 8s`, com jitter de ±30%. Isso evita o famoso problema do **retry storm**.
- Em ambientes AWS, botoes como **Lambda + SQS** já suportam isso de forma nativa.

---

### **3. Limitação de tentativas**

- Defino um **limite máximo de retries**, geralmente 3 a 5 tentativas.
- Após o limite, envio a mensagem para uma **DLQ** para análise manual ou reprocessamento posterior.
- Ferramentas como **SNS, SQS, EventBridge e Step Functions** permitem configurar isso declarativamente.

---

### **4. Idempotência**

- **Retries seguros exigem que a operação seja idempotente**, para não gerar efeitos colaterais.
- Utilizo **chaves de idempotência** ou **checks de estado** antes de reprocessar eventos.
- Exemplo: antes de registrar um pagamento, checo se ele já foi persistido ou processado anteriormente.

---

### **5. Observabilidade sobre retries**

- Monitoro a taxa de retry, latência acumulada, erros pós-retry e eventos que caíram na DLQ.
- Isso me permite avaliar se o sistema está enfrentando problemas de downstream, picos ou mal uso do mecanismo de retry.

---

### ✅ **Exemplo prático:**

Em um pipeline de orquestração de eventos de crédito PJ, tínhamos serviços assíncronos publicando e consumindo mensagens do Kafka. Ao detectar falhas de downstream, implementamos:

- Retry com backoff exponencial com jitter customizado em Spring Boot.
- Persistência da tentativa em banco com timestamps para análise.
- Mecanismo de replay manual para mensagens em falha, integrando com o Datadog para visibilidade.

---

### ✅ Conclusão:

Uma boa estratégia de retry **não é sobre repetir indefinidamente**, mas sim **entender o tipo de falha, aplicar backoff adequado, garantir idempotência e monitorar o processo**. Isso permite criar sistemas robustos e resilientes sem sacrificar consistência ou disponibilidade.

