---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: iaas
cloud_provider: aws
categoria: armazenamento
---
O **Amazon EBS** é o serviço de armazenamento em bloco da AWS, projetado para uso com instâncias [[EC2]]. Ele fornece volumes persistentes de alta performance, ideais para bancos de dados, sistemas de arquivos e aplicações que exigem baixa latência.

Essas instancias funcionam como [[Exemplos de dispositivos de blocos]], e podemos na instancia rodar comandos como [[df]], [[blkid]], [[findmnt]] entre outros para obter informações de como esse dispositivo está montado em nossa [[EC2]].

Em caso de redimensionamento de discos, é necessário aumentar também a partição na maquina virtual(usando growpart pro exemplo), e posteriormente aumentando também o sistema de arquivos da partição. 

---

## **1. Conceitos Fundamentais**

### **1.1 O que é um Volume EBS?**

- **Disco virtual** anexado a instâncias [[EC2]].
- **Persistente**: Dados são mantidos após desligamento da instância.    
- **Redimensionável**: Pode aumentar capacidade ou alterar tipo sem downtime (em alguns casos).

### **1.2 Componentes Principais**

| Componente               | Descrição                                            |
| ------------------------ | ---------------------------------------------------- |
| **Volume**               | Recurso de armazenamento principal (ex: 100 GB gp3). |
| **Snapshot**             | Cópia pontual de um volume (armazenada no [[S3]]).       |
| **AMI (com EBS Backed)** | Imagem de máquina que inclui um volume EBS.          |

---

## **2. Tipos de Volumes EBS**

Cada tipo é otimizado para diferentes cargas de trabalho:

|Tipo|Descrição|Casos de Uso|IOPS* Máx.|Taxa de Throughput|
|---|---|---|---|---|
|**gp3 (General Purpose SSD)**|Balanceado entre custo e performance.|Boot volumes, aplicações genéricas.|16.000|1.000 MB/s|
|**io1/io2 (Provisioned IOPS SSD)**|Alta performance e baixa latência.|Bancos de dados (RDS, Oracle).|64.000 (io2)|4.000 MB/s|
|**st1 (Throughput Optimized HDD)**|Armazenamento magnético econômico.|Big Data, data lakes.|500|500 MB/s|
|**sc1 (Cold HDD)**|Custo mais baixo para dados raramente acessados.|Backups, arquivamento.|250|250 MB/s|

> *IOPS = Operações de entrada/saída por segundo.

---

## **3. Principais Recursos**

### **3.1 Snapshots**

- **Backup incremental**: Apenas blocos alterados são copiados.
- **Compartilhamento entre contas AWS**.
- **Criptografia**: Suporte a **AWS KMS**.

### **3.2 Multi-Attach (io1/io2 apenas)**

- Um volume pode ser anexado a **até 16 instâncias EC2** simultaneamente (apenas em modo leitura/gravação para sistemas cluster-aware).
- **Exemplo**: Bancos de dados como Oracle RAC.

### **3.3 Fast Snapshot Restore (FSR)**

- Reduz tempo de inicialização de snapshots para **1-2 minutos** (útil para ambientes críticos).

### **3.4 Criptografia**

- **AES-256** nativa (sem impacto na performance).
- Chaves gerenciadas pelo **AWS KMS**.

---

## **4. Melhores Práticas para Staff Engineers**

### **4.1 Otimização de Performance**

- Use **io2** para bancos de dados com alta demanda de IOPS.
- Para gp3, ajuste **IOPS e throughput** independentemente (ex: 3.000 IOPS + 200 MB/s).
- Alinhe tamanho do volume com **tamanho da instância EC2** (ex: instâncias otimizadas para EBS como `c5d`).

### **4.2 Gerenciamento de Custos**

- **Delete snapshots antigos** automatizando com **Amazon Data Lifecycle Manager**.
- Use **st1/sc1** para dados não críticos.
- **Monitoramento**: CloudWatch para métricas como `VolumeReadBytes`, `VolumeQueueLength`.

### **4.3 Alta Disponibilidade (HA)**

- **Replique snapshots entre regiões** para disaster recovery.
- Em aplicações críticas, combine **EBS Multi-Attach + EC2 Auto Scaling**.    

### **4.4 Segurança**

- **Habilite criptografia padrão** para todos os volumes.
- **Restrinja acesso** a snapshots via IAM policies.

---

## **5. Comparação com Outros Serviços de Armazenamento AWS**

|Serviço|Tipo|Persistência|Casos de Uso|
|---|---|---|---|
|**EBS**|Bloco|Persistente|Bancos de dados, sistemas de arquivos.|
|**EFS**|Arquivos|Persistente|Aplicações distribuídas (NFS).|
|**[[S3]]**|Objetos|Persistente|Backup, data lakes.|
|**Instance Store**|Bloco|Temporário|Cache de alta performance.|

---

## **6. Exemplo Prático: Configurando um Volume EBS**


1. **Criar um volume gp3** de 500 GB na mesma AZ da instância EC2.  
2. **Anexar o volume** à instância via console AWS ou CLI:  
   ```bash
   aws ec2 attach-volume --volume-id vol-12345 --instance-id i-67890 --device /dev/sdf
```

3. **Formatar e montar** (Linux):
```bash
    mkfs -t xfs /dev/nvme1n1  
    mkdir /data  
    mount /dev/nvme1n1 /data  
```
4. **Automatizar snapshots** com AWS Backup.
    
---

