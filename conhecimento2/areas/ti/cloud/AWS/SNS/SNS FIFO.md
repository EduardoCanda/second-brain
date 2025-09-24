---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
Sim, o **Amazon SNS (Simple Notification Service) suporta filas FIFO (First-In, First-Out)** desde novembro de 2021, mas com algumas particularidades importantes. Vamos detalhar:

---

## **📌 SNS FIFO: Funcionamento e Características**
### **1. O que é um Tópico FIFO no SNS?**
- Mantém a **ordem estrita das mensagens** (a primeira publicada é a primeira entregue).  
- Elimina **duplicações** (deduplicação de mensagens).  
- Projetado para integração com **filas SQS FIFO** (não suporta todos os endpoints do SNS padrão).  

### **2. Quando Usar SNS FIFO?**
✔ **Ordem de mensagens é crítica** (ex: processamento de transações financeiras).  
✔ **Evitar duplicação** (ex: atualizações de estoque em e-commerce).  
✔ **Cenários com SQS FIFO** (para garantir ordem entre microsserviços).  

---

## **🔹 Principais Limitações do SNS FIFO**
| **Recurso**               | **SNS Padrão**          | **SNS FIFO**               |
|---------------------------|-------------------------|----------------------------|
| **Tipos de Assinatura**   | Todos (HTTP, Lambda, SMS, Email, SQS, etc.) | **Apenas SQS FIFO** (não suporta SMS, Email, HTTP, etc.) |
| **Taxa de Transferência** | Alta (milhões de msg/seg) | Limitada (300 msg/seg por tópico) |
| **Disponibilidade**       | Todas as regiões AWS     | Todas as regiões que suportam SQS FIFO |

---

## **🛠 Como Configurar um Tópico FIFO no SNS?**
### **Passo 1: Criar um Tópico FIFO**
- No console da AWS, vá para **SNS > Create Topic**.  
- Selecione **FIFO** e defina um nome terminando em `.fifo` (ex: `pedidos.fifo`).  
- Habilite **Content-Based Deduplication** (se não usar IDs explícitos).  

### **Passo 2: Publicar Mensagens**
```python
import boto3

sns = boto3.client('sns')

response = sns.publish(
    TopicArn='arn:aws:sns:us-east-1:123456789012:pedidos.fifo',
    Message='{"pedido_id": 123, "status": "pago"}',
    MessageGroupId='grupo_pedido_123',  # Ordenação por grupo
    MessageDeduplicationId='123456'     # Evita duplicatas (opcional se Content-Based Deduplication estiver ativado)
)
```

### **Passo 3: Assinar com SQS FIFO**
- Crie uma fila SQS FIFO (ex: `processar-pedidos.fifo`).  
- Assine o tópico SNS FIFO nela.  

---

## **📌 Exemplo Prático: Processamento de Pedidos em Ordem**
**Cenário:** Garantir que atualizações de pedidos (ex: `criado` > `pago` > `enviado`) sejam processadas na ordem correta.  

1. **Publicador (API de Pedidos):**  
   ```python
   # Mensagem 1
   sns.publish(
       TopicArn='arn:aws:sns:us-east-1:123456789012:pedidos.fifo',
       Message='{"pedido_id": 123, "status": "criado"}',
       MessageGroupId='pedido_123'  # Garante ordem para este pedido
   )

   # Mensagem 2
   sns.publish(
       TopicArn='arn:aws:sns:us-east-1:123456789012:pedidos.fifo',
       Message='{"pedido_id": 123, "status": "pago"}',
       MessageGroupId='pedido_123'  # Mesmo grupo = mesma ordem
   )
   ```

2. **Consumidor (SQS FIFO + Lambda):**  
   - A fila SQS FIFO recebe as mensagens **na ordem exata de publicação**.  
   - Uma Lambda processa sequencialmente: `criado` → `pago` → `enviado`.  

---

## **⚡ Comparação: SNS FIFO vs. SQS FIFO**
| **Característica**       | **SNS FIFO**                          | **SQS FIFO**                          |
|--------------------------|---------------------------------------|---------------------------------------|
| **Propósito**            | **Roteamento ordenado** para filas    | **Armazenamento ordenado** de mensagens |
| **Múltiplos Consumidores**| Sim (broadcast para várias SQS FIFO) | Não (uma fila = um consumidor)        |
| **Deduplicação**         | Suporta                               | Suporta                               |

---

## **💡 Melhores Práticas para SNS FIFO**
1. **Defina `MessageGroupId` com cuidado**:  
   - Mensagens com o mesmo `MessageGroupId` são ordenadas juntas.  
   - Ex: Use `pedido_id` para garantir ordem por pedido.  

2. **Use Deduplicação**:  
   - Ative **Content-Based Deduplication** ou forneça um `MessageDeduplicationId`.  

3. **Monitore a Taxa de Transferência**:  
   - Limite de 300 msg/seg por tópico FIFO (se precisar de mais, divida em vários tópicos).  

---

## **❌ Quando NÃO Usar SNS FIFO?**
- Se precisar enviar notificações para **SMS, E-mail, HTTP, ou Lambda diretamente**.  
- Se a taxa de transferência necessária for > 300 msg/seg.  
- Se a ordem das mensagens não for crítica (use SNS padrão para maior flexibilidade).  

---

## **Conclusão**
O **SNS FIFO** é poderoso para cenários onde **ordem e ausência de duplicatas são essenciais**, especialmente em integrações com **SQS FIFO**. Para outros casos, o SNS padrão ainda é a melhor opção.  

Precisa de um exemplo específico para sua arquitetura? Posso ajudar! 🚀