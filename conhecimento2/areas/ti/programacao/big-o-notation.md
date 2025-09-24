---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
---
## 🧠 **O que é Big O Notation?**

**Big O Notation** é uma forma de **expressar o comportamento de desempenho de um algoritmo** em termos de:

- **Tempo de execução**
- **Consumo de memória**
- À medida que a **entrada (n)** cresce

> Em outras palavras, é uma forma matemática de descrever a complexidade de um algoritmo, focando no pior caso (worst-case).
> 

---

## 🔢 **Por que usamos Big O?**

- Para comparar **eficiência relativa** entre diferentes algoritmos
- Para prever **como um algoritmo escala**
- Para evitar **soluções que funcionam apenas para pequenos dados**

---

## 📊 **Principais categorias de Big O:**

| Big O | Nome | Descrição breve | Exemplo prático |
| --- | --- | --- | --- |
| **O(1)** | Constante | Sempre leva o mesmo tempo, independente do tamanho | Acesso direto em array: `array[5]` |
| **O(log n)** | Logarítmica | Divide o problema pela metade a cada passo | Binary Search |
| **O(n)** | Linear | Cresce proporcionalmente ao tamanho da entrada | Loop simples em array |
| **O(n log n)** | Linearítmica | Cresce um pouco mais que linear | Merge Sort, Quick Sort (caso médio) |
| **O(n²)** | Quadrática | Cresce exponencialmente com pares de elementos | Bubble Sort, dois loops aninhados |
| **O(2ⁿ)** | Exponencial | Cresce muito rápido, inviável para grandes entradas | Algoritmo de força bruta em recursão |
| **O(n!)** | Fatorial | Usado em permutações brutais | Algoritmo de todas as combinações possíveis |

---

## 🧠 **Exemplo prático:**

```java
java
CopiarEditar
// O(n)
for (int i = 0; i < n; i++) {
    System.out.println(i);
}

// O(n²)
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        System.out.println(i + "," + j);
    }
}

```

---

## 📌 **O que Big O ignora?**

- Constantes (ex: `O(2n)` → `O(n)`)
- Fatores baixos que **não impactam a escalabilidade**
- Foco é no **crescimento assintótico**

🧠 Por isso dizemos que **Big O mede escalabilidade, não tempo exato de execução.**

---

## ⚠️ **Quando Big O é importante na prática:**

- Escolher algoritmo de ordenação ou busca
- Projetar estruturas de dados eficientes (ex: usar `HashMap` em vez de `List`)
- Analisar tempo de resposta com grandes volumes (ex: crédito PJ com histórico longo)
- Avaliar impacto de crescimento da base de clientes

---

## ✅ **Conclusão para entrevista**

> “Big O Notation é uma forma de descrever a complexidade de tempo ou espaço de um algoritmo com base no tamanho da entrada. Uso essa métrica para comparar algoritmos e prever como vão escalar. Por exemplo, em pipelines que processam grandes volumes de dados de clientes PJ, evito loops aninhados O(n²) e privilegio soluções O(n log n) ou O(n), como ordenações eficientes e buscas com índice.”
> 

### O que são ponteiros em programação?
