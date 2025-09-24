---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
### **Como Funciona o "Event Bus" no Amazon EventBridge?**  
O **Event Bus** (ou "Barramento de Eventos") é o **coração do EventBridge** — um canal que recebe eventos de diferentes fontes e os encaminha para destinos com base em regras.  

Aqui está uma explicação detalhada sobre como ele funciona:  

---

## **1. Tipos de Event Bus no EventBridge**  
Existem **dois tipos principais** de Event Buses:  

### **a) Event Bus Padrão (Default Event Bus)**  
- **O que é?** Criado automaticamente pela AWS em sua conta.  
- **Recebe eventos nativos de serviços AWS** (ex.: CloudTrail, EC2, S3, Lambda).  
- **Não pode ser excluído**, mas pode ser desativado.  

### **b) Event Bus Personalizado (Custom Event Bus)**  
- **O que é?** Criado por você para eventos de aplicações próprias ou SaaS (ex.: Zendesk, Stripe).  
- **Permite isolamento lógico** (ex.: um bus para "e-commerce" e outro para "logística").  
- **Pode ser compartilhado entre contas AWS** (via políticas de permissão).  

---

## **2. Arquitetura de um Event Bus**  
Cada Event Bus opera de forma independente, seguindo este fluxo:  

```
[Fontes de Eventos]  
       ↓  
[Event Bus]  
       ↓  
[Regras (Rules) → Filtram e roteiam eventos]  
       ↓  
[Destinos (Targets) → Lambda, SQS, SNS, etc.]  
```

---

## **3. Como os Eventos Entram em um Event Bus?**  
Os eventos podem vir de:  

### **a) Serviços AWS (via Default Event Bus)**  
- Exemplo: Um arquivo é enviado ao **S3** → Gera um evento que vai para o **Default Event Bus**.  

### **b) Suas Aplicações (via PutEvents API)**  
- Você pode enviar eventos personalizados usando o SDK da AWS:  
  ```python
  import boto3
  client = boto3.client('events')

  response = client.put_events(
      Entries=[
          {
              'Source': 'minha-aplicacao',
              'DetailType': 'pedido-criado',
              'Detail': '{"pedido_id": "123", "cliente": "João"}',
              'EventBusName': 'meu-bus-customizado'  # Opcional (usa o default se omitido)
          }
      ]
  )
  ```

### **c) Parceiros SaaS (via EventBridge Partners)**  
- Serviços como **Datadog, PagerDuty, Zendesk** podem enviar eventos para seu Event Bus.  

---

## **4. Regras (Rules) e Filtragem**  
Cada Event Bus tem **regras** que definem:  
- **Quais eventos** devem ser processados (usando **Event Patterns**).  
- **Para onde** enviar (destinos como Lambda, SQS, etc.).  

Exemplo de **Event Pattern** (filtro em JSON):  
```json
{
  "source": ["minha-aplicacao"],
  "detail-type": ["pedido-criado"],
  "detail": {
    "cliente": ["João"]
  }
}
```
- Se um evento **bater com o padrão**, ele é enviado aos **destinos configurados**.  

---

## **5. Múltiplos Event Buses em uma Conta AWS**  
Você pode ter **vários Event Buses** na mesma conta para:  
- **Isolar fluxos** (ex.: um bus para produção e outro para desenvolvimento).  
- **Compartilhar eventos entre contas AWS** (via resource policies).  

Exemplo de criação de um **Custom Event Bus**:  
```bash
aws events create-event-bus --name meu-bus-customizado
```

---

## **6. Quando Usar Múltiplos Event Buses?**  
| Cenário                            | Recomendação                          |
| ---------------------------------- | ------------------------------------- |
| **Eventos de serviços AWS**        | Use o **Default Event Bus**.          |
| **Aplicações internas**            | Crie um **Custom Event Bus**.         |
| **Integração com SaaS externos**   | Use um **Custom Event Bus dedicado**. |
| **Multi-tenant (vários clientes)** | Um bus por tenant (isolamento).       |

---

## **7. Limites e Boas Práticas**  
- **Limite de Event Buses por conta**: 100 (pode aumentar via suporte AWS).  
- **Regras por Event Bus**: Até 300.  
- **Boas práticas**:  
  - Use **nomes descritivos** para buses (ex.: `ecommerce-pedidos`).  
  - **Evite sobrecarregar o Default Event Bus** com eventos customizados.  
  - **Monitore** métricas como `InvocationsFailed` no CloudWatch.  

---

## **8. Exemplo de Fluxo com Múltiplos Buses**  
1. **Evento no S3** → Default Event Bus → Regra → Lambda (processa arquivo).  
2. **Evento no Stripe** → Custom Event Bus `pagamentos` → Regra → SQS (fila de cobrança).  
3. **Evento no Zendesk** → Custom Event Bus `suporte` → Regra → Step Functions (fluxo de tickets).  

---

## **Conclusão**  
O **Event Bus** é o "canal central" do EventBridge, podendo ser:  
- **Padrão** (para eventos AWS) ou **Customizado** (para seus apps/SaaS).  
- **Vários buses podem coexistir** para organizar fluxos distintos.  
- **Regras determinam** quais eventos são roteados e para onde.  

Se precisar de um exemplo completo com **CDK/Terraform** para configurar um Custom Event Bus, é só pedir! 😊