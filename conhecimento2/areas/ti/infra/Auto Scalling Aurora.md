## 🧠 **Como funciona o Auto Scaling no Amazon Aurora?**

O **Amazon Aurora** oferece **múltiplos mecanismos de escalabilidade automática**, que atuam de formas diferentes dependendo do tipo de workload (leitura, escrita, capacidade computacional ou armazenamento).

---

## 🔄 **1. Auto Scaling de Réplicas de Leitura (Aurora Read Replicas)**

### 📌 O que é:

Permite escalar **horizontalmente a capacidade de leitura** adicionando/removendo automaticamente réplicas conforme a demanda.

### ⚙️ Como funciona:

- Você define uma **target tracking policy** com base em métricas como:
    - `CPUUtilization`
    - `ReadLatency`
    - `ReadThroughput`
- Aurora então **cria ou remove réplicas de leitura** automaticamente no cluster, de acordo com a política

### 🧠 Use quando:

- Sua aplicação tem **picos de leitura** variáveis
- Você quer aliviar a carga da instância writer
- Quer minimizar o custo mantendo só as réplicas necessárias

### 🔧 Como configurar:

1. No console do RDS, vá até o cluster Aurora
2. Configure o **Auto Scaling group** de réplicas
3. Defina:
    - Min e max de réplicas
    - Métrica de escalonamento
    - Threshold alvo (ex: manter CPU < 60%)

---

## 📈 **2. Auto Scaling de capacidade computacional com Aurora Serverless v2**

### 📌 O que é:

Aurora Serverless v2 permite **escalar automaticamente a capacidade computacional (vCUs)** com granularidade fina, **baseado na carga real do banco de dados**.

### ⚙️ Como funciona:

- A engine monitora **conexões simultâneas, workload, e uso de recursos**
- A capacidade (vCUs) **escala de forma automática e contínua** dentro do intervalo definido (ex: 2 a 64 ACUs)
- O scaling é **quase instantâneo**, sem reinício ou perda de conexão

### 🧠 Use quando:

- O tráfego é **imprevisível ou intermitente**
- Você quer pagar **somente pela capacidade usada**
- Está construindo **APIs serverless ou eventos esporádicos**, onde manter instâncias provisionadas seria desperdício

### 🔧 Como configurar:

1. Criar um cluster Aurora Serverless v2
2. Definir `min` e `max` de **Aurora Capacity Units (ACUs)**
3. O scaling acontece de forma transparente

> ⚠️ Aurora Serverless v1 também oferece scaling, mas com limitações maiores: escalonamento mais lento e com pausas automáticas (adequado só para workloads intermitentes com menos exigência de performance).
> 

---

## 📦 **3. Auto Scaling de armazenamento (Storage Auto Scaling)**

### 📌 O que é:

Aurora automaticamente aumenta o volume de armazenamento **à medida que o banco de dados cresce**, até 128 TB por cluster.

### ⚙️ Como funciona:

- A cada vez que o uso de armazenamento ultrapassa ~90%, Aurora expande o volume de forma automática, em background.
- O processo é **transparente e sem impacto na disponibilidade**

### 🧠 Use quando:

- Você não quer se preocupar em prever o crescimento de dados
- Está lidando com workloads que variam muito em volume (ex: logs, relatórios)

---

## 📊 **Resumo comparativo dos tipos de Auto Scaling no Aurora**

| Tipo de Scaling | Recurso afetado | Quando usar |
| --- | --- | --- |
| **Read Replica Scaling** | Capacidade de leitura | Picos de leitura, distribuição de carga |
| **Aurora Serverless v2** | vCPU + memória | Workloads imprevisíveis ou intermitentes |
| **Storage Auto Scaling** | Armazenamento em disco | Crescimento contínuo de dados |

---

## ✅ **Conclusão para entrevista**

> “O Amazon Aurora oferece auto scaling em três níveis: réplicas de leitura, capacidade computacional com Serverless v2 e armazenamento. O scaling de réplicas permite escalar horizontalmente para distribuir leitura. O Serverless v2 escala vCUs com base na carga em tempo real, ideal para workloads imprevisíveis. E o armazenamento escala automaticamente até 128 TB sem intervenção. Já utilizei essas abordagens para reduzir custo, aumentar performance e evitar downtime em clusters de APIs bancárias críticas.”
> 

### Como fazer um AutoScaling por uso de memória em um ECS com EC2 e Fargate?

