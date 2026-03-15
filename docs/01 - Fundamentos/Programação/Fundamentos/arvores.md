# Árvores

## Definição
Árvore é uma estrutura hierárquica de nós com relação pai-filho, sem ciclos.

## Por que isso importa
Representa bem índices, hierarquias organizacionais, ASTs e estruturas de busca.

## Exemplo de código
```java
class Node {
    int valor;
    Node esq;
    Node dir;
}
```

## Modelo mental
Árvores equilibradas mantêm operações eficientes; árvores degeneradas se aproximam de lista encadeada.

## Erros comuns
- Ignorar balanceamento em casos de inserção ordenada.
- Confundir travessia pré, em e pós-ordem.
- Não tratar nós nulos nos limites da recursão.

## Conceitos relacionados
[[Recursão]]
[[Grafos]]
[[Estruturas de dados]]
