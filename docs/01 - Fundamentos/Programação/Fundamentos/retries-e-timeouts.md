# Retries e timeouts

## Definição
Timeout define quanto tempo esperar; retry define quando tentar novamente após falha transitória.

## Por que isso importa
Sem esses controles, chamadas remotas podem travar recursos e amplificar incidentes.

## Exemplo de código
```java
Retry retry = Retry.ofDefaults("pagamento");
Supplier<String> decorated = Retry.decorateSupplier(retry, client::cobrar);
String resposta = Try.ofSupplier(decorated).get();
```

## Modelo mental
Use timeout curto e retries com limite + jitter. Sem limite, retry vira ataque ao próprio sistema.

## Erros comuns
- Retry em erros não transitórios (4xx de validação, por exemplo).
- Aplicar mesmos timeouts para todos os serviços.
- Não usar jitter e causar thundering herd.

## Conceitos relacionados
[[Tolerância a falhas]]
[[Idempotência]]
[[Backpressure]]
