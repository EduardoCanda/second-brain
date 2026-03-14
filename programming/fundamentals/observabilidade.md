# Observabilidade

## Definição
Observabilidade é a capacidade de entender o estado interno de um sistema por sinais externos como logs, métricas e traces.

## Por que isso importa
É essencial para detectar regressões, investigar incidentes e otimizar performance com evidência.

## Exemplo de código
```java
logger.info("pedido processado", kv("pedidoId", pedidoId));
meterRegistry.counter("pedidos_processados_total").increment();
```

## Modelo mental
Pense em “fazer perguntas novas em produção”. Bons sinais permitem investigar sem redeploy.

## Erros comuns
- Log sem contexto de correlação.
- Métrica sem cardinalidade controlada.
- Coletar dados demais sem estratégia de custo.

## Conceitos relacionados
[[Debugging]]
[[Tolerância a falhas]]
[[Cache]]
