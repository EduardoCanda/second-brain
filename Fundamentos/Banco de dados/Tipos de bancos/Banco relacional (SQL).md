Bancos relacionais guardam os dados de maneira estrutura. Isso é, requerem um padrão de inserção de dados.

Por exemplo, em uma tabela de **clientes** os dados consistem em cliente_id, nome, data_nascimento, cpf e endereco. Quando novos clientes entrarem nessa tabela, os dados deverão seguir este padrão de cadastro.

Pelos dados serem guardados em **tabelas**, os dados são estruturados em **linhas** e **colunas**. Relaçãoes entre duas ou mais tabelas podem ser criadas, a partir de uma coluna **chave**.

Um exemplo seria relacionar a tabela de **cliente** com a tabela de **pedidos**. A tabela de pedidos teria o cliente_id para relacionar o pedido ao cliente em questão.

---
### Chaves primárias e estrangeiras:

**Chave primária:**
Chave primária é usada para garantir que o dado coletado é único na tabela. Podemos pensar em uma chave primária como um CPF do Brasil, onde cada pessoa do país possui um número único. Desse ponto de vista, é o CPF que diferencia uma pessoa da outra, por mais que possuam o mesmo nome por exemplo.

**Chave estrangeira:**
Chaves estrangeiras é uma coluna (ou colunas)de uma tabela que existem em outras tabelas do banco de dados. Por este motivo, são comumente utilizadas para correlacionar uma tabela com outra.