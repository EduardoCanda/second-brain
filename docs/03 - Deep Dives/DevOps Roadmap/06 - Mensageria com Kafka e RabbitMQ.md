# Mensageria com Kafka e RabbitMQ (visão DevOps)

## O que é
Mensageria permite comunicação assíncrona entre serviços. Kafka e RabbitMQ atendem necessidades diferentes:
- Kafka: streaming distribuído e retenção de eventos.
- RabbitMQ: fila orientada a roteamento e processamento de tarefas.

## Por que isso existe
Acoplamento síncrono entre serviços aumenta latência e reduz resiliência. Com mensageria, é possível absorver picos, desacoplar produtores/consumidores e escalar independentemente.

## Como funciona internamente

### Event Driven Architecture
```text
Producer -> Broker/Topic/Queue -> Consumer
```

### Kafka
- Log distribuído por **topics** e **partitions**.
- Ordem garantida por partição.
- Controle de consumo por offset.

### RabbitMQ
- Producer publica em **exchange**.
- Exchange roteia para **queues** por binding key.
- Consumer faz ack manual/automático.

## Exemplos práticos

### Kafka CLI
```bash
kafka-topics --create --topic orders --partitions 6 --replication-factor 3 --bootstrap-server broker:9092
kafka-console-producer --topic orders --bootstrap-server broker:9092
kafka-consumer-groups --describe --group order-worker --bootstrap-server broker:9092
```

### RabbitMQ CLI
```bash
rabbitmqctl list_queues name messages consumers
rabbitmqctl list_exchanges name type
rabbitmq-diagnostics check_running
```

### Padrões operacionais
- DLQ para mensagens inválidas.
- Retry com backoff e limite de tentativas.
- Métricas de lag, throughput, taxa de erro e tempo de processamento.

## Boas práticas
- Definir contrato de evento com versionamento de schema.
- Implementar idempotência no consumidor.
- Configurar retenção e compactação conforme caso de uso.
- Planejar particionamento com chave estável para balanceamento.

## Armadilhas comuns
- Acreditar em "exactly once" ponta a ponta sem considerar aplicação.
- Reprocessar eventos sem controle de duplicidade.
- Não monitorar consumer lag em produção.

## Referências relacionadas
- [[09 - SRE SLI SLO SLA e Incidentes]]
- [[11 - CI-CD para DevOps]]
- [[13 - Arquitetura Cloud para DevOps]]
