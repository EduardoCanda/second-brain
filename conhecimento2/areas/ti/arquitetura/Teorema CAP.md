---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---
## 🧠 **O que é o Teorema CAP?**

O **Teorema CAP**, formulado por Eric Brewer, afirma que **em qualquer sistema distribuído, você só pode garantir plenamente dois dos três atributos a seguir, ao mesmo tempo**:

| Letra | Significado |
| --- | --- |
| **C** | **Consistência** (*Consistency*) |
| **A** | **Disponibilidade** (*Availability*) |
| **P** | **Tolerância à Partição** (*Partition Tolerance*) |

---

### 🧩 **Definindo cada pilar:**

### 🔸 **Consistência (C)**

Todos os nós veem os **mesmos dados ao mesmo tempo**.

> Após uma gravação, todas as leituras subsequentes retornam o valor atualizado.
> 

### 🔸 **Disponibilidade (A)**

Todo pedido recebe uma **resposta válida**, mesmo que nem todos os nós estejam sincronizados.

> O sistema não "trava" ou retorna erro — responde com o que tem.
> 

### 🔸 **Tolerância à Partição (P)**

O sistema continua operando mesmo com **falhas de comunicação entre nós**.

> Ou seja, ele resiste a partições de rede, que são inevitáveis em ambientes distribuídos.
> 

---

## ⚠️ **O ponto-chave:**

> Em presença de uma falha de rede (P), o sistema deve escolher entre:
> 
- Manter **Consistência**, e abrir mão da Disponibilidade (esperar sincronizar)
- Manter **Disponibilidade**, e abrir mão da Consistência (responder com dado possivelmente desatualizado)

Ou seja: **em caso de partição, você escolhe C ou A — mas não ambos.**

---

## 📊 **Exemplos práticos de sistemas e suas escolhas CAP:**

| Sistema | Garantias predominantes | Tipo |
| --- | --- | --- |
| **MongoDB** (configurável) | AP ou CP | Flexível |
| **Cassandra** | AP | Alta disponibilidade |
| **Consul / Zookeeper** | CP | Forte consistência |
| **DynamoDB** | CP (com leitura forte opcional) | Alta escalabilidade |
| **Etcd** | CP | Controle de estado |
| **Redis (clustered)** | AP | Baixa latência |

---

## 🧠 **Exemplo bancário real:**

Imagine um sistema de **saldo em conta PJ**:

- Se você prioriza **consistência**, o sistema **não permite leitura até garantir que todos os nós estejam sincronizados**, evitando mostrar saldos errados (CP).
- Se você prioriza **disponibilidade**, o sistema responde **com o último valor local**, mesmo que esteja desatualizado (AP) — útil em um **extrato não crítico**.

> Em contexto financeiro, normalmente se prioriza CP (consistência e tolerância à partição), aceitando menor disponibilidade momentânea para evitar inconsistência de dados sensíveis.
> 

---

## ✅ **Conclusão para entrevista**

> “O Teorema CAP afirma que, em caso de partição de rede, sistemas distribuídos só conseguem garantir dois dos três pilares: Consistência, Disponibilidade e Tolerância à Partição. Isso significa que precisamos fazer trade-offs dependendo do negócio. Já atuei em arquiteturas onde priorizamos consistência, como controle de saldo, e outras onde optamos por disponibilidade, como sistemas de consulta pública com cache local. Entender CAP é essencial para tomar decisões técnicas alinhadas com as exigências do domínio.”
