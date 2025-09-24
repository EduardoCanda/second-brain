---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
categoria: armazenamento
---
## 🧠 **O que é Lock Otimista e Lock Pessimista?**

Ambos são **mecanismos de contrle de concorrência** usados para evitar **condições de corrida (race conditions)** e garantir **consistência de dados**, especialmente em bancos de dados relacionais ou sistemas transacionais com múltiplos acessos simultâneos.

---

## 🔐 **Lock Pessimista (Pessimistic Locking)**

### 📌 O que é:

É quando o sistema **bloqueia o recurso imediatamente** após alguém começar a usá-lo, **impedindo que outras transações o acessem até que o bloqueio seja liberado**.

### 🧠 Como funciona:

- Usa instruções como `SELECT ... FOR UPDATE`
- Os outros processos **ficam esperando** (ou falham) até o lock ser liberado
- Muito comum em **ambientes onde há alto risco de conflito**

### ✅ Vantagens:

- Garante **consistência total**
- Evita conflitos com antecedência

### ❌ Desvantagens:

- **Menos escalável** (muitos locks simultâneos)
- Pode gerar **deadlocks** e reduzir throughput

### 🔧 Exemplo prático:

> Um operador inicia a análise de crédito de um cliente PJ. O sistema bloqueia a linha do cliente até o processo ser finalizado, impedindo que outro operador altere os dados nesse tempo.
> 

---

## 🔓 **Lock Otimista (Optimistic Locking)**

### 📌 O que é:

Permite que **várias transações acessem o mesmo dado ao mesmo tempo**, mas **verifica no momento do commit se houve alteração por outra transação**.

### 🧠 Como funciona:

- Geralmente usa um campo `version` ou `timestamp`
- Ao atualizar, o sistema compara o valor da versão original com a atual:
    - Se for igual → update permitido
    - Se for diferente → falha com erro de concorrência

### ✅ Vantagens:

- **Mais performático e escalável**
- Ideal para sistemas com **baixa probabilidade de conflito**

### ❌ Desvantagens:

- Possibilidade de erro na hora do commit (precisa retry)
- Pode ser mais difícil de implementar corretamente

### 🔧 Exemplo prático:

> Dois analistas abrem ao mesmo tempo a ficha de um cliente PJ para análise. Ambos fazem alterações. Quando o segundo tenta salvar, o sistema detecta que a versão foi modificada e rejeita a operação com erro de concorrência.
> 

---

## 🧩 **Comparativo direto**

| Característica | Lock Pessimista | Lock Otimista |
| --- | --- | --- |
| Estratégia | **Evita** conflitos com bloqueio | **Detecta** conflitos no commit |
| Acesso simultâneo | ❌ Bloqueia outros acessos | ✅ Permite múltiplos acessos |
| Performance | Menor (locks custosos) | Maior (sem bloqueios) |
| Conflito | Impossível (bloqueia) | Possível (mas detectado) |
| Ideal para | Ambientes com **muito conflito** | Ambientes com **baixo conflito** |
| Exemplo comum | `SELECT ... FOR UPDATE` | Controle via `version` no registro |

---

## ✅ **Conclusão para entrevista**

> “Lock otimista e pessimista são técnicas de controle de concorrência. No lock pessimista, o sistema bloqueia imediatamente o recurso, impedindo conflitos, mas com menor performance. Já o lock otimista permite múltiplos acessos e detecta conflitos apenas no momento do commit, sendo mais performático, mas exigindo retry em caso de conflito. Em contextos bancários, já utilizei ambos: lock pessimista em cenários críticos como atualização de saldo, e otimista em fluxos de edição concorrente com baixa probabilidade de conflito, controlado por versão.”