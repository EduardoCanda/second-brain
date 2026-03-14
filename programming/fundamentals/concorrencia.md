# Concorrência

## Definição
Concorrência é lidar com múltiplas tarefas em progresso ao mesmo tempo, compartilhando recursos de forma coordenada.

## Por que isso importa
Backends modernos processam muitas requisições simultâneas; sem concorrência bem modelada, performance cai ou bugs surgem.

## Exemplo de código
```java
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> processarPedido("p1"));
pool.submit(() -> processarPedido("p2"));
```

## Modelo mental
Concorrência é sobre coordenação segura, não só velocidade. Primeiro corretude, depois otimização.

## Erros comuns
- Compartilhar estado mutável sem proteção.
- Confundir paralelismo com concorrência.
- Criar mais threads do que o sistema suporta.

## Conceitos relacionados
[[Thread safety]]
[[Race conditions]]
[[Deadlocks]]
