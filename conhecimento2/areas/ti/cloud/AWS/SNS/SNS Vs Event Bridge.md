---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
## **📌 Principais Diferenças: SNS vs. EventBridge**

| **Característica**          | **Amazon SNS**                          | **Amazon EventBridge**                     |
|-----------------------------|----------------------------------------|--------------------------------------------|
| **Modelo de Comunicação**   | Pub/Sub (Publicador-Assinante)         | **Event Bus (Barramento de Eventos)**      |
| **Foco Principal**          | Notificações em tempo real             | **Orquestração de eventos entre serviços** |
| **Formatos Suportados**     | Texto, JSON, SMS, Email, HTTP, etc.   | **Eventos no formato CloudEvents**         |
| **Integração Nativa**       | SQS, Lambda, HTTP, SMS, Email, etc.   | **100+ serviços AWS e SaaS (Zapier, Datadog, etc.)** |
| **Filtragem de Mensagens**  | Básica (atributos simples)            | **Filtros avançados (JSON Path, regras complexas)** |
| **Encaminhamento**          | Um-para-muitos (broadcast)             | **Roteamento inteligente com regras**      |
| **Casos de Uso Comuns**     | Alertas, notificações, fan-out        | **Arquitetura orientada a eventos (EDA), integração entre sistemas** |

---

## **🔹 Amazon SNS (Simple Notification Service)**
- **Funciona como um sistema de Pub/Sub**:  
  - Um publicador envia uma mensagem para um **tópico**, e vários assinantes recebem.  
  - **Não tem roteamento inteligente**: Todos os assinantes recebem a mesma mensagem (a menos que usem filtros básicos).  
- **Ótimo para:**  
  - Notificações em massa (SMS, e-mail, push).  
  - Fan-out para filas SQS ou funções Lambda.  
  - Casos simples de broadcast.  

### **Exemplo de Uso do SNS:**
```python
# Publica uma mensagem em um tópico SNS
sns.publish(
    TopicArn="arn:aws:sns:us-east-1:123456789012:MeuTopico",
    Message="Alerta: Servidor offline!",
    Subject="ALERTA"
)
```
👉 **Todos os assinantes (e-mail, Lambda, SQS) recebem a mesma mensagem.**

---

## **🔹 Amazon EventBridge**
- **Funciona como um barramento de eventos (Event Bus)**:  
  - Coleta eventos de **diversas fontes** (AWS, SaaS, custom apps).  
  - **Roteamento inteligente**: Usa **regras** para filtrar e enviar eventos apenas para os destinos certos.  
- **Ótimo para:**  
  - Arquiteturas orientadas a eventos (EDA).  
  - Integração entre múltiplos serviços AWS e externos (Salesforce, Slack, etc.).  
  - Casos complexos onde apenas alguns eventos devem acionar ações específicas.  

### **Exemplo de Uso do EventBridge:**
```python
# Envia um evento personalizado para o EventBridge
eventbridge.put_events(
    Entries=[
        {
            "Source": "meu.app",
            "DetailType": "PedidoAtualizado",
            "Detail": '{"pedidoId": "123", "status": "entregue"}',
            "EventBusName": "default"
        }
    ]
)
```
👉 **Uma regra no EventBridge pode filtrar apenas eventos do tipo `PedidoAtualizado` e enviar para um Lambda ou SQS.**

---

## **📌 Quando Usar Cada Um?**
| **Use o SNS se...**                     | **Use o EventBridge se...**               |
|----------------------------------------|------------------------------------------|
| Precisar de notificações simples (SMS, e-mail). | Quiser rotear eventos entre vários serviços AWS/SaaS. |
| Quiser um sistema Pub/Sub simples (um-para-muitos). | Precisar de filtros avançados (ex: "só eventos de erro"). |
| Estiver usando SQS ou Lambda para fan-out. | Estiver construindo uma arquitetura EDA (Event-Driven Architecture). |

---

## **🎯 Exemplo Prático:**
### **Cenário:** Um e-commerce quer enviar notificações quando um pedido é atualizado.  
- **Com SNS:**  
  - Publica uma mensagem no tópico `Pedidos`.  
  - Todos os assinantes (SMS, e-mail, Lambda) recebem a mesma mensagem.  
  - Se um assinante só quer "pedidos entregues", precisa filtrar internamente.  

- **Com EventBridge:**  
  - Publica um evento `PedidoAtualizado` com `status="entregue"`.  
  - Uma **regra** filtra apenas eventos com `status="entregue"` e envia para um Lambda.  
  - Outra regra pode enviar eventos de `status="cancelado"` para um SQS.  

---

## **Conclusão:**
- **SNS** = Melhor para **notificações simples e broadcast**.  
- **EventBridge** = Melhor para **orquestração de eventos complexos e integrações**.  

Se precisar de algo **híbrido**, é possível usar os dois juntos (ex: SNS publica no EventBridge).  

Quer um exemplo de implementação com os dois? Posso ajudar! 😊