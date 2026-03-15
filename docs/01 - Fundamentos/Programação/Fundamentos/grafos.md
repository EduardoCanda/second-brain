# Grafos

## Definição
Grafo modela entidades (nós) e conexões (arestas), podendo ser direcionado ou não.

## Por que isso importa
É base para roteamento, dependências entre serviços e análise de relacionamentos complexos.

## Exemplo de código
```java
Map<String, List<String>> grafo = Map.of(
    "api", List.of("auth", "billing"),
    "billing", List.of("db")
);
```

## Modelo mental
Quando o problema envolve relações em rede e caminhos, pense em grafo antes de pensar em tabela isolada.

## Erros comuns
- Modelar grafo como lista linear e perder semântica.
- Ignorar ciclos em dependências.
- Não definir direção das arestas corretamente.

## Conceitos relacionados
[[Árvores]]
[[Recursão]]
[[Sistemas distribuídos]]
