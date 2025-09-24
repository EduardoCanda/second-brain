---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
---
# **AWS Lambda: Serverless vs. Servidores Tradicionais (EC2, ECS, etc.)**  

A AWS Lambda é um serviço **serverless** que executa código sem a necessidade de gerenciar servidores. Vamos comparar o modelo **serverless** com os **servidores tradicionais** ([[EC2]], [[ECS]], [[Meu resumo EKS|EKS]]) e entender quando usar cada um.  

---

## **📌 Serverless (Lambda) vs. Servidores Tradicionais (EC2, ECS, etc.)**  

| **Critério**               | **AWS Lambda (Serverless)**                             | **Servidores Tradicionais (EC2, ECS, EKS)**             |
| -------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| **Gerenciamento**          | AWS gerencia infraestrutura.                            | Você gerencia servidores (SO, patches, escalabilidade). |
| **Escalabilidade**         | Automática (por evento).                                | Manual ou via Auto Scaling.                             |
| **Cobrança**               | Por tempo de execução (ms) e memória.                   | Por hora da instância (mesmo se ociosa).                |
| **Tempo de Inicialização** | Pode ter **cold starts** (atraso na primeira execução). | Sem cold start (já está rodando).                       |
| **Uso Ideal**              | Eventos pontuais (API Gateway, S3 triggers, cron jobs). | Aplicações contínuas (servidores web, bancos de dados). |
| **Limitações**             | Tempo máximo de execução (15 min).                      | Sem limite de tempo (depende da instância).             |
| **Integração**             | Fácil com serviços AWS (S3, DynamoDB, SQS).             | Pode precisar de configuração adicional.                |
| **Custo**                  | Econômico para cargas esporádicas.                      | Pode ser caro se subutilizado.                          |

---

## **🔹 Quando Usar AWS Lambda?**  
✅ **Processamento assíncrono** (ex.: resize de imagens ao fazer upload no [[S3]]).  
✅ **APIs leves** (com [[Api Gateway AWS]]).  
✅ **Automações event-driven** (ex.: reagir a mensagens [[SQS]], eventos DynamoDB).  
✅ **Tarefas agendadas** (CloudWatch Events / [[Event Bridge|EventBridge]]).  

### **Exemplo de Caso de Uso:**  
- **Thumbnail Generator**: Um usuário faz upload de uma imagem no S3 → Lambda dispara e gera um thumbnail.  

---

## **🔹 Quando Usar Servidores Tradicionais (EC2, ECS, EKS)?**  
✅ **Aplicações de longa execução** (ex.: servidor web 24/7).  
✅ **Controle total do ambiente** (SO personalizado, configurações específicas).  
✅ **Workloads com alto uso de CPU/memória** (ex.: machine learning, bancos de dados).  
✅ **Quando você precisa de tempo de execução ilimitado**.  

### **Exemplo de Caso de Uso:**  
- **Aplicação WordPress**: Requer um servidor sempre ativo (EC2 ou ECS com Docker).  

---

## **🔹 Vantagens do Serverless (Lambda)**  
✔ **Sem gerenciamento de servidores** (zero administração de infra).  
✔ **Escalabilidade automática** (lida com picos de tráfego sem configurar Auto Scaling).  
✔ **Pagamento por uso** (não paga por tempo ocioso).  
✔ **Integração nativa com serviços AWS** (S3, DynamoDB, SNS, etc.).  

---

## **🔹 Desvantagens do Serverless (Lambda)**  
❌ **Cold starts** (latência inicial em funções não usadas recentemente).  
❌ **Limites de tempo e memória** (máximo 15 minutos por execução).  
❌ **Debug mais complexo** (logs via CloudWatch, sem acesso ao servidor).  
❌ **Custo pode subir em alta escala** (para workloads muito frequentes, EC2 pode ser mais barato).  

---

## **🔹 Perguntas Comuns em Entrevistas**  

### **1. "O que é um cold start no Lambda?"**  
- É o atraso quando uma função é executada pela primeira vez ou após um período de inatividade. Ocorre porque a AWS precisa alocar recursos.  

### **2. "Como reduzir cold starts?"**  
- Usar **Provisioned Concurrency** (mantém instâncias "quentes").  
- Otimizar o tamanho do pacote (menos dependências = inicialização mais rápida).  

### **3. "Quando NÃO usar Lambda?"**  
- Para workloads de longa duração (>15 min).  
- Aplicações que exigem controle total do ambiente (ex.: kernels personalizados).  

### **4. "Qual a diferença entre Lambda e Fargate (ECS/EKS)?"**  
- **Lambda**: Executa funções (código simples, stateless).  
- **Fargate**: Executa containers (Docker) sem gerenciar servidores (mais flexível que Lambda).  

---

## **📚 Recursos para Aprofundar**  
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)  
- [Serverless Framework](https://www.serverless.com/) (Ferramenta para deploy automático).  
- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)  

Quer ver um exemplo prático de Lambda em ação? Posso mostrar um passo a passo! 🚀