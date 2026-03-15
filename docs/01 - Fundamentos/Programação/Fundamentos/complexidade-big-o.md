# Complexidade Big-O

## Definição
Big-O descreve como custo de tempo ou memória cresce com o tamanho da entrada.

## Por que isso importa
Ajuda a prever impacto de escala e a escolher algoritmos/estruturas adequadas para produção.

## Exemplo de código
```java
// O(n): busca linear
boolean contem(List<Integer> nums, int alvo) {
    for (int n : nums) if (n == alvo) return true;
    return false;
}
```

## Modelo mental
Não busque micro-otimização cedo. Use Big-O para evitar decisões que explodem quando o volume aumenta.

## Erros comuns
- Ignorar constantes e contexto real de dados.
- Comparar algoritmos sem medir dados reais.
- Achar que O(1) sempre é mais rápido na prática.

## Conceitos relacionados
[[Estruturas de dados]]
[[HashMap]]
[[Recursão]]
