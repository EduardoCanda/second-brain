---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
O **Amazon EventBridge** é um serviço de **barramento de eventos (event bus)** sem servidor (*serverless*) da AWS que permite conectar aplicações usando dados de eventos provenientes de suas próprias aplicações, de serviços da AWS e de softwares de terceiros.

### **Principais conceitos do EventBridge:**
1. **Eventos** – São registros de algo que aconteceu (ex.: um arquivo foi enviado para o S3, um pedido foi feito em um e-commerce).
2. **Barramento de Eventos (Event Bus)** – Canal que recebe eventos e os encaminha para os destinos corretos.
   - **Barramento padrão (Default Event Bus)** – Recebe eventos dos serviços AWS.
   - **Barramento personalizado (Custom Event Bus)** – Para eventos de suas próprias aplicações ou SaaS.
3. **Regras (Rules)** – Define como os eventos são roteados para os destinos (ex.: Lambda, SNS, SQS, Step Functions).
4. **Destinos (Targets)** – Serviços ou funções que processam os eventos (ex.: AWS Lambda, Amazon SNS, Amazon SQS).

### **Casos de uso comuns:**
✔ **Integração entre serviços AWS** (ex.: disparar uma Lambda quando um arquivo chega no S3).  
✔ **Orquestração de microsserviços** (comunicação assíncrona entre sistemas).  
✔ **Automatização de workflows** (ex.: iniciar um processo quando um pedido é criado).  
✔ **Monitoramento e resposta a eventos** (ex.: alertar quando uma instância EC2 falha).  
✔ **Integração com SaaS** (ex.: conectar com Zendesk, Datadog, PagerDuty).  

### **Diferença entre EventBridge e SNS/SQS:**
- **SNS/SQS** são serviços de mensageria (pub/sub e filas).  
- **EventBridge** é um barramento de eventos com roteamento avançado baseado em regras (filtros JSON).  

### **Exemplo de arquitetura:**
1. Um **aplicativo** envia um evento para o **EventBridge**.  
2. Uma **regra** filtra esse evento e o envia para uma **Lambda**.  
3. A **Lambda** processa o evento e executa uma ação.  

É um serviço muito útil para **arquiteturas orientadas a eventos (event-driven)** e **automatizações na AWS**.  

Quer um exemplo prático de como configurar? 😊