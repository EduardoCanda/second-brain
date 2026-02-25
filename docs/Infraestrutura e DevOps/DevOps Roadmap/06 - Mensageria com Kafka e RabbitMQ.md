# Mensageria com Kafka e RabbitMQ (visão DevOps)

## Objetivo
Operar sistemas assíncronos com resiliência e desacoplamento.

## Kafka (streaming/eventos)
- Alto throughput.
- Partições e retenção de eventos.
- Bom para analytics e event streaming.

## RabbitMQ (filas tradicionais)
- Roteamento flexível (exchanges).
- Ótimo para filas de tarefas.
- Simples para cenários request/worker.

## Itens operacionais para estudar
- DLQ (dead letter queue).
- Retries com backoff.
- Garantias de entrega (at-least-once etc.).
- Observabilidade de lag/consumidores.
