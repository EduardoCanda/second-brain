---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria: computacao
---
Ótimo! Vamos mergulhar nos **tipos de instâncias [[EC2]]**, um tópico essencial para entender como escolher a melhor opção para diferentes cargas de trabalho na AWS.  

---

## **📌 Visão Geral das Instâncias EC2**
As instâncias EC2 são máquinas virtuais na [[AWS]], e cada tipo é otimizado para um uso específico (CPU, memória, GPU, armazenamento, etc.). Elas são agrupadas em **famílias**, e cada família tem características próprias.  

### **🔹 5 Categorias Principais de Instâncias EC2**
1. **Propósito Geral (General Purpose)**  
   - Balanceadas entre CPU, memória e rede.  
   - Ideais para aplicações web, servidores pequenos/médios e bancos de dados leves.  
   - **Exemplos**: `t4g` (ARM/Graviton), `m6i`, `m5`.  

2. **Otimizadas para Computação (Compute Optimized)**  
   - Alta performance de CPU.  
   - Ideais para processamento batch, servidores de jogos e aplicações HPC.  
   - **Exemplos**: `c7g` (Graviton), `c6i`, `c5`.  

3. **Otimizadas para Memória (Memory Optimized)**  
   - Grande quantidade de RAM.  
   - Ideais para bancos de dados (Redis, SAP HANA), análise em tempo real.  
   - **Exemplos**: `r7g` (Graviton), `r6i`, `x1e` (RAM extrema).  

4. **Otimizadas para Armazenamento (Storage Optimized)**  
   - Alto desempenho em disco (SSD, NVMe).  
   - Ideais para data warehouses (Big Data), bancos NoSQL (Cassandra).  
   - **Exemplos**: `i4i` (NVMe), `d3` (HDD denso).  

5. **Otimizadas para GPU/Aceleração (Accelerated Computing)**  
   - Possuem GPUs (NVIDIA, AMD) ou chips especializados (Inferentia, Trainium).  
   - Ideais para ML, renderização 3D, transcodificação de vídeo.  
   - **Exemplos**: `p4` (NVIDIA A100), `g5` (NVIDIA Ampere), `inf1` (Inferentia).  

---

## **🔹 Tipos de Pagamento (Pricing Models)**
Além do tipo de instância, você pode escolher como pagar:  

| Tipo                         | Descrição                                       | Melhor Para                                        |
| ---------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| **On-Demand**                | Paga pelo uso, sem compromisso.                 | Cargas imprevisíveis ou testes.                    |
| **Reserved Instances (RIs)** | Desconto por compromisso de 1/3 anos.           | Cargas previsíveis (ex.: bancos de dados).         |
| **Spot Instances**           | Até 90% mais barato, mas pode ser interrompido. | Workloads tolerantes a falhas (batch jobs, CI/CD). |
| **Savings Plans**            | Desconto flexível por uso consistente.          | Redução de custos sem reserva fixa.                |

---

## **🔹 Como Escolher a Instância Certa?**
1. **Analise a carga de trabalho**:  
   - CPU intensiva? → Compute Optimized (`c7g`, `c6i`).  
   - Muita memória? → Memory Optimized (`r7g`, `x1e`).  
   - Grande volume de dados? → Storage Optimized (`i4i`, `d3`).  

2. **Considere custo vs. desempenho**:  
   - Se a aplicação é tolerante a interrupções, **Spot Instances** podem economizar muito.  
   - Se é crítica, **On-Demand ou Reserved**.  

3. **Avalie arquiteturas modernas**:  
   - Instâncias baseadas em **Graviton** (ARM) são até 20% mais baratas e eficientes para workloads compatíveis.  

---

## **🔹 Perguntas Comuns em Entrevistas**
1. **"Qual a diferença entre `t4g` e `m6i`?"**  
   - `t4g` é **burstable** (usa créditos de CPU) e baseada em ARM (Graviton).  
   - `m6i` é **General Purpose** (CPU Intel/AMD) com desempenho consistente.  

2. **"Quando você usaria uma Spot Instance?"**  
   - Para workloads tolerantes a falhas (ex.: processamento em lote, CI/CD, renderização).  

3. **"O que é uma instância `g5` e quando usá-la?"**  
   - É otimizada para GPU (NVIDIA Ampere), usada em ML, gráficos 3D e vídeo.  

4. **"Como você reduziria custos com instâncias EC2?"**  
   - Usando Reserved Instances, Spot Instances, Savings Plans e migrando para Graviton.  

---

## **📚 Recursos para Aprofundar**
- [AWS Instance Types](https://aws.amazon.com/ec2/instance-types/) (Lista oficial).  
- [AWS Pricing Calculator](https://calculator.aws/) (Simule custos).  
- [EC2 Spot Instances Guide](https://aws.amazon.com/ec2/spot/) (Documentação).  

Se quiser explorar um caso específico (ex.: como escolher instâncias para um banco de dados ou um servidor web), é só perguntar! 🚀