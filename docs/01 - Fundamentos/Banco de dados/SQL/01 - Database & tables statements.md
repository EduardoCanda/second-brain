·Comandos utilizados para criar, alterar e deletar banco de dados e tabelas.

**OBS** A sintaxe utilizada nos exemplos serão do SGBD **MySQL**, no entanto não muda muita muito entre outros SGBDs.

## Database statements:

**CREATE DATABASE** 
Se uma nova base de dados for necessária, então o primeiro passo é criar uma.

```sql
CREATE DATABASE database_name;
```

**SHOW DATABASES**
Em caso de querer saber quais são bases de dados no SGBD, utiliza-se o comando abaixo:

```sql
SHOW DATABASES;
```

**USE DATABASE**
Uma vez que o DB foi criado, para interagir com ele é necessário informar o SGBD qual DB utilizar.

```sql
USE database_name;
```

**DROP DATABASE**

Em caso de apagar de um DB não for mais necessário, é possível apaga-lo:

```SQL
DROP DATABASE database_name;
```

---
## Table statements:
Uma vez que o DB já foi criado e o mesmo já está em uso, agora é possível interagir com as tabelas dele.

**CREATE TABLE**
Para criar uma tabela, com suas respectivas colunas e tipagens:
```sql
CREATE TABLE book_inventory (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    publication_date DATE
);
```

**SHOW TABLES**
Mostrar a lista de tabelas que o DB utilizado possui:

```sql
SHOW TABLES;
```

**DESCRIBE**
Descrever as caracteríscticas da tabela, como suas colunas tipagens, chaves e aceite de valores nulos ou não.

```SQL
DESCRIBE book_invetory;
```

Exemplo de resposta do DESCRIBE:
```SQL
+------------------+--------------+------+-----+---------+----------------+
| Field            | Type         | Null | Key | Default | Extra          |
+------------------+--------------+------+-----+---------+----------------+
| book_id          | int          | NO   | PRI | NULL    | auto_increment |
| book_name        | varchar(255) | NO   |     | NULL    |                |
| publication_date | date         | YES  |     | NULL    |                |
+------------------+--------------+------+-----+---------+----------------+
3 rows in set (0.02 sec)
```

**ALTER**
Em caso de tem que alterar a estrutura da tabela. Seja para acrescentar uma nova coluna, remover, adicionar uma chave, índice entre outras coisa.

```SQL
ALTER TABLE book_inventory
ADD page_count INT;
```

**DROP**
Caso a tabela não seja mais necessária, é possível apaga-la.

```sql
DROP TABLE table_name;
```

---
