# Tolerância a falhas

## Definição
É a capacidade de continuar operando mesmo com falhas parciais de componentes.

## Por que isso importa
Em produção, falhas são inevitáveis. O diferencial é como o sistema degrada sem parar tudo.

## Exemplo de código
```java
public String chamarServicoExterno() {
    try {
        return client.call();
    } catch (Exception e) {
        return "fallback";
    }
}
```

## Modelo mental
Projete para falhar: isole dependências, limite blast radius e garanta caminhos de fallback.

## Erros comuns
- Tratar toda falha com retry infinito.
- Não definir limites de isolamento entre componentes.
- Confundir disponibilidade com ausência total de erro.

## Conceitos relacionados
[[Retries e timeouts]]
[[Backpressure]]
[[Observabilidade]]
