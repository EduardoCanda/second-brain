---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
---
# **AWS Lambda: Guia Completo Resumido**  

## **📌 O que é AWS Lambda?**  
AWS Lambda é um serviço **serverless** que permite executar código (funções) **sem gerenciar servidores**. Você só paga pelo tempo de execução, e a AWS cuida da escalabilidade, disponibilidade e infraestrutura.  

---

## **🔹 Principais Características**  
✅ **Sem servidores para gerenciar** (zero administração de infra).  
✅ **Escalabilidade automática** (cada evento executa uma instância independente).  
✅ **Cobrança por milissegundo de execução** (paga apenas enquanto o código roda).  
✅ **Integração nativa com serviços AWS** (S3, DynamoDB, API Gateway, etc.).  
✅ **Suporte a múltiplas linguagens** (Python, Node.js, Java, Go, Ruby, .NET).  

---

## **🔹 Como o Lambda Funciona?**  
1. **Você envia o código** (função Lambda).  
2. **Configura um trigger** (o que dispara a função). Exemplos:  
   - Upload em um bucket S3.  
   - Mensagem em uma fila SQS.  
   - Requisição HTTP via API Gateway.  
3. **Lambda executa a função** quando o evento ocorre.  
4. **Escala automaticamente** (cada evento roda em um ambiente isolado).  

---

## **🔹 Arquitetura Típica**  
- **Frontend (API Gateway)** → **Lambda** → **Banco de Dados (DynamoDB)**  
- **S3 (Upload de arquivo)** → **Lambda (Processamento)** → **SNS (Notificação)**  

---

## **🔹 Vantagens do Lambda**  
✔ **Redução de custos** (não paga por servidor ocioso).  
✔ **Alta disponibilidade nativa** (rode em múltiplas AZs).  
✔ **Desenvolvimento mais rápido** (foco no código, não na infra).  
✔ **Escala sob demanda** (lida com 1 usuário ou 1 milhão sem configurar Auto Scaling).  

---

## **🔹 Limitações do Lambda**  
❌ **Cold starts** (latência inicial em funções não usadas recentemente).  
❌ **Tempo máximo de execução: 15 minutos**.  
❌ **Memória limitada (10 GB)** e **CPU compartilhada**.  
❌ **Debug mais complexo** (logs via CloudWatch).  

---

## **🔹 Casos de Uso Comuns**  
1. **APIs leves** (backend serverless com API Gateway).  
2. **Processamento de arquivos** (ex.: converter PDFs ao fazer upload no S3).  
3. **Automações** (ex.: backup diário de um banco de dados RDS).  
4. **Chatbots** (integrando com Amazon Lex).  
5. **ETL (Extract, Transform, Load)** (processar dados de streams como Kinesis).  

---

## **🔹 Comparação: Lambda vs. Outros Serviços AWS**  

| **Cenário**                  | **Lambda**                          | **Alternativa (EC2/ECS/EKS)**       |     |
| ---------------------------- | ----------------------------------- | ----------------------------------- | --- |
| **Tarefas curtas (<15 min)** | ✅ Ideal (paga só pelo tempo usado). | ❌ Overhead de gerenciar servidores. |     |
| **Aplicação 24/7**           | ❌ Inviável (custaria caro).         | ✅ Melhor opção (EC2/ECS).           |     |
| **Controle total do SO**     | ❌ Não permite.                      | ✅ Possível (EC2/containers).        |     |
|                              |                                     |                                     |     |

---

## **🔹 Otimizações no Lambda**  
- **Provisioned Concurrency**: Elimina cold starts (pré-inicializa instâncias).  
- **Layers**: Compartilha bibliotecas entre funções.  
- **Versions & Aliases**: Gerencia diferentes versões do código.  
- **Tamanho do pacote**: Reduz dependências para acelerar inicialização.  

---

## **🔹 Perguntas Frequentes em Entrevistas**  

### **1. "O que é um cold start?"**  
- Atraso na primeira execução de uma função (quando a AWS precisa alocar recursos).  

### **2. "Como reduzir cold starts?"**  
- Usar **Provisioned Concurrency** ou otimizar o tempo de inicialização (menos dependências).  

### **3. "Quando NÃO usar Lambda?"**  
- Workloads de longa duração (>15 min) ou que exigem controle total do ambiente.  

### **4. "Qual o limite de memória no Lambda?"**  
- Entre **128 MB e 10 GB** (ajustável).  

### **5. "Como debugar uma função Lambda?"**  
- Logs no **CloudWatch** e **X-Ray** para rastreamento distribuído.  

---

## **📚 Recursos para Aprofundar**  
- [Documentação Oficial AWS Lambda](https://docs.aws.amazon.com/lambda/)  
- [Serverless Framework](https://www.serverless.com/) (Automatiza deploys).  
- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)  

Quer um **exemplo prático** de como criar uma função Lambda? Posso mostrar um passo a passo! 🚀