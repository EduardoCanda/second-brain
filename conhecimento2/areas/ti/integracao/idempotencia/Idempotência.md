---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
---
## 🧠 **O que é idempotência?**

Uma **operação é idempotente** quando, mesmo que seja **executada uma ou várias vezes**, o **efeito final é o mesmo**.

> Exemplo: um PUT /usuario/123 com o mesmo corpo pode ser enviado várias vezes — mas o estado final do recurso não muda.
> 

---

## 🧩 **Como garantir idempotência em diferentes tipos de integração**

### 🔹 1. **REST APIs**

### ✅ Estratégias:

- **Idempotency-Key**: o cliente envia um identificador único no header (`Idempotency-Key`), e o servidor armazena o resultado da operação.
- **Usar métodos HTTP idempotentes** corretamente:
    - `GET`, `PUT`, `DELETE` → já são idempotentes por definição
    - `POST` → precisa de estratégia adicional (ex: `Idempotency-Key` ou chave de negócio)

### 🧠 Exemplo prático:

> Em um POST /pagamentos, você aceita um Idempotency-Key: abc123, armazena o ID da transação processada, e retorna a mesma resposta se a mesma key for usada novamente.
> 

---

### 🔹 2. **Filas (Kafka, SQS, RabbitMQ)**

### ✅ Estratégias:

- **Deduplicação no consumidor**:
    - Armazene um `messageId` ou `eventId` único no banco/cache
    - Antes de processar, verifique se já foi executado
- **Chave de negócio imutável**:
    - Se o evento representa uma operação (ex: `PedidoPago`), use o ID de negócio como chave de idempotência
- **Idempotência na operação final**:
    - Ex: `UPDATE saldo SET valor = 500 WHERE id_cliente = 123` é idempotente; `UPDATE saldo = saldo + 500` **não é**

### 🧠 Exemplo prático:

> Consumidor Kafka recebe múltiplas vezes um evento PagamentoAprovado. O handler checa se o payment_id já foi registrado antes de aplicar qualquer lógica.
> 

---

### 🔹 3. **APIs assíncronas com Webhooks / Callbacks**

### ✅ Estratégias:

- Validar se o callback já foi processado com base em um identificador único (`event_id`)
- Armazenar um log de entrega de eventos processados
- Retornar **200 OK mesmo em reentregas** (idempotente)

🧠 Lembre: sistemas de webhook como Stripe ou AWS EventBridge podem **reenviar eventos múltiplas vezes**, então **o seu endpoint deve ser tolerante a repetições.**

---

### 🔹 4. **Integrações com bancos de dados**

### ✅ Estratégias:

- **Chave única (natural ou técnica)** para garantir que `INSERT` ou `UPSERT` não causem duplicações
- **[[Locks em concorrencia|Locks]] por chave de negócio** para garantir exclusão mútua
- **Upserts (`ON CONFLICT DO NOTHING` ou `ON DUPLICATE KEY`)** com lógica controlada

### 🧠 Exemplo prático:

> INSERT INTO pagamento (id_pagamento, status) VALUES (...) ON CONFLICT (id_pagamento) DO NOTHING
> 

---

### 🔹 5. **Mensageria baseada em eventos (Event Sourcing / CQRS)**

### ✅ Estratégias:

- **Event IDs únicos** e registro dos eventos processados
- Aplicação de eventos deve ser **pura e idempotente**
- Evitar side effects diretos no handler (ex: envio de e-mail sem checagem)

---

## ⚠️ **Cuidados comuns:**

| Problema | Prevenção |
| --- | --- |
| **Retry sem idempotência** | Adotar `Idempotency-Key` ou deduplicação por `event_id` |
| **Side effects múltiplos (ex: cobrança)** | Armazenar estados processados e confirmar antes de agir |
| **Chaves técnicas mal definidas** | Usar IDs de negócio (ex: `pedido_id`, `pagamento_id`) como base |
| **Processamento paralelo** | Usar locks, versionamento ou estratégias de **concurrency control** |

---

## ✅ **Conclusão para entrevista**

> “Idempotência é essencial para garantir consistência em sistemas distribuídos, especialmente diante de falhas, retries e reprocessamentos. Em REST APIs, aplico o padrão de Idempotency-Key. Em filas, faço deduplicação com event_id e verifico o estado atual antes de processar. Em bancos, uso UPSERT e constraints de unicidade. Já em webhooks, uso validação de evento processado e trato reentregas como esperadas. Essas práticas garantem segurança e previsibilidade mesmo em sistemas de alta escala e latência variável.”
> 
