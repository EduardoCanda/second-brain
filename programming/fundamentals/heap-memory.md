# Heap memory

## Definição
Heap é a região de memória onde objetos dinâmicos são alocados durante execução.

## Por que isso importa
Problemas de heap afetam latência, throughput e estabilidade de aplicações backend.

## Exemplo de código
```java
List<byte[]> blocos = new ArrayList<>();
while (true) {
    blocos.add(new byte[1024 * 1024]);
}
```

## Modelo mental
Pense em ciclo de vida de objetos: quem cria, quem referencia e quando pode ser coletado.

## Erros comuns
- Reter referências desnecessárias e causar memory leak lógico.
- Criar objetos temporários em excesso em hot path.
- Ignorar métricas de uso de heap em produção.

## Conceitos relacionados
[[Garbage collection]]
[[Call stack]]
[[Observabilidade]]
