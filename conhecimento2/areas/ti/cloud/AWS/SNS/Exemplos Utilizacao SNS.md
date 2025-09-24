---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
Aqui estão **diversos exemplos práticos** de como o **Amazon SNS (Simple Notification Service)** pode ser utilizado em diferentes cenários, desde notificações simples até arquiteturas complexas:

---

## **📌 1. Alertas de Monitoramento (CloudWatch + SNS)**
**Cenário:** Receber alertas quando um servidor AWS (EC2) atingir 80% de CPU.  
**Como implementar:**  
1. Crie um tópico SNS (`alerta-cpu`).  
2. Configure um alarme no **CloudWatch** para monitorar a CPU.  
3. Defina o SNS como destino do alarme.  
4. Assine o tópico com e-mails, SMS ou Lambda para tratamento.  

**Exemplo de mensagem:**  
```plaintext
Alerta: CPU da instância i-123456 chegou a 85% às 2025-06-29T14:00:00Z.
Ação recomendada: Verificar processos ou escalar.
```

---

## **📌 2. Notificações de Pedidos (E-commerce)**
**Cenário:** Avisar clientes sobre status de pedidos (SMS/E-mail).  
**Como implementar:**  
1. Quando um pedido é atualizado no banco de dados, publique no SNS:  
   ```python
   sns.publish(
       TopicArn="arn:aws:sns:us-east-1:123456789012:pedidos",
       Message='{"pedido_id": "789", "status": "enviado"}',
       Subject="Seu pedido foi enviado!"
   )
   ```
2. Assinantes podem ser:  
   - **SMS** para clientes.  
   - **Lambda** para atualizar um sistema interno.  
   - **E-mail** com detalhes do pedido.  

---

## **📌 3. Fan-Out para Filas SQS (Microsserviços)**
**Cenário:** Distribuir eventos para múltiplos microsserviços.  
**Como implementar:**  
1. Publique uma mensagem em um tópico SNS:  
   ```json
   {
     "event_type": "usuario_cadastrado",
     "user_id": "abc123"
   }
   ```
2. Várias filas **SQS** (uma para cada serviço) assinam o tópico:  
   - **Fila 1:** Serviço de boas-vindas (envia e-mail).  
   - **Fila 2:** Serviço de analytics (registra o usuário).  

---

## **📌 4. Notificações em Aplicativos Móveis (Push)**
**Cenário:** Enviar notificações push para apps iOS/Android.  
**Como implementar:**  
1. Integre o **SNS com Firebase Cloud Messaging (FCM)** e **Apple Push Notification Service (APNS)**.  
2. Publie uma mensagem:  
   ```python
   sns.publish(
       TargetArn="arn:aws:sns:us-east-1:123456789012:endpoint/app/meu-app-mobile/device/xyz",
       Message='{"title": "Promoção!", "body": "Desconto de 20% hoje!"}'
   )
   ```

---

## **📌 5. Automação de CI/CD (CodePipeline + SNS)**
**Cenário:** Notificar equipe sobre falhas em pipelines de deploy.  
**Como implementar:**  
1. No **AWS CodePipeline**, configure o SNS como destino de eventos.  
2. Assine o tópico com:  
   - **Slack** (via Lambda + Webhook).  
   - **E-mail** para o time de DevOps.  

**Exemplo de mensagem:**  
```plaintext
🚨 Pipeline "backend-deploy" FALHOU no estágio "Build".  
Acesse: https://console.aws.amazon.com/codesuite  
```

---

## **📌 6. Integração com Sistemas Legados (HTTP Webhooks)**
**Cenário:** Enviar dados para um sistema externo via API.  
**Como implementar:**  
1. Crie um tópico SNS e assine com um **endpoint HTTP** (ex: `https://api.empresa.com/webhook`).  
2. Quando uma mensagem for publicada, o SNS enviará um **POST** para o endpoint:  
   ```json
   {
     "Type": "Notification",
     "Message": "{\"cliente_id\": 100, \"acao\": \"atualizar\"}"
   }
   ```

---

## **📌 7. Escalonamento de Incidentes (SNS + Lambda)**
**Cenário:** Alertar equipes diferentes com base na severidade.  
**Como implementar:**  
1. Publique uma mensagem no SNS:  
   ```json
   {
     "severidade": "critico",
     "mensagem": "Banco de dados offline!"
   }
   ```
2. Use **Lambda** para processar e decidir o destino:  
   - **Severidade = crítica** → SMS para o time 24/7.  
   - **Severidade = média** → E-mail para o manager.  

---

## **📌 8. Backup de Banco de Dados (RDS + SNS)**
**Cenário:** Notificar quando um backup do RDS for concluído.  
**Como implementar:**  
1. No **Amazon RDS**, configure eventos para publicar no SNS.  
2. Assine o tópico com:  
   - **E-mail** para administradores.  
   - **Lambda** para registrar em um log central.  

**Exemplo de mensagem:**  
```plaintext
✅ Backup do banco "prod-db" concluído em 2025-06-29 03:00 UTC.  
Tamanho: 50 GB | ARN: arn:aws:rds:us-east-1:123456789012:snapshot:rds:snapshot-2025-06-29-03-00  
```

---

## **📌 9. Chatbots (SNS + Lex/Slack)**
**Cenário:** Enviar comandos de usuários para um chatbot.  
**Como implementar:**  
1. Um app publica mensagens no SNS:  
   ```json
   {
     "user_id": "u123",
     "texto": "Qual o status do meu pedido?"
   }
   ```
2. Uma **Lambda** consome o SNS, processa com **Amazon Lex** e responde via **Slack**.  

---

## **📌 10. IoT (Dispositivos Móveis/Sensores)**
**Cenário:** Alertas de sensores de temperatura.  
**Como implementar:**  
1. Um dispositivo IoT publica no SNS via AWS IoT Core.  
2. O tópico envia:  
   - **SMS** se a temperatura > 30°C.  
   - **SQS** para armazenar os dados no DynamoDB.  

---

## **🎯 Resumo dos Casos de Uso:**
| **Cenário**               | **Fontes**               | **Destinos**                |
|---------------------------|--------------------------|-----------------------------|
| Alertas de infraestrutura | CloudWatch, RDS         | E-mail, SMS, Slack          |
| Notificações de pedidos   | API do e-commerce       | SMS, Lambda, SQS            |
| CI/CD                    | CodePipeline, CodeBuild | Lambda, Webhook             |
| IoT                      | Sensores AWS IoT        | SQS, CloudWatch, Mobile Push |

---

## **💡 Dicas Avançadas:**
- **Filtragem de Mensagens:** Use **MessageAttributes** para direcionar mensagens a assinantes específicos.  
- **Retry e Dead-Letter Queue (DLQ):** Configure filas SQS como fallback para mensagens não entregues.  
- **Segurança:** Use **IAM Policies** e **KMS** para criptografar mensagens sensíveis.  

O SNS é **flexível e pode ser adaptado para quase qualquer cenário de notificação ou mensageria**. Se precisar de um exemplo específico para sua arquitetura, é só perguntar! 😊