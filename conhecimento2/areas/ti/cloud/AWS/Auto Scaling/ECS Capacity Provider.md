---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
categoria: computacao
---
### **O Que São Capacity Providers no Amazon ECS?**  

Os **Capacity Providers** são um recurso do **Amazon ECS** que **automatiza o gerenciamento de infraestrutura** (instâncias EC2 ou Fargate) para executar suas tarefas (tasks) de forma eficiente. Eles simplificam o escalonamento integrando **ECS com Auto Scaling Groups (ASG)** ou **Fargate**, garantindo que você sempre tenha recursos computacionais adequados para suas aplicações containerizadas.  

---

## **1. Para Que Servem os Capacity Providers?**  
- **Gerenciam automaticamente** o número de instâncias EC2 em um cluster ECS com base na demanda das tasks.  
- **Substituem o "Cluster Auto Scaling" legado**, oferecendo uma solução mais integrada e eficiente.  
- **Permitem estratégias avançadas** de provisionamento, como:  
  - Balanceamento entre **Spot e On-Demand Instances**.  
  - Controle fino sobre **capacidade ociosa** (ex.: manter 10% de buffer).  

---

## **2. Tipos de Capacity Providers**  
### **🔹 1. Capacity Providers para EC2**  
Vinculados a um **Auto Scaling Group (ASG)**, escalam instâncias EC2 automaticamente quando:  
- Novas tasks não podem ser alocadas por falta de recursos.  
- A utilização do cluster atinge um limite pré-definido.  

### **🔹 2. Capacity Providers para Fargate**  
Gerenciam recursos serverless (sem instâncias EC2). Você só define:  
- Quantidade de vCPU/memória por task.  
- O Fargate provisiona a infraestrutura automaticamente.  

---

## **3. Como Funcionam?**  
### **🔹 Fluxo Básico**  
1. **Task é criada** (via `run-task` ou Service Auto Scaling).  
2. **ECS tenta alocá-la em uma instância existente** (se usando EC2).  
   - Se houver recursos livres → Task é executada.  
   - Se **não houver recursos** → Task fica no estado `PENDING`.  
3. **Capacity Provider detecta tasks pendentes** e:  
   - **Aciona o ASG** para adicionar instâncias EC2 (se usando EC2).  
   - **Provisiona recursos no Fargate** (se usando Fargate).  
4. **Nova instância é registrada no cluster** e executa as tasks pendentes.  

### **🔹 Estratégias de Provisionamento**  
Você pode definir:  
- **Target Capacity (%)**: Percentual de utilização ideal do cluster (ex.: 90% = mantém 10% de buffer).  
- **Managed Scaling**: Habilita o gerenciamento automático do ASG pelo ECS.  
- **Managed Termination Protection**: Evita que instâncias com tasks ativas sejam terminadas prematuramente.  

---

## **4. Configuração Prática (AWS CLI)**  
### **Passo 1: Criar um Capacity Provider para EC2**  
```bash
aws ecs create-capacity-provider \
  --name my-ec2-provider \
  --auto-scaling-group-provider '{
    "autoScalingGroupArn": "arn:aws:autoscaling:us-east-1:123456789012:autoScalingGroup/...",
    "managedScaling": {
      "status": "ENABLED",
      "targetCapacity": 90  # Mantém 10% de capacidade ociosa
    },
    "managedTerminationProtection": "ENABLED"
  }'
```

### **Passo 2: Associar ao Cluster ECS**  
```bash
aws ecs put-cluster-capacity-providers \
  --cluster my-ecs-cluster \
  --capacity-providers my-ec2-provider FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy '[
    {
      "capacityProvider": "my-ec2-provider",
      "weight": 1,
      "base": 1
    }
  ]'
```
- **`weight`**: Prioridade relativa entre providers (útil para misturar EC2 e Fargate).  
- **`base`**: Número mínimo de tasks que devem usar esse provider.  

---

## **5. Vantagens dos Capacity Providers**  
✅ **Escalonamento mais rápido** que o Cluster Auto Scaling legado.  
✅ **Integração nativa** com ECS e ASG.  
✅ **Suporte a Spot Instances** (reduz custos em até 90%).  
✅ **Controle sobre capacidade ociosa** (evita superprovisionamento).  

---

## **6. Comparação: Capacity Providers vs. Cluster Auto Scaling Legado**  
| **Recurso**               | **Capacity Providers**                  | **Cluster Auto Scaling (Legado)**       |  
|---------------------------|----------------------------------------|----------------------------------------|  
| **Integração**            | Direta com ECS e ASG.                  | Depende de CloudWatch Alarms.          |  
| **Velocidade**            | Mais rápido (responde em segundos).    | Mais lento (depende de alarmes).       |  
| **Estratégias**           | Suporta target capacity e weights.     | Configuração manual complexa.          |  
| **Spot Instances**        | Suporte nativo.                        | Requer configuração adicional.         |  

---

## **7. Quando Usar?**  
- **ECS com EC2**: Para clusters que precisam escalar instâncias automaticamente.  
- **ECS com Fargate**: Para workloads serverless (sem gerenciamento de instâncias).  
- **Ambientes Híbridos**: Misturando EC2, Fargate e Spot Instances.  

---

## **8. Monitoramento**  
Acompanhe métricas no **CloudWatch**:  
- `CapacityProviderCapacity` (capacidade disponível).  
- `CapacityProviderReservation` (utilização atual).  
- `PendingTasksCount` (tasks aguardando recursos).  

---

## **Conclusão**  
Os **Capacity Providers** são a forma moderna e eficiente de:  
1. **Automatizar o provisionamento** de recursos no ECS (EC2 ou Fargate).  
2. **Garantir alta disponibilidade** sem desperdício de custos.  
3. **Simplificar operações** comparado ao método legado.  

Se precisar de um **exemplo completo com Terraform/CloudFormation**, posso fornecer! 🚀