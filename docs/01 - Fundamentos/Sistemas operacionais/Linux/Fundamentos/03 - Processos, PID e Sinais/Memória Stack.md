## Memória Stack

A **stack** é a área de memória usada para chamadas de função e variáveis locais.

---

## Características

- Organização em pilha (LIFO: Last In, First Out)
- Alocação e desalocação automáticas
- Cada thread possui sua própria stack
- Muito rápida para acesso

---

## O que normalmente fica na stack

- Endereço de retorno da função
- Parâmetros de função
- Variáveis locais
- Contexto mínimo de execução

---

## Limitações

- Tamanho limitado (stack size)
- Recursão profunda pode causar **stack overflow**
- Objetos muito grandes não devem ficar na stack

---

## Regra prática

- Variáveis pequenas e temporárias: stack
- Estruturas grandes ou vida longa: heap