## **7. Links Úteis**  
- [Documentação Oficial do EBS](https://aws.amazon.com/ebs/)  
- [Calculadora de Preços EBS](https://aws.amazon.com/ebs/pricing/)  
- [Deep Dive on EBS Performance](https://aws.amazon.com/blogs/aws/amazon-ebs-gp3-volume-types/)  

Quer se aprofundar em **EBS Multi-Attach**, **snapshot management** ou **troubleshooting**?

## **Load Balancer com EC2 e EBS: Compartilhamento de Discos**

Em uma arquitetura típica com **Load Balancer (ALB/NLB) + EC2**, aqui está a resposta direta à sua pergunta:

## ❌ **Não, instâncias EC2 individuais NÃO podem compartilhar o mesmo volume EBS simultaneamente (em modo leitura/gravação)**, exceto em cenários específicos com **EBS Multi-Attach** (limitado a volumes `io1/io2`).

---

## **Detalhamento Técnico**

### 1. **Problema do Compartilhamento Tradicional de EBS**

- Por padrão, um volume EBS só pode ser anexado a **uma única instância EC2 por vez** (em modo leitura/gravação).
    
- Se tentar anexar o mesmo EBS a múltiplas instâncias:
    
    - **Corrupção de dados**: Sistemas de arquivos (ext4, XFS) não suportam acesso concorrente.
        
    - **Conflito de escrita**: Aplicações (ex: bancos de dados) podem sofrer race conditions.
        

### 2. **Solução para Cenários com Load Balancer**

Se suas instâncias EC2 precisam de dados compartilhados, considere:

#### ✅ **Opção 1: EBS Multi-Attach (para volumes `io1/io2`)**

- **Como funciona**:
    
    - Um volume `io1/io2` pode ser anexado a **até 16 instâncias** simultaneamente.
        
    - Requer um **sistema de arquivos cluster-aware** (ex: Oracle RAC, GFS2).
        
- **Limitações**:
    
    - Não funciona com volumes `gp3` ou `st1/sc1`.
        
    - Aplicações precisam ser projetadas para acesso concorrente.
        

#### ✅ **Opção 2: Sistema de Arquivos Compartilhado (EFS/FSx)**

- **Amazon EFS**:
    
    - Sistema de arquivos NFS gerenciado.
        
    - Acessível por múltiplas instâncias EC2 (mesmo em diferentes AZs).
        
    - Ideal para: CI/CD, conteúdo compartilhado (ex: arquivos de mídia).
        
- **Amazon FSx**:
    
    - Suporta protocolos como SMB (Windows) e Lustre (HPC).
        

#### ✅ **Opção 3: Sincronização de Dados (Alternativa)**

- **Exemplos**:
    
    - **Rsync** ou **AWS DataSync**: Para sincronizar dados entre instâncias.
        
    - **[[S3]] + Cache Local**: Usar [[S3]] como fonte de verdade e cache local (ex: com [[S3]]FS).
        

#### ✅ **Opção 4: Arquitetura Stateless (Recomendado para Load Balancer)**

- **Princípio**:
    
    - Instâncias EC2 **não armazenam estado localmente**.
    - Dados persistentes ficam em serviços gerenciados:
        - Bancos de dados: **RDS**, **DynamoDB**.
        - Armazenamento: **[[S3]]**, **ElastiCache**.
- **Vantagens**:
    
    - Escalabilidade horizontal simplificada.
    - Tolerância a falhas (instâncias podem ser substituídas sem perda de dados).

---

## **Exemplo Prático: Load Balancer + EC2 Stateless**

1. **Load Balancer (ALB)**: Roteia tráfego para um grupo de instâncias EC2.
2. **Instâncias EC2**:  
   - Usam **discos EBS individuais** (apenas para SO e aplicação).  
   - Acessam dados compartilhados via **RDS (banco de dados)** e **[[S3]] (arquivos)**.  
1. **Auto Scaling**: Adiciona/remove instâncias conforme demanda (sem preocupação com EBS compartilhado).  

---

## **Quando Usar EBS Multi-Attach?**

Apenas se:

- Sua aplicação **é cluster-aware** (ex: Oracle RAC, SAP HANA).
- Você precisa de **baixa latência** (EFS pode ter latência maior que EBS).

---

## **Comparação de Soluções**

|Solução|Compartilhamento|Tipo de Dados|Casos de Uso|
|---|---|---|---|
|**EBS Multi-Attach**|Leitura/gravação concorrente (io1/io2)|Dados estruturados (DBs)|Oracle RAC, sistemas clusterizados.|
|**EFS**|Leitura/gravação via NFS|Arquivos (logs, mídia)|CI/CD, conteúdo web.|
|**[[S3]]**|Acesso via API|Objetos (imagens, backups)|Armazenamento durável.|
|**Stateless (RDS/[[S3]])**|Não compartilha EBS|Dados gerenciados|Aplicações web escaláveis.|

---

## **Melhores Práticas para Staff Engineers**

1. **Evite EBS compartilhado** se possível: Prefira arquiteturas stateless.
2. **Monitore performance**: Use CloudWatch para métricas como `VolumeQueueLength` (se usar EBS Multi-Attach).
3. **Teste de recuperação**: Simule falhas em instâncias com volumes compartilhados.

---

## **Conclusão**

Para a maioria dos casos com **Load Balancer + EC2**, a abordagem **stateless** (usando RDS/[[S3]]) é a mais escalável e simples. Reserve **EBS Multi-Attach** para workloads específicos (ex: bancos de dados clusterizados).

Precisa de ajuda para projetar sua arquitetura específica? Posso sugerir um diagrama!