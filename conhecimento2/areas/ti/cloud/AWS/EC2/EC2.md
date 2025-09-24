---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: iaas
cloud_provider: aws
categoria: computacao
---
O **Amazon EC2** é o serviço central de computação em nuvem da AWS, oferecendo máquinas virtuais (instâncias) escaláveis sob demanda. Como **Staff Software Engineer**, dominar o EC2 é essencial para tomar decisões sobre custo, 
desempenho e arquitetura.

Essas maquinas normalmente requer um grande conhecimento do sistema operacional e de networking pois todo o gerenciamento dela será feito pela equipe de TI, isso é chamado de Overhead.

Um ponto interessante é que podemos configurar um script de inicialização chamado User Data, ele pode ser por exemplo um shell script que pode realizar o d

---

## **1. Conceitos Fundamentais**

### **1.1 O que é uma Instância EC2?**

- Máquina virtual (VM) na nuvem AWS.
- Pode executar qualquer sistema operacional (Linux, Windows, macOS*).
- Escalável horizontalmente (adicionar mais instâncias) e verticalmente (aumentar capacidade).

### **1.2 Componentes Principais**

| Componente                     | Descrição                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| **AMI (Amazon Machine Image)** | Template pré-configurado com SO e software (ex: Ubuntu, Amazon Linux, Windows Server).      |
| **Instance Types**             | Famílias de instâncias otimizadas para diferentes cargas de trabalho (CPU, RAM, GPU, etc.). |
| **EBS (Elastic Block Store)**  | Discos virtuais persistentes para armazenamento.                                            |
| **Security Groups**            | Firewall virtual que controla tráfego de rede (permissões de entrada/saída).                |
| **Key Pairs**                  | Par de chaves SSH (pública/privada) para acesso seguro.                                     |

---

## **2. Tipos de Instâncias EC2**

Cada família é otimizada para um uso específico:

|Família|Casos de Uso|Exemplo|
|---|---|---|
|**General Purpose (T, M, A)**|Aplicações genéricas, balanceadas entre CPU/memória.|`t3.medium`, `m6g.large` (ARM)|
|**Compute Optimized (C)**|Cargas de trabalho de alta CPU (batch processing, servidores web).|`c5.xlarge`|
|**Memory Optimized (R, X, Z)**|Bancos de dados, análise em memória (ex: Redis, SAP HANA).|`r6i.4xlarge`|
|**Storage Optimized (I, D, H)**|Big Data, data lakes (alto armazenamento local).|`i3en.2xlarge`|
|**GPU/Accelerated (P, G, VT)**|Machine Learning, renderização 3D.|`p4d.24xlarge` (NVIDIA A100)|

> **Nota**: Nomes seguem o padrão: `[família][geração].[tamanho]` (ex: `m5.large`).

---

## **3. Modelos de Compra (Pricing Models)**

|Modelo|Descrição|Melhor Para|
|---|---|---|
|**On-Demand**|Pago por hora/segundo sem compromisso.|Cargas imprevisíveis ou curtas.|
|**Reserved Instances (RI)**|Desconto de até 75% por compromisso de 1/3 anos.|Cargas estáveis e previsíveis.|
|**Savings Plans**|Desconto flexível (aplicável a qualquer instância).|Redução de custos sem lock-in.|
|**Spot Instances**|Até 90% mais barato, mas pode ser interrompido.|Workloads tolerantes a falhas (ex: CI/CD, batch jobs).|
|**Dedicated Hosts**|Hardware físico dedicado para compliance.|Licenciamento por-socket (ex: Oracle, Windows).|

---

## **4. Configuração Avançada**

### **4.1 Armazenamento**

- **[[EBS]] (Elastic Block Store)**:

    - Volumes persistentes (SSD gp3, io1, HDD st1).
    - Snapshots para backup (armazenados no S3).

- **Instance Store**: Armazenamento temporário de alta performance (perdido ao parar a instância).

### **4.2 Auto Scaling**

- Escalabilidade automática baseada em métricas (CPU, memória, customizadas).
- Exemplo: Aumentar instâncias durante picos de tráfego.

### **4.3 Load Balancing**

- Distribui tráfego entre instâncias usando:
    - **Application Load Balancer (ALB)**: HTTP/HTTPS.
    - **Network Load Balancer (NLB)**: TCP/UDP.

### **4.4 Rede e Segurança**

- **[[VPC]] (Virtual Private Cloud)**: Isolamento de rede.
- **[[Security Groups Continuacao]]**: Regras de firewall (ex: permitir SSH na porta 22).
- **Placement Groups**: Controle sobre posicionamento físico (cluster, spread, partition).
    

---

## **5. Melhores Práticas para Staff Engineers**

### **5.1 Otimização de Custos**

- Usar **Spot Instances** para workloads não críticos.
- Combinar **Reserved Instances + Savings Plans** para economizar.
- Monitorar custos com **AWS Cost Explorer**.

### **5.2 Alta Disponibilidade (HA)**

- Distribuir instâncias em múltiplas **[[Availability Zones (AZs)]]**.
- Usar **Auto Scaling** para substituir instâncias falhas.

### **5.3 Segurança**

- Aplicar **princípio do menor privilégio** no IAM.
- Criptografar volumes EBS com **AWS KMS**.
- Usar **Systems Manager** para gerenciar patches.

### **5.4 Migração para EC2**

- **Lift-and-Shift**: Migrar VMs locais usando **AWS Server Migration Service (SMS)**.
- **Modernização**: Refatorar para containers (ECS/EKS) ou serverless (Lambda).

---

## **6. Exemplo Prático: Deploy de uma Aplicação Web**

1. **Criar uma AMI customizada** com seu aplicativo pré-instalado.  
2. **Lançar instâncias** em múltiplas AZs (`us-east-1a`, `us-east-1b`).  
3. **Configurar [[Auto Scaling]]** para escalar entre 2–10 instâncias baseado em CPU.  
4. **Anexar um [[Application Load Balancer]]** para rotear tráfego.  
5. **Habilitar [[CloudWatch]]** para monitoramento.  

---

## **7. Links Úteis**

- [Documentação Oficial do EC2](https://aws.amazon.com/ec2/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Calculadora de Preços AWS](https://calculator.aws/)

Quer se aprofundar em algum tópico específico (ex: Auto Scaling, EBS, troubleshooting)?