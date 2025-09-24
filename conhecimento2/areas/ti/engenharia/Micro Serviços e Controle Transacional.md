## 🔗 **Qual é a relação entre Microsserviços e Controle Transacional?**

Em um sistema **monolítico**, transações **ACID** (Atômicas, Consistentes, Isoladas e Duráveis) podem ser facilmente aplicadas usando um banco relacional centralizado.

Mas em uma arquitetura de **microsserviços**, **cada serviço é autônomo e possui seu próprio banco de dados**. Isso quebra a possibilidade de uma **transação distribuída tradicional**, pois:

- Os serviços estão em processos diferentes
- Os bancos são independentes
- Cada chamada entre serviços é feita via rede (sujeita a falhas)

> Ou seja, não existe mais uma "transação única" envolvendo múltiplos serviços com commit coordenado.
> 

---

## 🧩 **Implicações diretas dessa separação:**

### ❌ O que não funciona:

- `@Transactional` entre dois serviços
- `2PC` (Two-Phase Commit) → complexo, lento e pouco escalável
- Locks entre bases diferentes

---

## ✅ **Soluções para controle transacional em microsserviços:**

### 🔸 1. **Isolamento transacional por serviço**

Cada microsserviço deve:

- Gerenciar **suas transações localmente**
- **Validar seus dados antes de prosseguir**
- Garantir **consistência eventual**, e não imediata

---

### 🔸 2. **Uso do Saga Pattern**

Como já explicamos anteriormente, o **Saga Pattern** resolve transações distribuídas com:

- **Múltiplas etapas locais**
- E **ações compensatórias** caso algum passo falhe

Esse é o padrão mais comum para garantir consistência de negócio **sem depender de transações ACID globais**.

---

### 🔸 3. **Design de domínios com consistência eventual**

- Aceitar que **alguns dados estejam temporariamente inconsistentes**
- Projetar a aplicação com **idempotência, tolerância a falhas e retrabalho**
- Exemplo: exibir um status “pendente” até a sincronização entre serviços se completar

---

### 🔸 4. **Auditoria e rastreabilidade**

- Em vez de rollback, você registra tudo e corrige via **eventos compensatórios**
- Usa **Event Sourcing**, **logs de domínio** ou **mensageria confiável** (Kafka, SQS com DLQ, etc.)

---

## 🧠 **Exemplo bancário realista**

Um cliente PJ solicita um crédito via app:

1. Serviço A → Cria o pedido no sistema de crédito
2. Serviço B → Valida o cliente na área de compliance
3. Serviço C → Consulta o score externo
4. Serviço D → Atualiza o saldo em conta

Cada um desses serviços executa sua parte localmente. Se o passo 3 falhar, você precisa **compensar as ações anteriores**, por exemplo:

- Cancelar o pedido
- Reverter o status no sistema de compliance

Esse é um **caso típico de transação distribuída resolvida via Saga Pattern (coreografado ou orquestrado).**

---

## 📊 **Resumo: Microsserviços vs Transações**

| Aspecto | Monólito / ACID | Microsserviços |
| --- | --- | --- |
| Tipo de transação | Única, atômica (`BEGIN/COMMIT`) | Várias locais, coordenadas por lógica |
| Garantia | Consistência imediata | Consistência eventual |
| Isolamento entre serviços | Baixo | Alto |
| Comunicação | Em memória | Via rede (REST, eventos, etc.) |
| Solução recomendada | Transação tradicional | Saga Pattern / compensações |

---

## ✅ **Conclusão para entrevista**

> “Em microsserviços, o controle transacional precisa ser repensado. Como cada serviço possui seu próprio banco, não dá para usar transações ACID tradicionais entre eles. A solução é adotar padrões como o Saga Pattern, isolar transações por serviço, trabalhar com consistência eventual e projetar sistemas resilientes a falhas. Já usei esse modelo em processos críticos como abertura de conta PJ e aprovação de crédito, usando coreografia de eventos com compensações e rastreamento completo por ID de correlação.”