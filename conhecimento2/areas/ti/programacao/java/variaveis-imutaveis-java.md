---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Java
---
## 🧠 **O que é uma variável imutável?**

Uma **variável imutável** é aquela **cujo valor não pode ser alterado depois de atribuído**.

> Em Java, uma variável imutável é uma referência constante — ou seja, uma vez atribuída, não pode apontar para outro valor ou objeto (se for final).
> 
> 
> Mas atenção: **isso não significa que o objeto referenciado seja imutável!**
> 

---

## 🔍 **Imutabilidade em dois níveis:**

### 🔸 1. **Variável imutável (final)**

Declaração com `final`:

```java
final int x = 10;
x = 20; // ❌ erro de compilação
```

> Aqui, a variável x é imutável, pois não pode mais ser reatribuída.
> 

---

### 🔸 2. **Objeto imutável (estado imutável)**

Um **objeto é imutável** quando **nenhum de seus campos pode ser alterado após a criação**. Isso envolve:

- Campos `final`
- Sem métodos `set`
- Definido como `final class` (opcional, mas seguro)
- Sem exposição de referências mutáveis

### 🧠 Exemplo: classe imutável em Java

```java
public final class Cliente {
    private final String nome;
    private final int idade;

    public Cliente(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}

```

---

## 📌 **Por que variáveis e objetos imutáveis são importantes?**

### ✅ Vantagens:

- **Thread-safe por definição**: sem necessidade de sincronização
- **Facilitam debugging e testes**
- **Melhor compatibilidade com programação funcional**
- **Reduzem efeitos colaterais**
- Evitam bugs por mutações não controladas

---

## 💡 **Exemplos comuns em Java:**

| Objeto | Imutável? |
| --- | --- |
| `String` | ✅ Sim |
| `Integer`, `Long`, `Boolean` | ✅ Sim |
| `ArrayList`, `HashMap` | ❌ Não (mutáveis) |
| `List.of(...)`, `Map.of(...)` | ✅ Sim (coleções imutáveis) |

---

## 🔐 **Imutabilidade e concorrência (Thread Safety)**

Em sistemas multithread, variáveis imutáveis **evitam race conditions**, pois **não podem ser modificadas**.

Isso permite **compartilhamento seguro entre threads** sem bloqueios.

🧠 Exemplo:

> Uma Map<String, Config> imutável compartilhada entre threads de leitura de API.
> 

---

## ✅ **Conclusão para entrevista**

> “Uma variável imutável é aquela cujo valor não pode ser alterado após atribuição. Em Java, usamos final para garantir isso. Já um objeto imutável tem todos os seus campos finais e não oferece meios de modificação após construção. Imutabilidade é essencial para garantir segurança em ambientes multithread e reduzir efeitos colaterais. Em aplicações críticas, já usei objetos imutáveis para representar dados de entrada, configurações e resultados intermediários, promovendo consistência e performance.”
> 

### Qual a diferença entre CI e CD?
