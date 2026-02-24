Bancos relacionais guardam dados de forma **estruturada**, com esquema definido (colunas, tipos e regras).

## Como funcionam
- Dados ficam em **tabelas** (linhas e colunas).
- Relações entre tabelas são feitas por **chaves**.
- Suporte forte a **ACID** (atomicidade, consistência, isolamento e durabilidade).

Exemplo: tabela `clientes` com `cliente_id`, `nome`, `data_nascimento`, `cpf` e `endereco`.

## Chaves primárias e estrangeiras

**Chave primária (PK)**
- Identifica um registro de forma única.
- Ex.: `cliente_id`.

**Chave estrangeira (FK)**
- Coluna que referencia a PK de outra tabela.
- Ex.: `pedidos.cliente_id` aponta para `clientes.cliente_id`.

## Quando escolher SQL
- Regras de negócio rígidas e dados consistentes são prioridade.
- Você precisa de consultas complexas com `JOIN`, agregações e relatórios.
- Transações são críticas (pagamentos, pedidos, saldo, estoque).

## SQL em arquitetura de alto vs baixo throughput

### Baixo throughput
- Um único banco relacional bem configurado costuma resolver.
- Índices e modelagem adequada já entregam ótimo resultado.

### Alto throughput
- Comece com otimizações: índices, particionamento, tuning de queries.
- Escale com:
  - **replicação de leitura** (read replicas);
  - **sharding** (quando necessário);
  - separação de carga de leitura/escrita;
  - uso de **cache** para aliviar queries repetidas.

> Regra prática: use relacional como base quando consistência é essencial; escale gradualmente sem abandonar o modelo cedo demais.
