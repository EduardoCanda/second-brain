Bancos não relacionais (**NoSQL**) não exigem o mesmo formato rígido de esquema dos relacionais.

## Principais modelos
- **Documento** (ex.: MongoDB)
- **Chave-valor** (ex.: Redis)
- **Colunar** (ex.: Cassandra)
- **Grafo** (ex.: Neo4j)

Exemplo de documento:
```json
{
  "_id": "4556712cd2b2397ce1b47661",
  "name": { "first": "Thomas", "last": "Anderson" },
  "date_of_birth": "1964-09-02",
  "occupation": ["The One"],
  "steps_taken": 4738947387743977493
}
```

## Quando escolher NoSQL
- Estrutura de dados muda com frequência.
- É necessário escalar horizontalmente com facilidade.
- O foco é throughput alto e baixa latência em casos específicos.
- Nem toda consulta exige relacionamentos complexos entre entidades.

## NoSQL em arquitetura de alto vs baixo throughput

### Baixo throughput
- NoSQL também funciona, mas pode ser excesso de complexidade se SQL já atende.

### Alto throughput
- Geralmente brilha em cenários como:
  - eventos e telemetria em grande volume;
  - dados semi-estruturados;
  - sessões, carrinho, feed, catálogo, ranking.
- Estratégias comuns:
  - particionamento por chave;
  - replicação distribuída;
  - consistência eventual (dependendo do caso de uso).

## Ponto de atenção
NoSQL **não significa** “sem consistência” e SQL **não significa** “sem escala”.
A escolha depende do tipo de problema, requisitos de consistência, volume e padrão de acesso.
