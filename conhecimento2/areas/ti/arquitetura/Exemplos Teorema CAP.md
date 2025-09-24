---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---

O **Teorema CAP**, também conhecido como **Teorema de Brewer** (formulado por Eric Brewer) e posteriormente formalizado por Gilbert e Lynch, estabelece que, em sistemas distribuídos, é impossível garantir simultaneamente os três seguintes propriedades:  

1. **Consistência (Consistency)**: Todos os nós veem os mesmos dados ao mesmo tempo.  
2. **Disponibilidade (Availability)**: Todo pedido recebe uma resposta (sem erros), mesmo que alguns nós falhem.  
3. **Tolerância a Partições (Partition Tolerance)**: O sistema continua funcionando mesmo que ocorram falhas na comunicação entre os nós.  

Segundo o teorema, apenas **dois desses três aspectos podem ser garantidos ao mesmo tempo** em um sistema distribuído.  

### **Variações e Interpretações do Teorema CAP**  
Além da formulação clássica, existem algumas variações e interpretações do teorema CAP, dependendo do contexto e das necessidades do sistema:  

#### **1. PACELC (Extensão do CAP)**  
Proposto por Daniel Abadi, o **PACELC** é uma extensão do CAP que considera também a **latência** em situações normais (sem partições de rede).  
- **Se há Partição (P)**: Escolha entre **A** (Disponibilidade) ou **C** (Consistência).  
- **Else (Sem Partição)**: Escolha entre **L** (Latência) ou **C** (Consistência).  

**Exemplo**:  
- **DynamoDB (Amazon)**: Prioriza **Disponibilidade e Latência** (AP + L).  
- **Google Spanner**: Prioriza **Consistência** (CP + C).  

#### **2. CAP Dinâmico (Adaptável)**  
Alguns sistemas permitem **mudar a prioridade entre C, A e P** dependendo da situação.  
- **Exemplo**: Um banco de dados pode ser **CP** em condições normais, mas **AP** durante uma falha de rede.  

#### **3. CAP com Relaxamento de Consistência (Eventual Consistency)**  
Sistemas como **Cassandra** e **Riak** optam por **Disponibilidade e Tolerância a Partições (AP)**, mas oferecem **consistência eventual** (os dados se tornam consistentes após algum tempo).  

#### **4. CAP com Compensação (Compensating Transactions)**  
Sistemas que usam **Sagas** ou **transações compensatórias** para lidar com falhas, mantendo **disponibilidade** sem sacrificar totalmente a consistência.  

#### **5. CAP com Consistência Forte em Subconjuntos**  
Alguns sistemas garantem **consistência forte** apenas em partes críticas (ex: bancos de dados **NewSQL** como CockroachDB), enquanto outras partes são **AP**.  

### **Exemplos Práticos de Escolhas CAP**  
| **Sistema**          | **Escolha CAP** | **Justificativa** |  
|----------------------|----------------|------------------|  
| **MongoDB**          | CP             | Prioriza consistência em detrimento da disponibilidade total durante partições. |  
| **Cassandra**        | AP             | Alta disponibilidade, mas consistência eventual. |  
| **Redis Cluster**    | CP             | Mantém consistência, mas pode recusar requisições em caso de partição. |  
| **Amazon DynamoDB**  | AP (com PACELC)| Alta disponibilidade e baixa latência, com consistência configurável. |  

### **Conclusão**  
O teorema CAP não é absoluto e pode ser adaptado conforme a necessidade do sistema. Variações como **PACELC** e **CAP dinâmico** mostram que é possível flexibilizar as restrições dependendo do cenário. A escolha entre **C, A e P** depende dos requisitos de negócio e da tolerância a falhas.  

Quer explorar algum desses casos em mais detalhes?