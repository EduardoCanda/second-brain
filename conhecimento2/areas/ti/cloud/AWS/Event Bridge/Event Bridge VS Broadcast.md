---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
### **O EventBridge NÃO é um Broadcast (como o SNS)**  
Enquanto o **Amazon SNS** é um serviço de **broadcast** (uma mensagem é enviada para **todos os assinantes**), o **EventBridge** funciona com **roteamento seletivo** baseado em regras.  

---

## **Diferenças Chave: EventBridge vs. SNS (Broadcast)**  

| Característica       | **EventBridge**                              | **SNS (Broadcast)**                        |
|----------------------|---------------------------------------------|--------------------------------------------|
| **Modelo**           | Roteamento por regras (filtros JSON).       | Publicação para todos os assinantes.       |
| **Destinos**         | Só envia eventos para destinos que casam com a regra. | Envia para todos os subscribers inscritos no tópico. |
| **Filtragem**        | Filtros avançados no conteúdo do evento (ex.: `"detail-type": "EC2 State Change"`). | Filtros básicos por atributos (menos flexível). |
| **Caso de Uso**      | Orquestração complexa (ex.: se evento X, faça A e B). | Notificações em massa (ex.: alertas para 10 sistemas). |

---

## **Por que o EventBridge não é um Broadcast?**  
1. **Seletividade:**  
   - No SNS, se você tem 10 assinantes, todos recebem a mensagem.  
   - No EventBridge, apenas os destinos **com regras que casam com o evento** são acionados.  

2. **Exemplo Prático:**  
   - **Evento:** Um arquivo chega no S3.  
     - Se usar **SNS**: Todas as Lambdas inscritas no tópico recebem o evento (mesmo que só uma precise processar).  
     - Se usar **EventBridge**: Apenas a Lambda com a regra `"eventName": "PutObject"` é acionada.  

3. **Eficiência:**  
   - Evita processamento desnecessário (não dispara funções que não precisam do evento).  

---

## **Quando usar EventBridge vs. SNS?**  
| **Use EventBridge se...**               | **Use SNS se...**                        |
|----------------------------------------|------------------------------------------|
| Precisa de filtros complexos no evento. | Precisa enviar a mesma mensagem para muitos sistemas. |
| Quer orquestrar workflows com múltiplos passos condicionais. | O foco é notificação em massa (ex.: e-mails, SMS). |
| Está integrando eventos de SaaS (Zendesk, Datadog). | Está trabalhando com sistemas legados que usam polling (SQS). |

---

## **Exemplo Técnico: Broadcast (SNS) vs. Roteamento (EventBridge)**  
### **Cenário:** Um pedido é criado em um e-commerce.  

#### **1. Com SNS (Broadcast)**  
- Um tópico SNS chamado `pedidos-criados` envia a mensagem para:  
  - Lambda de **atualizar estoque**.  
  - Lambda de **enviar e-mail de confirmação**.  
  - SQS de **processar pagamento**.  
- **Problema:** Todas as Lambdas recebem o evento, mesmo que algumas não precisem processá-lo.  

#### **2. Com EventBridge (Roteamento Inteligente)**  
- O evento é enviado para o **Event Bus** com detalhes como `"status": "novo"`.  
- **Regra 1:** Se `"status": "novo"` → Dispara Lambda de **atualizar estoque**.  
- **Regra 2:** Se `"status": "novo"` e `"cliente": "premium"` → Dispara Lambda de **enviar e-mail VIP**.  
- **Regra 3:** Se `"pagamento": "pendente"` → Envia para **SQS de pagamentos**.  
- **Vantagem:** Cada ação é acionada apenas se necessário.  

---

## **Conclusão**  
O EventBridge é **mais seletivo e orientado a regras** do que um broadcast puro (como o SNS). Ele é ideal quando você quer:  
- **Evitar processamento desnecessário.**  
- **Aplicar lógica condicional complexa.**  
- **Integrar eventos de múltiplas fontes (AWS, custom apps, SaaS).**  

Se o objetivo é **entregar a mesma mensagem para muitos consumidores simultaneamente**, o SNS ainda é a melhor escolha.  

Quer um exemplo de como configurar um filtro avançado no EventBridge? Posso mostrar! 😊