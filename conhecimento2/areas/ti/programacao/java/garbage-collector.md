---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Java
---
## 🧠 **O que é o Garbage Collector no Java?**

O **Garbage Collector (GC)** é o mecanismo da JVM responsável por **identificar e remover automaticamente objetos que não são mais utilizados**, ou seja, **que não são mais referenciados** por nenhuma parte do código.

> O objetivo é liberar memória do Heap de forma segura e automática, sem o desenvolvedor precisar desalocar objetos manualmente (como em C/C++).
> 

---

## 🔍 **Como o GC identifica objetos para remoção?**

### ✅ **Reachability Analysis** (Análise de alcançabilidade)

- O GC parte de **"raízes de referência"** (ex: variáveis locais de threads, referências estáticas)
- A partir dessas raízes, ele navega pelos objetos conectados
- Objetos **não alcançáveis** (sem referência direta ou indireta) são marcados para coleta

---

## 🧩 **Divisão do Heap no contexto do GC**

| Região | Descrição |
| --- | --- |
| **Young Generation** | Onde os objetos **são criados inicialmente** |
| **Old Generation** | Onde objetos **longevos são promovidos** |
| **Eden Space** | Primeiro lugar de alocação de novos objetos |
| **Survivor Spaces** | Onde objetos sobrevivem à primeira coleta |

---

## 🔄 **Tipos de Coleta:**

### 🔸 **Minor GC** (ou Young GC)

- Acontece na **Young Generation**
- Coleta objetos de curta vida
- Rápido e frequente
- Objetos que sobrevivem são promovidos aos **Survivor Spaces** ou ao **Old Gen** (após sobreviverem a múltiplos GCs)

### 🔸 **Major GC / Full GC**

- Coleta na **Old Generation**
- **Mais custosa** em termos de tempo e CPU
- Pode causar **pausas perceptíveis** (Stop-the-world)
- Pode incluir **metaspace cleanup** (caso não seja GC nativo do metaspace)

---

## 🔧 **Algoritmos de Garbage Collector disponíveis:**

### 1. **Serial GC (`XX:+UseSerialGC`)**

- Coleta com threads únicas
- Bom para aplicações simples ou pequenas (ex: JVM embarcada)

### 2. **Parallel GC (`XX:+UseParallelGC`)**

- Coleta paralela com múltiplas threads
- Boas pausas e desempenho em throughput

### 3. **G1 GC (`XX:+UseG1GC`)**

- Default no Java 9+
- Divide o heap em **regiões** menores
- Tem coletas **concurrentes** e **incrementais**
- Ideal para aplicações grandes com **baixa latência previsível**
- Permite configurar pausas máximas (`XX:MaxGCPauseMillis=200`)

### 4. **ZGC (`XX:+UseZGC`)**

- GC moderno, **de baixa latência (pausas <10ms)**, heap grande
- Trabalha com mapeamento de memória e acesso indireto
- Requer Java 11+

### 5. **Shenandoah (`XX:+UseShenandoahGC`)**

- Baixa latência, coleta concorrente de toda a heap
- Também ideal para aplicações latência-sensíveis
- Requer Java 12+

---

## 🧠 **Como o GC lida com objetos difíceis (ex: referência cruzada)?**

- A JVM não usa **contagem de referência** (ineficiente com ciclos)
- Usa **análise de gráfico de objetos** (reachability)
- Objetos que só se referenciam mutuamente, mas não têm ponte com as raízes, são coletados

---

## ⚙️ **Parâmetros comuns de tuning de GC:**

| Parâmetro | Função |
| --- | --- |
| `-Xms`, `-Xmx` | Tamanho mínimo e máximo do Heap |
| `-XX:+UseG1GC` | Ativa o G1 GC |
| `-XX:MaxGCPauseMillis` | Define objetivo de pausa |
| `-XX:+PrintGCDetails` | Mostra detalhes da coleta |
| `-Xlog:gc*` (Java 9+) | Log estruturado do GC |
| `-XX:+UseZGC` | Ativa o Z Garbage Collector |

---

## 🧠 **Exemplo prático (microserviço em Java 17):**

```bash
bash
CopiarEditar
java -Xms512m -Xmx1g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -Xlog:gc* -jar app.jar

```

---

## 🔍 **Como monitorar o GC na prática:**

- **VisualVM**, **JMC (Java Mission Control)**
- `jstat -gc <pid>`
- **Cloud observability tools**:
    - Prometheus + JMX Exporter → métricas de uso da heap, frequência de GC, tempo de pausa
    - Grafana, Datadog, Dynatrace

---

## 🚨 **Problemas comuns relacionados ao GC:**

| Problema | Causa possível |
| --- | --- |
| **OutOfMemoryError** (heap) | Heap muito pequeno ou vazamento de memória |
| **GC com pausas longas** | Old Gen muito cheio ou GC não ajustado |
| **Coleta muito frequente** | Objetos temporários demais, Eden pequeno |
| **Full GC constante** | Promover objetos cedo demais, falta de tuning |

---

## ✅ **Conclusão para entrevista**

> “O Garbage Collector do Java é o mecanismo responsável por liberar objetos não utilizados no heap. Ele divide a memória em Young e Old Generation, e realiza coletas menores frequentes e coletas maiores mais pesadas. Já trabalhei com o G1GC ajustando parâmetros como tamanho de heap e pausas máximas, e usei ferramentas como Prometheus + JMX para monitorar latência e frequência das coletas. Também atuei na análise de leaks via heap dumps e tuning para reduzir full GCs em produção.”
> 

### Qual a diferença de Thread Safe e Non Thread Safe?
