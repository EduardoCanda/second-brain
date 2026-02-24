**SGBD** (Sistema Gerenciador de Banco de Dados), também chamado de **DBMS** (Database Management System), é o software que faz a ponte entre a aplicação e o banco.

Com um SGBD você consegue:
- modelar e criar estruturas (schemas, tabelas, índices, coleções);
- inserir, consultar, alterar e remover dados;
- controlar concorrência (várias pessoas/processos usando ao mesmo tempo);
- fazer backup, restauração, replicação e monitoramento.

## Exemplos de SGBDs e diferenças

### Relacionais (SQL)
- **PostgreSQL**: muito completo, excelente suporte a SQL, extensível, forte para sistemas transacionais e analytics leves.
- **MySQL / MariaDB**: populares, simples de operar no início, muito usados em aplicações web.
- **SQL Server**: ecossistema forte em ambientes Microsoft, boas ferramentas corporativas.
- **Oracle Database**: robusto para grandes ambientes enterprise, foco em alta disponibilidade e recursos avançados.

### Não relacionais (NoSQL)
- **MongoDB (documento)**: armazena JSON/BSON, esquema flexível para dados que mudam bastante.
- **Redis (chave-valor, em memória)**: baixíssima latência, muito usado para cache, sessão e filas simples.
- **Cassandra (colunar distribuído)**: escalabilidade horizontal alta e grande throughput de escrita.
- **Neo4j (grafo)**: ideal para relacionamentos complexos (recomendação, fraude, redes sociais).

## Como o usuário interage com um SGBD?
- Em bancos relacionais, o principal é **SQL**.
- Em NoSQL, a consulta pode ser feita por API própria, linguagem específica ou SQL-like (depende da ferramenta).

> Em resumo: banco de dados é onde os dados vivem; SGBD é o motor que organiza, protege e entrega esses dados para as aplicações.
