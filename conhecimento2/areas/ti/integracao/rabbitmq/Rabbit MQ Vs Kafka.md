---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
categoria: mensageria
cat:
---
Aqui está um comparativo entre **RabbitMQ** e **Apache Kafka**, dois dos sistemas de mensageria mais usados em arquiteturas distribuídas:

| **Critério**              | **RabbitMQ** (AMQP/Broker tradicional)                                  | **Apache Kafka** (Streaming/Log distribuído)                                                       |
| ------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Modelo de Mensagens**   | Filas (queue-based)                                                     | Logs imutáveis (append-only)                                                                       |
| **Padrão de Uso**         | Comunicação assíncrona (RPC, tasks)                                     | Processamento de streams em tempo real                                                             |
| **Armazenamento**         | Mensagens são apagadas após consumo (opcional: persistência em disco)   | Mensagens são armazenadas por um período configurável (ex: 7 dias)                                 |
| **Consumo**               | Uma mensagem é consumida por um único worker (a menos que use *Fanout*) | Vários consumidores podem ler o mesmo tópico independentemente (offset controlado pelo consumidor) |
| **Escalabilidade**        | Vertical (scale-up) e limitada por filas                                | Horizontal (scale-out) e particionável                                                             |
| **Latência**              | Baixa (milissegundos)                                                   | Baixa, mas maior devido ao batching                                                                |
| **Throughput**            | Moderado (até ~50K msg/segundo)                                         | Extremamente alto (milhões de msg/segundo)                                                         |
| **Tolerância a Falhas**   | Replicação opcional (mirrored queues)                                   | Alta (réplicas distribuídas)                                                                       |
| **Protocolos Suportados** | AMQP, MQTT, STOMP                                                       | Kafka Protocol (binário)                                                                           |
| **Complexidade**          | Mais simples para filas tradicionais                                    | Mais complexo (exige ZooKeeper para coordenação)                                                   |
| **Melhor Caso de Uso**    | Filas de tarefas (background jobs), microsserviços                      | Processamento de eventos em tempo real, pipelines de dados                                         |

---

### **Quando Usar RabbitMQ?**
✔ **Cenários simples de pub/sub** (ex: enviar e-mails em segundo plano).  
✔ **Filas prioritárias** (ex: processar pedidos críticos primeiro).  
✔ **Comunicação entre microsserviços** com baixa latência.  
✔ **Casos onde a ordem das mensagens não é crítica** (embora existam *quorum queues* para garantir ordem).  

Exemplo:  
- Sistema de pedidos de e-commerce (um pedido = uma mensagem processada uma vez).

---

### **Quando Usar Kafka?**
✔ **Streaming de eventos em alta escala** (ex: logs, telemetria, IoT).  
✔ **Processamento em tempo real** (ex: analytics, fraud detection).  
✔ **Replay de mensagens** (consumidores podem reprocessar dados históricos).  
✔ **Integração com ecossistema de Big Data** (Flink, Spark, etc.).  

Exemplo:  
- Plataforma de rastreamento de cliques em anúncios (bilhões de eventos/dia).

---

### **Resumo:**
- **RabbitMQ** é ideal para **filas tradicionais** e **tarefas assíncronas**.  
- **Kafka** domina em **pipelines de dados** e **event-driven architectures**.  

Se precisar de mais detalhes sobre algum aspecto, avise! 🚀