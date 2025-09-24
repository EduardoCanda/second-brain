---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Java
---
## 🧠 **Como funciona o Multithreading no Java?**

**Multithreading** em Java é a capacidade de **executar múltiplas tarefas (threads) em paralelo** dentro do mesmo processo JVM, utilizando os recursos de múltiplos núcleos de CPU para aumentar performance, escalabilidade e responsividade.

---

## 🔩 **Conceito central: Thread**

- Uma **thread** é a **menor unidade de execução** dentro de um processo.
- Em Java, todas as aplicações iniciam com pelo menos **uma thread principal** (`main`)
- Você pode criar threads adicionais para **executar código em paralelo**

---

## 🧰 **Formas de criar threads em Java**

### 🔹 1. **Estendendo `Thread`**

```java
class MinhaThread extends Thread {
    public void run() {
        System.out.println("Executando em paralelo");
    }
}

```

### 🔹 2. **Implementando `Runnable`**

```java
java
CopiarEditar
Runnable tarefa = () -> System.out.println("Tarefa executada!");
new Thread(tarefa).start();

```

### 🔹 3. **Usando `ExecutorService` (mais moderno e escalável)**

```java
ExecutorService executor = Executors.newFixedThreadPool(4);
executor.submit(() -> {
    // código paralelo
});
executor.shutdown();

```

> Essa é a forma recomendada para produção — você evita gerenciamento manual de threads e tem melhor controle.
> 

---

## 📊 **Estados de uma thread (Thread Lifecycle)**

| Estado | Descrição |
| --- | --- |
| **NEW** | Criada mas ainda não iniciada (`new Thread`) |
| **RUNNABLE** | Aguardando CPU para ser executada |
| **BLOCKED** | Esperando liberação de um recurso monitor |
| **WAITING / TIMED_WAITING** | Esperando por outro thread ou tempo |
| **TERMINATED** | Finalizada (normal ou por exceção) |

---

## 🧩 **Gerenciamento de concorrência (pacote `java.util.concurrent`)**

Para evitar **race conditions**, **deadlocks** e facilitar paralelismo, o Java oferece:

| Componente | Função |
| --- | --- |
| `ExecutorService` | Gerência de pool de threads |
| `Future`, `Callable` | Execução assíncrona com retorno |
| `Semaphore`, `ReentrantLock` | Controle de acesso a recursos críticos |
| `CountDownLatch`, `CyclicBarrier` | Coordenação entre threads |
| `ConcurrentHashMap`, `BlockingQueue` | Estruturas thread-safe |

---

## 🧠 **Exemplo prático bancário (análise paralela PJ)**

Você tem uma lista de propostas de crédito PJ que devem ser analisadas por múltiplas regras independentes:

- Cada regra (antifraude, compliance, score externo) roda em paralelo via `ExecutorService`
- O resultado é reunido via `Future.get()` ou `CompletableFuture.allOf()`

> Resultado: tempo total cai de 3s para ~1s com execução paralela
> 

---

## ⚠️ **Desafios do multithreading**

- **Race condition**: duas threads alteram a mesma variável ao mesmo tempo → comportamento imprevisível
- **Deadlock**: threads ficam presas esperando recursos bloqueados entre si
- **Starvation**: uma thread nunca recebe CPU
- **Thread-safety**: garantir que os dados compartilhados estejam sincronizados

---

## ✅ **Conclusão para entrevista**

> “Multithreading no Java permite executar múltiplas tarefas em paralelo dentro da mesma aplicação, aproveitando o poder de múltiplos núcleos. Utilizo ExecutorService para gerenciar pools de threads, evitando overhead manual e melhorando a escalabilidade. Também aplico mecanismos de concorrência como ConcurrentHashMap, Locks e Futures para coordenar execuções seguras e eficientes. Já usei multithread para processar lotes de propostas de crédito PJ em paralelo, reduzindo significativamente o tempo total de resposta do sistema.”
> 
