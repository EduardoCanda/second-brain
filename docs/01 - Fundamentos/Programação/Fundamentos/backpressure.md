# Backpressure

## Definição
Backpressure é o mecanismo de limitar ou desacelerar produtores quando consumidores não acompanham o ritmo.

## Por que isso importa
Evita filas infinitas, estouro de memória e colapso em cascata sob pico de tráfego.

## Exemplo de código
```java
Flux.interval(Duration.ofMillis(1))
    .onBackpressureBuffer(1000)
    .subscribe(this::processar);
```

## Modelo mental
Sistemas saudáveis comunicam capacidade. Quando não dá para processar, o correto é desacelerar ou rejeitar cedo.

## Erros comuns
- Aceitar carga ilimitada sem limites explícitos.
- Usar filas como solução mágica sem monitorar atraso.
- Não aplicar shed load em degradação.

## Conceitos relacionados
[[Concorrência]]
[[Tolerância a falhas]]
[[Retries e timeouts]]
