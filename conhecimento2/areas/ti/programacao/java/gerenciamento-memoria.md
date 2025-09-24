---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
aliases:
  - Java
cssclasses:
---
## 🧠 **Como funciona a memória no Java?**

A **memória no Java** é gerenciada automaticamente pela **Java Virtual Machine (JVM)** e é dividida em **áreas lógicas** que suportam a execução dos programas. A principal delas é o **Heap**, onde ocorre o gerenciamento de objetos e coleta de lixo (GC), mas não é a única.

Vamos detalhar as principais áreas:

---

## 📦 **Divisões da memória da JVM:**

### 🔹 1. **Heap Memory**

> Área principal onde os objetos são alocados dinamicamente durante a execução.
> 

### Subdivisões:

| Região | O que armazena |
| --- | --- |
| **Young Generation (Eden + Survivor)** | Objetos recém-criados (de curta vida) |
| **Old Generation (Tenured)** | Objetos que sobreviveram múltiplos GCs |

### ✅ Características:

- É o foco do **Garbage Collector (GC)**
- **Objetos jovens são coletados com frequência** (minor GC)
- Objetos promovidos para o **Old Gen** são coletados com menos frequência (major GC)
- Tamanho controlado por parâmetros como `Xms`, `Xmx`

🧠 Exemplo:

> Requisições HTTP criam objetos temporários → Eden
> 
> 
> Objetos de configuração que vivem durante toda a aplicação → Old Gen
> 
---

### 🔹 2. **Metaspace** (antes chamado **PermGen**)

> Armazena informações da estrutura de classes (bytecode, métodos, metadados).
> 
- Substituiu o antigo PermGen desde o Java 8
- Cresce dinamicamente por padrão (configurável com `XX:MaxMetaspaceSize`)
- Se você carrega muitas classes dinamicamente (ex: frameworks como Spring, reflection), essa região pode crescer bastante

---

### 🔹 3. **Stack Memory (Thread Stack)**

> Armazena frames de execução de métodos, variáveis locais e chamadas de função.
> 
- Cada **thread** tem sua própria stack
- Armazena **variáveis primitivas** e referências a objetos (os objetos em si ficam no Heap)
- Controlado por `Xss` (ex: `Xss512k`)

🧠 StackOverflowError ocorre quando a stack da thread estoura — exemplo clássico: recursão sem fim.

---

### 🔹 4. **Native Memory / Direct Memory**

> Usada para:
> 
- Buffers diretos (`ByteBuffer.allocateDirect`)
- Bibliotecas JNI (Java Native Interface)
- Algumas estruturas internas da JVM (ex: GC, JIT)
- Não está visível diretamente no heap, mas consome memória total do processo
- Monitorável via ferramentas como `jcmd`, `jmap`, ou `NativeMemoryTracking`

---

### 🔹 5. **Code Cache**

> Armazena código compilado JIT (Just-In-Time) da JVM
> 
- Garante performance ao evitar recompilação de métodos "quentes"
- Pode causar lentidão se o limite for atingido

---

## 🔧 **Parâmetros comuns de ajuste de memória:**

| Parâmetro | Descrição |
| --- | --- |
| `-Xms` | Tamanho inicial da Heap |
| `-Xmx` | Tamanho máximo da Heap |
| `-Xss` | Tamanho da stack por thread |
| `-XX:MaxMetaspaceSize` | Limite do Metaspace |
| `-XX:+UseG1GC` | Define o Garbage Collector (ex: G1, ZGC) |

---

## 🧠 **Exemplo de tuning para microserviço (Java 17):**

```bash
java -Xms512m -Xmx1024m -Xss512k -XX:+UseG1GC -XX:MaxMetaspaceSize=128m -jar app.jar

```

---

## 🔍 **Ferramentas para analisar a memória:**

- **VisualVM / JConsole**: análise em tempo real de heap, GC, threads
- **jmap / jstack / jcmd**: análise de heap dump e threads
- **Heap dumps**: usados para investigar memory leaks
- **Prometheus + JMX Exporter + Grafana**: métricas de heap, GC e threads em produção

---

## 🔥 **Cenários comuns em entrevista:**

### ❓ *Como identificar um memory leak em Java?*

> Monitorar crescimento contínuo da heap + frequência de GC + geração de heap dump → analisar objetos que não estão sendo coletados
> 

### ❓ *Qual a diferença entre StackOverflowError e OutOfMemoryError?*

> StackOverflow ocorre na stack (recursão excessiva);
> 
> 
> OOM ocorre geralmente no **Heap ou Metaspace**
> 

---

## ✅ **Conclusão para entrevista**

> “A memória no Java é dividida entre o Heap (objetos), Stack (variáveis e chamadas de métodos), Metaspace (informações de classe), e áreas nativas. O Heap é segmentado em Young e Old Generation para otimizar coleta de lixo. Já fiz tuning em aplicações críticas ajustando heap, escolhendo o GC adequado (como G1), e configurando o Metaspace para evitar OutOfMemoryError em ambientes Spring. Também uso ferramentas como VisualVM, jmap e Prometheus para análise contínua da saúde de memória em produção.”
> 

### O que é o Garbage Collector (GC) no Java?

