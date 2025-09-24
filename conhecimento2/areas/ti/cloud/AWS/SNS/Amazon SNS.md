---
tags:
  - Fundamentos
  - NotaBibliografica
  - Cloud
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
O **Amazon SNS (Simple Notification Service)** é um serviço de mensageria gerenciado pela AWS (Amazon Web Services) que permite o envio de mensagens e notificações para diversos endpoints e assinantes de forma rápida, escalável e flexível.  

# **Principais características do Amazon SNS:**  
1. **Publicação/Assinatura (Pub/Sub):**  
   - Permite que produtores (**publishers**) enviem mensagens para tópicos, que são então distribuídos para múltiplos assinantes (**subscribers**).  

2. **Múltiplos Protocolos Suportados:**  
   - **HTTP/HTTPS** (para notificações em APIs web)  
   - **Email** (SMTP, JSON, etc.)  
   - **SMS** (mensagens de texto para celulares)  
   - **AWS Lambda** (disparar funções serverless)  
   - **Amazon SQS** (filas de mensagens)  
   - **Aplicativos móveis (Push Notification)** (via APNs da Apple, FCM do Google, etc.)  

3. **Alta Escalabilidade e Disponibilidade:**  
   - Gerencia automaticamente a infraestrutura, permitindo o envio de milhões de mensagens por segundo.  

4. **Segurança:**  
   - Suporte a **IAM (Identity and Access Management)** para controle de acesso.  
   - Criptografia de mensagens com **KMS (Key Management Service)**.  

5. **Uso em Arquiteturas Serverless e Aplicações em Tempo Real:**  
   - Integração com **AWS Lambda**, **SQS**, **EventBridge**, etc.  
   - Usado para alertas, notificações de sistemas, CI/CD, e comunicação entre microsserviços.  

### **Casos de Uso Comuns:**  
✔ **Alertas e Monitoramento** (ex: notificações do CloudWatch).  
✔ **Notificações em Aplicativos Móveis** (push notifications).  
✔ **Mensageria entre Microsserviços** (com SQS ou Lambda).  
✔ **Distribuição de Eventos em Tempo Real** (como atualizações de pedidos em e-commerce).  

### **Exemplo de Funcionamento:**  
1. Um serviço (como um aplicativo) publica uma mensagem em um **tópico SNS**.  
2. O SNS encaminha essa mensagem para todos os assinantes cadastrados (como emails, celulares, filas SQS ou funções Lambda).  

Se você está usando AWS, o SNS é uma ótima opção para comunicação assíncrona e notificações distribuídas.  

Quer saber mais sobre como configurar ou integrações específicas? 😊