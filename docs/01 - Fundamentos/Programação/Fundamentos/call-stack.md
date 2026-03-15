# Call stack

## Definição
Call stack é a pilha de chamadas de função/método em execução.

## Por que isso importa
Entender stack ajuda a diagnosticar stack overflow, fluxo de execução e custo de chamadas profundas.

## Exemplo de código
```java
void a() { b(); }
void b() { c(); }
void c() { throw new RuntimeException("erro"); }
```

## Modelo mental
Cada chamada adiciona um frame na stack. O retorno remove frames em ordem LIFO.

## Erros comuns
- Recursão sem limite levando a StackOverflowError.
- Interpretar stack trace sem olhar causa raiz.
- Confundir stack (curta duração) com heap (objetos).

## Conceitos relacionados
[[Recursão]]
[[Heap memory]]
[[Debugging]]
