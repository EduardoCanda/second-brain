## Memória Grão (Heap)

A **memória heap** é a área usada para alocação dinâmica de memória durante a execução do programa.

---

## Características

- Cresce e diminui conforme a aplicação pede memória
- Gerenciada por funções como `malloc`, `calloc`, `realloc` e `free`
- Compartilhada entre threads do mesmo processo
- Mais flexível, porém geralmente mais lenta que stack

---

## Quando é usada

Use heap quando:
- O tamanho dos dados só é conhecido em tempo de execução
- Os dados precisam viver além do escopo de uma função
- Estruturas grandes não cabem na stack

---

## Cuidados comuns

- **Vazamento de memória**: aloca e não libera
- **Double free**: liberar duas vezes o mesmo ponteiro
- **Use-after-free**: acessar memória já liberada
- **Fragmentação**: várias alocações pequenas degradam o uso da memória

---

## Regra prática

- Se você alocou no heap, você deve definir claramente **quem libera**.
