---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
Vamos mergulhar no **funcionamento detalhado do Amazon EventBridge**, explorando sua arquitetura interna, componentes-chave e o fluxo de processamento de eventos.  

---

## **1. Arquitetura do EventBridge: Como os Eventos Fluem**  
O EventBridge segue um modelo **publish-subscribe (pub/sub)** com roteamento baseado em regras. Aqui está o fluxo simplificado:  

```
[Fonte de Eventos] → [Event Bus] → [Regras (Rules)] → [Destinos (Targets)]
```

### **Componentes Principais:**
| Componente             | Descrição                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Evento**             | Um JSON que descreve "o que aconteceu" (ex.: `{"source": "aws.ec2", "detail-type": "EC2 Instance State Change"}`).                  |
| **Event Bus**          | Canal que recebe eventos. Pode ser o **barramento padrão da AWS** (eventos de serviços AWS) ou **customizado** (seus eventos/SaaS). |
| **Regras (Rules)**     | Define como filtrar e rotear eventos para destinos (com padrões JSON).                                                              |
| **Destinos (Targets)** | Serviços que processam o evento (Lambda, SQS, SNS, Step Functions, etc.).                                                           |

---

## **2. O Ciclo de Vida de um Evento no EventBridge**  
Vamos detalhar cada etapa:

### **Passo 1: Geração do Evento**  
- **Fontes comuns:**  
  - **Serviços AWS** (ex.: CloudTrail, EC2, S3, RDS).  
  - **Aplicações customizadas** (via `PutEvents` API).  
  - **SaaS partners** (ex.: Datadog, Zendesk, PagerDuty).  

Exemplo de evento (formato JSON):  
```json
{
  "version": "0",
  "id": "123456-7890-1234-5678-901234567890",
  "detail-type": "EC2 Instance State Change",
  "source": "aws.ec2",
  "account": "123456789012",
  "time": "2025-06-29T12:00:00Z",
  "region": "us-east-1",
  "resources": ["arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0"],
  "detail": {
    "instance-id": "i-1234567890abcdef0",
    "state": "stopped"
  }
}
```

### **Passo 2: Recebimento pelo Event Bus**  
- O evento é enviado para um **Event Bus** (padrão ou customizado).  
- O Event Bus verifica se alguma **regra (Rule)** está associada a ele.  

### **Passo 3: Filtragem por Regras (Event Patterns)**  
As regras usam **padrões JSON** para filtrar eventos. Exemplo de regra:  
```json
{
  "source": ["aws.ec2"],
  "detail-type": ["EC2 Instance State Change"],
  "detail": {
    "state": ["stopped"]
  }
}
```
- Se o evento **bater com o padrão**, ele é encaminhado para os **destinos (Targets)**.  
- Caso contrário, é descartado (a menos que haja um **Dead-Letter Queue** configurado).  

### **Passo 4: Roteamento para Destinos (Targets)**  
Os destinos podem ser:  
- **Serviços AWS:** Lambda, SQS, SNS, Step Functions, Kinesis, etc.  
- **Event Buses em outras contas AWS.**  
- **Conexões com SaaS (via API Destinations).**  

Exemplo de configuração de destino:  
```yaml
Targets:
  - Arn: "arn:aws:lambda:us-east-1:123456789012:function:MyLambda"
    Id: "LambdaProcessEvent"
    InputTransformer:  # Opcional: Transforma o evento antes de enviar
      InputPathsMap:
        instanceId: "$.detail.instance-id"
      InputTemplate: '{"instance": <instanceId>, "action": "restart"}' 
```

### **Passo 5: Processamento pelo Destino**  
- O destino (ex.: Lambda) recebe o evento e executa a lógica desejada.  
- Se o destino falhar, o EventBridge pode **retentar** (at tentativas configuráveis) ou enviar para uma **Dead-Letter Queue (DLQ)**.  

---

## **3. Recursos Avançados do EventBridge**  

### **a) Input Transformers**  
Permite **modificar o evento antes de enviar ao destino**. Útil para:  
- Extrair apenas campos específicos.  
- Reformatar o JSON para o destino.  

Exemplo:  
```json
"InputTransformer": {
  "InputPathsMap": {
    "time": "$.time",
    "instance": "$.detail.instance-id"
  },
  "InputTemplate": '{"timestamp": <time>, "resource": <instance>}'
}
```

### **b) EventBridge Schema Registry**  
- Armazena esquemas JSON de eventos para validação e geração de código.  
- Ajuda a padronizar eventos entre equipes.  

### **c) EventBridge Pipes**  
(Disponível em cenários específicos)  
- Conecta **uma única fonte de eventos (ex: SQS, DynamoDB Stream) a um destino** sem precisar de regras complexas.  
- Oferece filtragem e transformação no meio do caminho.  

### **d) API Destinations**  
- Envia eventos para **APIs HTTP externas** (ex.: Slack, Salesforce).  
- Suporta autenticação (OAuth, API Keys).  

---

## **4. Limites e Considerações**  
| Item                   | Limite Padrão (pode aumentar via suporte AWS) |
|------------------------|-----------------------------------------------|
| **Eventos por segundo** | 10.000 (por região)                          |
| **Regras por Event Bus** | 300                                           |
| **Destinos por Regra**  | 5                                             |
| **Tamanho do Evento**   | 256 KB (se maior, usar armazenamento no S3)   |

- **Latência:** Geralmente < 1 segundo entre evento e disparo.  
- **Ordenação:** Eventos **não são garantidos como ordenados** (para isso, use Kinesis ou SQS FIFO).  

---

## **5. Comparação com Outros Serviços AWS**  
| Serviço          | Melhor Para...                                | Diferença Chave                           |
|------------------|---------------------------------------------|------------------------------------------|
| **EventBridge**  | Roteamento complexo de eventos              | Filtros JSON avançados e múltiplos destinos. |
| **SNS**         | Pub/Simples (1 evento → muitos assinantes)  | Sem filtragem avançada.                  |
| **SQS**         | Filas duráveis para processamento assíncrono | Necessário "puxar" mensagens.            |
| **Kinesis**     | Streaming de dados em tempo real            | Ordenação e replay de eventos.           |

---

## **6. Exemplo Prático: Monitoramento de EC2**  
**Objetivo:** Receber um alerta no Slack quando uma instância EC2 é parada.  

1. **Evento Gerado:**  
   - AWS EC2 emite um evento `"EC2 Instance State Change"` → `"state": "stopped"`.  

2. **Regra no EventBridge:**  
   ```json
   {
     "source": ["aws.ec2"],
     "detail-type": ["EC2 Instance State Change"],
     "detail": {
       "state": ["stopped"]
     }
   }
   ```

3. **Destino:**  
   - Um **Lambda** que formata a mensagem e envia para o **Slack** via webhook.  

4. **Resultado:**  
   - Mensagem no Slack: *"⚠️ Instância i-123456 foi parada em us-east-1!"*.  

---

## **Conclusão**  
O EventBridge é o **cérebro de arquiteturas orientadas a eventos na AWS**, oferecendo:  
✅ **Roteamento flexível** com filtros JSON.  
✅ **Integração nativa** com AWS + SaaS.  
✅ **Serverless** (sem infra para gerenciar).  

Use-o para **orquestrar microsserviços, automatizar respostas e conectar sistemas** de forma desacoplada.  

Precisa de um exemplo passo a passo com a AWS CLI ou CDK? Posso elaborar! 🚀