---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---
## 🧠 **O que é CQRS (Command Query Responsibility Segregation)?**

**CQRS** é um padrão arquitetural que propõe **separar os modelos de leitura (Query)** dos **modelos de escrita (Command)** em uma aplicação.

> Em vez de usar o mesmo modelo/dados/código para ler e escrever, você separa a responsabilidade de leitura e escrita para poder otimizar cada uma individualmente.
> 

---

## 🎯 **Por que usar CQRS?**

Em sistemas complexos ou de alta escala:

- Os requisitos para **consultar dados** são muito diferentes dos requisitos para **modificar dados**
- Você quer **escapar da complexidade dos modelos CRUD monolíticos**
- Quer **otimizar leitura e escrita separadamente**, inclusive com **bases de dados distintas**

---

## 🧩 **Como funciona na prática**

### 🔹 **Command (escrita)**

- Responsável por **modificar o estado do sistema**
- Pode envolver regras de negócio, validações, side effects
- Não retorna dados diretamente (só `success/failure`)
- Exemplo: criar cliente, aprovar crédito, atualizar limite

### 🔹 **Query (leitura)**

- Responsável apenas por **consultar dados**
- Pode usar **modelos otimizados para leitura** (ex: joins, projections)
- Não modifica nada
- Exemplo: listar extrato, buscar limite aprovado, consultar histórico

---

## 🧠 **Exemplo bancário prático (PJ)**

1. Um analista aprova um novo limite para uma empresa:
    - O sistema processa o **Command** `AprovarLimiteCommand`
    - Isso dispara eventos que atualizam outros sistemas
2. O gerente acessa o dashboard e vê:
    - O valor atualizado via uma **Query** específica, otimizada para leitura
    - Talvez essa leitura venha de outro banco (ex: Redis, Elasticsearch)

---

## 🔧 **Tecnologias que ajudam na aplicação de CQRS**

- **Command Side**:
    - Modelos de domínio ricos (DDD)
    - Event Sourcing (opcional)
    - Filas, eventos (SQS, Kafka)
- **Query Side**:
    - Projeções otimizadas
    - Banco separado para leitura (Read Replicas, ElasticSearch, Redis)
    - APIs especializadas para consulta (ex: GraphQL, REST)

---

## ⚠️ **Vantagens e Desvantagens**

| Vantagens | Desvantagens |
| --- | --- |
| Alta performance em leitura e escrita | Aumento da complexidade arquitetural |
| Escalabilidade independente | Sincronização entre modelos (eventual) |
| Separação clara de responsabilidades | Requer domínio de mensagens/eventos |
| Permite consistência eventual | Debug e rastreamento mais complexos |

---

## 🔄 **CQRS ≠ CRUD**

| CRUD tradicional | CQRS |
| --- | --- |
| Um modelo para tudo | Dois modelos separados |
| Leitura e escrita acopladas | Leitura e escrita desacopladas |
| Simples, porém limitado | Complexo, mas flexível e escalável |
| Difícil de evoluir | Mais adaptável a mudanças |

---

## ✅ **Conclusão para entrevista**

> “CQRS é um padrão onde separamos os modelos de leitura e escrita para permitir escalabilidade, performance e flexibilidade. Já utilizei esse padrão em sistemas bancários, separando comandos como abertura de conta e aprovação de crédito das queries utilizadas por portais e dashboards. Essa separação nos permitiu otimizar consultas com Redis e Elasticsearch, mantendo a complexidade da regra de negócio isolada na camada de comando.”
> 


