---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
Ótimo questionamento! Vamos explorar se usar **FIFO (First-In, First-Out)** com o **Amazon EventBridge** faz sentido — e quando isso é (ou não) recomendado.  

---

## **Resposta Direta: EventBridge NÃO Suporta FIFO**  
O EventBridge **não tem capacidade nativa de FIFO**, pois foi projetado para **roteamento flexível de eventos**, não para garantir ordem estrita. Se você precisa de FIFO, considere outros serviços da AWS, como:  

- **Amazon SQS FIFO** (para filas ordenadas).  
- **Amazon Kinesis** (para streaming de eventos ordenados).  
- **Step Functions** (para orquestração com passos sequenciais).  

---

## **Por Que o EventBridge Não é FIFO?**  
1. **Arquitetura Orientada a Eventos ≠ FIFO**  
   - O EventBridge prioriza **escalabilidade** e **baixa latência**, não ordenação.  
   - Eventos podem ser processados **em paralelo** por múltiplos consumidores.  

2. **Casos de Uso Típicos do EventBridge Não Exigem FIFO**  
   - Exemplo 1: Um arquivo chega no S3 → Disparar uma Lambda para processá-lo. **Não importa a ordem**.  
   - Exemplo 2: Uma métrica do CloudWatch indica alta CPU → Aumentar instâncias EC2. **Ordem é irrelevante**.  

3. **Alternativas para Garantir Ordem**  
   Se você **precisa** de FIFO em um fluxo que usa EventBridge:  
   - Use **SQS FIFO** como destino do EventBridge para enfileirar eventos na ordem correta.  
   - Use **Kinesis** para streams ordenados (o EventBridge pode enviar eventos para um Kinesis Stream).  

---

## **Exemplo Prático: Como Contornar a Falta de FIFO**  
### **Cenário:** Processar pedidos de e-commerce **na ordem de chegada**.  
1. **EventBridge** recebe eventos de pedidos (ex.: `"pedido-123"`, `"pedido-456"`).  
2. **Regra no EventBridge** envia os eventos para uma **Fila SQS FIFO** (que garante ordem).  
3. **Lambda** consome os pedidos da fila SQS FIFO **na ordem exata**.  

```yaml
# Exemplo de regra no EventBridge (usando SQS FIFO como destino)
Targets:
  - Arn: "arn:aws:sqs:us-east-1:123456789012:pedidos-queue.fifo"
    Id: "SQS-FIFO-Target"
    SqsParameters:
      MessageGroupId: "pedidos"  # Obrigatório para FIFO
```

---

## **Quando o EventBridge é Ideal (Mesmo Sem FIFO)?**  
Use o EventBridge quando:  
✅ **Ordem não é crítica** (ex.: logs, notificações, automações).  
✅ Você precisa de **filtros complexos** (ex.: "só processar eventos de EC2 com `state = stopped`").  
✅ Quer **integrar múltiplos serviços AWS/SaaS** sem gerenciar filas.  

Evite o EventBridge quando:  
❌ **Ordem estrita é obrigatória** (ex.: transações financeiras, auditoria sequencial).  
❌ Você precisa de **replay de eventos** (use Kinesis).  

---

## **Comparação Rápida: FIFO vs. EventBridge**  
| Serviço          | Garante Ordem? | Melhor Para...                          |
|------------------|---------------|----------------------------------------|
| **SQS FIFO**     | ✅ Sim         | Filas duráveis com ordem estrita.       |
| **Kinesis**      | ✅ Sim         | Streaming de eventos ordenados.         |
| **EventBridge**  | ❌ Não         | Roteamento dinâmico e filtragem avançada. |

---

## **Conclusão**  
Se você **precisa de FIFO**, combine o EventBridge com **SQS FIFO** ou **Kinesis**. Caso contrário, aproveite a flexibilidade do EventBridge para cenários onde a ordem não é prioritária.  

Quer um exemplo completo com código (CDK/Terraform) para integrar EventBridge + SQS FIFO? Posso elaborar! 🚀