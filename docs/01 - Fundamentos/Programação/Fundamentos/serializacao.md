# Serialização

## Definição
Serialização converte objetos para formatos transferíveis (JSON, Avro, Protobuf) e desserialização faz o caminho inverso.

## Por que isso importa
É essencial para APIs, filas e persistência de dados estruturados.

## Exemplo de código
```java
ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(Map.of("id", 10, "status", "OK"));
```

## Modelo mental
Escolha formato e esquema considerando compatibilidade, performance e legibilidade operacional.

## Erros comuns
- Quebrar compatibilidade removendo campos usados por clientes antigos.
- Confiar em defaults implícitos sem schema claro.
- Ignorar custo de serializar payloads grandes.

## Conceitos relacionados
[Contratos de API](contratos-de-api.md)
[Programação orientada a eventos](programacao-orientada-a-eventos.md)
[Cache](../../Banco%20de%20dados/Cache.md)
