# Estruturas de dados

## Definição
Estruturas de dados organizam informações para permitir operações eficientes de leitura, escrita, busca e ordenação.

## Por que isso importa
Escolha errada de estrutura pode custar latência, memória e dinheiro em cloud.

## Exemplo de código
```java
List<String> lista = new ArrayList<>();
Set<String> conjunto = new HashSet<>();
Map<String, Integer> mapa = new HashMap<>();
```

## Modelo mental
Comece pelas operações críticas do caso de uso (lookup, inserção, ordenação) e então escolha a estrutura.

## Erros comuns
- Escolher estrutura por hábito, não por necessidade.
- Ignorar custo de memória.
- Trocar estrutura sem medir impacto.

## Conceitos relacionados
[[Complexidade Big-O]]
[[HashMap]]
[[Árvores]]
