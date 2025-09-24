---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Java
---
## 🧠 **Qual a diferença entre Thread-Safe e Non-Thread-Safe?**

### 🔐 **Thread-Safe (Seguro para múltiplas threads)**

> Um código ou componente é considerado thread-safe quando pode ser acessado simultaneamente por múltiplas threads sem causar corrupção de dados, comportamento imprevisível ou condições de corrida (race conditions).
> 

### ✅ Características:

- Usa mecanismos de **sincronização** (ex: `synchronized`, `Locks`, `volatile`)
- Pode usar estruturas concorrentes (`ConcurrentHashMap`, `AtomicInteger`)
- Comportamento previsível mesmo em ambiente paralelo

### 🧠 Exemplo:

```java
public synchronized void increment() {
    contador++;
}

```

Ou usando estruturas prontas:

```java
AtomicInteger contador = new AtomicInteger(0);
contador.incrementAndGet();
```

---

### ⚠️ **Non-Thread-Safe (Não seguro para múltiplas threads)**

> Um código não-thread-safe pode falhar, gerar valores inconsistentes ou até corromper memória quando acessado por múltiplas threads simultaneamente sem controle adequado.
> 

### ❌ Riscos:

- Race conditions
- Dados inconsistentes ou corrompidos
- Erros intermitentes difíceis de reproduzir

### 🧠 Exemplo clássico:

```java
int contador = 0;

public void increment() {
    contador++;  // operação não atômica: leitura + incremento + escrita
}

```

Se duas threads chamarem `increment()` ao mesmo tempo, podem sobrescrever o valor uma da outra.

---

## 📦 **Exemplos práticos em bibliotecas Java:**

| Classe | Thread-Safe? |
| --- | --- |
| `Vector` | ✅ Sim |
| `ArrayList` | ❌ Não |
| `StringBuffer` | ✅ Sim |
| `StringBuilder` | ❌ Não |
| `HashMap` | ❌ Não |
| `ConcurrentHashMap` | ✅ Sim |

---

## 🧠 **Como tornar algo thread-safe:**

1. Usar **síncronos** (`synchronized`, `ReentrantLock`, `Semaphore`)
2. Usar **estruturas de dados concorrentes**
3. Usar **variáveis atômicas** (`AtomicInteger`, `AtomicReference`)
4. Minimizar o compartilhamento de estado entre threads

---

## ✅ **Conclusão para entrevista**

> “Thread-safe significa que o código pode ser acessado simultaneamente por múltiplas threads sem comprometer sua integridade. Já non-thread-safe pode gerar race conditions e corrupção de dados. Em Java, utilizo técnicas como sincronização, classes do pacote java.util.concurrent e estruturas atômicas para garantir segurança em ambientes concorrentes, como em serviços de processamento paralelo ou manipulação de cache.”
> 