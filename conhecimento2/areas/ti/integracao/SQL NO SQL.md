---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
categoria: armazenamento
---
## 🧠 **Como escolher entre banco relacional e não relacional?**

A escolha entre **banco relacional (SQL)** e **não relacional (NoSQL)** deve ser feita com base em **requisitos de dados, performance, consistência, flexibilidade e escalabilidade** da sua aplicação.

---

## 🔹 **Use banco relacional (SQL)** quando:

### ✅ **Você precisa de:**

- **Transações [[ACID E BASE|ACID]]** (consistência forte e integridade garantida)
- **Relacionamentos complexos** entre tabelas (JOINs, constraints, normalização)
- **Schemas rígidos** e bem definidos (ex: dados regulatórios, contábeis, bancários)
- **Consultas analíticas complexas** (com `JOIN`, `GROUP BY`, `ORDER BY`)
- **Validações e integridade referencial nativas** no banco

### 🧠 **Exemplos de uso:**

- Sistema de **transações bancárias**
- Módulo de **cadastro PJ com vínculos entre sócios, documentos, domicílio fiscal**
- Aplicações que **exigem rollback confiável** e precisam de controle transacional

### 💡 Tecnologias:

- PostgreSQL, MySQL, Oracle, SQL Server, Amazon RDS, Aurora (modo relacional)

---

## 🔸 **Use banco não relacional (NoSQL)** quando:

### ✅ **Você precisa de:**

- **Alta escalabilidade horizontal** (sharding, replicação)
- **Alta disponibilidade e tolerância a falhas**
- **Performance com leitura/gravação rápida**, sem necessidade de JOINs
- **Modelagem flexível** (ex: JSON, documentos aninhados, esquemas dinâmicos)
- **Consistência eventual é aceitável**

### 🧠 **Exemplos de uso:**

- Sistemas de **log, telemetria, eventos**
- **Catálogo de produtos PJ** com estrutura variada por segmento
- **Histórico de alterações**, onde o foco é escalabilidade e não estrutura rígida
- **Caches** ou **sessões de usuário**

### 💡 Tecnologias:

- DynamoDB (chave-valor / documento)
- MongoDB (documentos JSON)
- Cassandra (grandes volumes com alta escrita)
- Redis (chave-valor em memória)

---

## ⚖️ **Tabela comparativa direta:**

| Critério                    | Relacional (SQL)            | Não Relacional (NoSQL)                        |
| --------------------------- | --------------------------- | --------------------------------------------- |
| **Consistência**            | Forte (ACID)                | Eventual ([[ACID E BASE\|BASE]])              |
| **Escalabilidade**          | Vertical (mais CPU/memória) | Horizontal (sharding/replicação)              |
| **Schema**                  | Fixo, estruturado           | Flexível, dinâmico                            |
| **Transações complexas**    | Suporte completo            | Limitado (com exceções como DynamoDB com TXs) |
| **Relacionamento de dados** | JOINs, Foreign Keys         | Evitado, modelado por agregação               |
| **Performance**             | Boa em leitura complexa     | Excelente em leitura simples e massiva        |
| **Tamanho de dado**         | Moderado (até GBs-TBs)      | Massivo (multi-TB/PB, dados distribuídos)     |

---

## 🔀 **Modelo híbrido (Polyglot Persistence)**

Muitas arquiteturas modernas **combinam ambos** os modelos — usando **relacional para dados críticos** e **NoSQL para performance ou flexibilidade**.

🧠 Exemplo real:

> Aplicação bancária PJ usa PostgreSQL para cadastros e controle financeiro, e DynamoDB para armazenar eventos de auditoria, histórico de análises e cache de respostas externas.
> 

---

## ✅ **Conclusão para entrevista**

> “A decisão entre SQL e NoSQL depende dos requisitos da aplicação. Eu escolho banco relacional quando preciso de consistência forte, integridade referencial e transações robustas, como em sistemas financeiros. Já optei por NoSQL quando priorizei escalabilidade, flexibilidade e desempenho em grandes volumes de dados com schema dinâmico, como em históricos de logs e catálogos variáveis. Também adoto o modelo híbrido quando diferentes domínios exigem abordagens distintas.”
> 

