# Controle de Concorrência + Cache + Batch (Nota Completa)

## O que aconteceu?
Você tinha uma lista grande (ex: 80 itens) e para cada item era feita uma chamada HTTP em paralelo.

Isso gerava:
- 80 threads simultneas
- Pico de CPU
- Alto consumo de memória
- Possível sobrecarga do serviço externo

---

## Por que isso acontece?

### 1. Thread per task
Cada item da lista gera uma thread → não escalável.

### 2. I/O bloqueante
Chamadas HTTP bloqueiam threads enquanto aguardam resposta.

### 3. Falta de backpressure
Não existe limite de concorrência → o sistema tenta fazer tudo ao mesmo tempo.

### 4. N+1 calls
Uma chamada vira N chamadas externas.

---

## Solução

### 1. Thread Pool Fixo

```java
ExecutorService executor = Executors.newFixedThreadPool(10);
```

### Como definir o tamanho ideal?

Regra prática:

- I/O bound (HTTP):  
  threads = CPU * 2 até CPU * 4

Exemplo:
- 4 cores → 8 a 16 threads

Ajuste baseado em:
- Latência da API
- Uso de CPU (< 70%)
- Tempo de resposta

---

### 2. Cache com Redis

- Evita chamadas repetidas
- Compartilhado entre instncias

Pseudo:
```java
User cached = redis.get(id);
if (cached != null) return cached;
```

---

### 3. Batch (simulado)

```java
List<List<String>> chunks = Lists.partition(ids, 10);
```

Processa em blocos:

```java
for (List<String> chunk : chunks) {
    // chamada em lote
}
```

---

### 4. Combinação final

Fluxo:

1. Recebe lista
2. Consulta cache
3. Separa faltantes
4. Agrupa em batch
5. Executa com thread pool limitado
6. Atualiza cache

---

## Boas práticas

- Nunca usar tamanho da lista como concorrência
- Definir limite explícito de threads
- Monitorar CPU e latência
- Usar timeout em chamadas HTTP
- Implementar retry com backoff
- Cache com TTL adequado
- Evitar batch muito grande (>100)

---

## Como mensurar thread pool

### Métricas importantes

- Active threads
- Queue size
- Task completion time
- CPU usage
- GC time

### Sinais de problema

- CPU > 80%
- Threads sempre no máximo
- Fila crescendo
- Latência aumentando

---

## Quando usar thread pool

- Chamadas I/O  
- Processamento paralelo controlado  
- Integrações externas  

---

## Quando é anti-pattern

- Criar thread por item  
- Usar parallelStream sem controle  
- Não limitar concorrência  
- Bloquear muitas threads com I/O  

---

## Conclusão

Você resolveu:

- Explosão de threads
- Sobrecarga de CPU/memória
- Ineficiência de chamadas HTTP

Com:

- Controle de concorrência
- Cache Redis
- Batch processing

---

## Links relacionados

- Batching em APIs
- Cache distribuído (Redis)
- Resilience4j
- WebClient reativo
