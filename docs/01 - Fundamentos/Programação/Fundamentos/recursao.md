# Recursão

## Definição
Recursão é quando uma função chama a si mesma para resolver um problema em subproblemas menores.

## Por que isso importa
É útil para árvores, grafos e problemas naturalmente hierárquicos.

## Exemplo de código
```java
int fatorial(int n) {
    if (n <= 1) return 1;
    return n * fatorial(n - 1);
}
```

## Modelo mental
Garanta caso base claro e progresso em direção a ele. Sem isso, você terá stack overflow.

## Erros comuns
- Esquecer caso base.
- Recursão profunda sem considerar limite de stack.
- Usar recursão onde iteração é mais simples e legível.

## Conceitos relacionados
[[Call stack]]
[[Árvores]]
[[Grafos]]
