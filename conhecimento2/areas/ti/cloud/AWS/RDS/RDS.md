---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
---
O **Amazon RDS (Relational Database Service)** é um serviço gerenciado da AWS que facilita a configuração, operação e escalabilidade de bancos de dados relacionais na nuvem. Ele automatiza tarefas administrativas, como provisionamento de hardware, configuração, backups, patches e recuperação de falhas, permitindo que os desenvolvedores se concentrem em suas aplicações.

### **Principais Funcionalidades do Amazon RDS:**
1. **Banco de Dados Gerenciado**  
   - A AWS cuida de backups, atualizações de software, monitoramento e escalabilidade.
   - Suporta múltiplos motores de banco de dados:
     - **MySQL**  
     - **PostgreSQL**  
     - **MariaDB**  
     - **Oracle Database**  
     - **Microsoft SQL Server**  
     - **Aurora** (banco de dados otimizado da AWS, compatível com MySQL e PostgreSQL).

2. **Escalabilidade Fácil**  
   - **Escalamento Vertical**: Aumento ou redução da capacidade de CPU/RAM (alterando a classe da instância).  
   - **Escalamento Horizontal**: Leitura replicada para distribuir cargas de consulta (Read Replicas).  
   - **Aurora Serverless**: Escala automaticamente com base na demanda.

3. **Alta Disponibilidade e Durabilidade**  
   - **Multi-AZ (Multi-Availability Zone)**: Replicação síncrona para uma instância em outra zona de disponibilidade, garantindo failover automático em caso de falha.  
   - **Backups Automatizados**: Snapshots diários e logs de transações para Point-in-Time Recovery.  

4. **Segurança**  
   - Criptografia em repouso (via AWS KMS) e em trânsito (SSL/TLS).  
   - Controle de acesso via IAM e VPC para isolamento de rede.  
   - Autenticação integrada com IAM para PostgreSQL e MySQL.

5. **Monitoramento e Manutenção**  
   - Amazon CloudWatch para métricas de desempenho.  
   - Amazon RDS Performance Insights para análise de consultas.  
   - Atualizações automáticas de patches com janela de manutenção configurável.

6. **Tipos de Armazenamento**  
   - **SSD (gp2/io1)**: Para cargas de trabalho gerais ou E/S intensivas.  
   - **Magnetic (padrão)**: Opção mais econômica para workloads menores.  

### **Como o RDS Funciona?**
1. **Criação de uma Instância RDS**:  
   - Você escolhe o motor de banco de dados (ex: MySQL), a classe da instância (ex: `db.t3.medium`) e o armazenamento.  
   - Define configurações de rede (VPC, Security Groups).  

2. **Operações Gerenciadas**:  
   - A AWS provisiona a instância e gerencia o SGBD.  
   - Backups são feitos automaticamente, e patches são aplicados conforme agendado.  

3. **Conexão com Aplicações**:  
   - Sua aplicação se conecta ao **endpoint** do RDS (ex: `meubanco.abc123.us-east-1.rds.amazonaws.com:3306`).  

4. **Escalabilidade sob Demanda**:  
   - Se necessário, você pode adicionar Read Replicas ou mudar para uma instância maior.  

### **Exemplo de Casos de Uso:**
- **Aplicações Web**: Hospedagem de bancos de dados para sites em WordPress, e-commerce, etc.  
- **Sistemas Corporativos**: ERP, CRM e outros sistemas que exigem alta disponibilidade.  
- **Análise de Dados**: Consultas complexas em PostgreSQL ou MySQL com suporte a grandes volumes.  

### **Vantagens em Relação a Bancos Auto-gerenciados (EC2 + SGBD):**
✔ **Menos overhead administrativo** (sem preocupação com instalação, backups, patches).  
✔ **Recuperação de desastres simplificada** (Multi-AZ, snapshots).  
✔ **Custo previsível** (modelo sob demanda ou instâncias reservadas).  

### **Limitações:**
- Não permite acesso ao SO subjacente (diferente de rodar um banco em EC2).  
- Alguns recursos avançados podem exigir o Aurora (ex: autoescalagem nativa).  

Se precisar de mais flexibilidade, a AWS também oferece o **Amazon Aurora**, uma opção otimizada com maior desempenho e integração profunda com serviços AWS.  