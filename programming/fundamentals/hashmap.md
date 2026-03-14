# HashMap

## Definição
HashMap armazena pares chave-valor com acesso médio O(1), usando função de hash.

## Por que isso importa
É estrutura central para índices em memória, caches e deduplicação.

## Exemplo de código
```java
Map<String, Pedido> pedidos = new HashMap<>();
pedidos.put("p-1", new Pedido("p-1"));
Pedido p = pedidos.get("p-1");
```

## Modelo mental
HashMap é excelente para acesso direto por chave, mas não mantém ordem natural por padrão.

## Erros comuns
- Usar chave mutável e perder consistência no mapa.
- Ignorar colisões e qualidade de hashCode/equals.
- Assumir thread safety em HashMap comum.

## Conceitos relacionados
[[Estruturas de dados]]
[[Complexidade Big-O]]
[[Thread safety]]
