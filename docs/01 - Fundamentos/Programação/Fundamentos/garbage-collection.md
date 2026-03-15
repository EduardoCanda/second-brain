# Garbage collection

## Definição
Garbage collection (GC) é o processo automático de liberar memória de objetos não mais alcançáveis.

## Por que isso importa
GC simplifica desenvolvimento, mas pausas e pressão de memória precisam ser monitoradas.

## Exemplo de código
```java
public void processar() {
    for (int i = 0; i < 1_000_000; i++) {
        String tmp = "item-" + i; // muitos objetos temporários
    }
}
```

## Modelo mental
Não “otimize contra o GC” prematuramente; primeiro meça alocação, pausas e throughput.

## Erros comuns
- Achar que GC elimina qualquer tipo de vazamento.
- Ignorar geração de lixo em loops críticos.
- Tunagem de JVM sem baseline de métricas.

## Conceitos relacionados
[[Heap memory]]
[[Observabilidade]]
[[Performance]]
