---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
---
O **Amazon [[RDS]] (Relational Database Service)** é classificado como um serviço **PaaS (Platform as a Service)** dentro do modelo de computação em nuvem, mas há nuances dependendo da perspectiva. Veja a análise detalhada:

### **Classificação do Amazon RDS:**
1. **PaaS (Platform as a Service)** – **Principal Categoria**  
   - O RDS é **majoritariamente considerado PaaS** porque a AWS gerencia toda a infraestrutura subjacente (servidores, rede, armazenamento) e o **SGBD (Sistema de Gerenciamento de Banco de Dados)**, incluindo:  
     - Instalação e patches do banco de dados (MySQL, PostgreSQL, etc.).  
     - Backups automáticos, escalabilidade e alta disponibilidade (Multi-AZ).  
     - Monitoramento e manutenção.  
   - Você só precisa configurar o banco, criar tabelas e gerenciar os dados (**a aplicação é de sua responsabilidade**).  

2. **IaaS (Infrastructure as a Service)** – **Parcialmente, mas não totalmente**  
   - Se você comparar com serviços puramente IaaS (como EC2, onde você gerencia o SO e o SGBD manualmente), o RDS está em um nível acima, pois abstrai a infraestrutura e o software do banco.  

3. **SaaS (Software as a Service)** – **Não se aplica**  
   - O RDS não é SaaS porque você **não consome um aplicativo pronto** (como Salesforce ou Gmail). Você ainda precisa escrever consultas SQL, gerenciar esquemas e otimizar o banco.  

### **Comparação com Outros Serviços AWS:**
| **Serviço AWS**       | **Classificação**        | **Exemplo de Controle do Usuário**                   |     |
| --------------------- | ------------------------ | ---------------------------------------------------- | --- |
| **[[EC2]]**           | IaaS                     | Você gerencia o SO, middleware e aplicação.          |     |
| **RDS**               | **PaaS**                 | AWS gerencia o SGBD; você gerencia os dados.         |     |
| **Aurora Serverless** | PaaS (com SaaS elements) | Escala automaticamente, mas ainda exige queries SQL. |     |
| **DynamoDB**          | PaaS/DBaaS               | Banco NoSQL gerenciado, sem esquema SQL.             |     |

### **Por que não é IaaS?**  
- No IaaS (como EC2 + MySQL instalado manualmente), você é responsável por:  
  - Instalar/configurar o SGBD.  
  - Aplicar patches de segurança.  
  - Gerenciar backups e replicação.  
- No RDS, a AWS faz tudo isso, deixando você focar no **banco de dados em si**, não na infra.  

### **Conclusão**  
O RDS é **PaaS** porque oferece uma **plataforma pronta para bancos de dados relacionais**, abstraindo a infraestrutura e o gerenciamento do SGBD, mas ainda exigindo que você interaja com o banco via SQL ou ferramentas de administração.  

Se precisar de um serviço ainda mais abstraído (quase SaaS), o **Aurora Serverless** é uma evolução nessa direção, mas ainda requer consultas SQL.