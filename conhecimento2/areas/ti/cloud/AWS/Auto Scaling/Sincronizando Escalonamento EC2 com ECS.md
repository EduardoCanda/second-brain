---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
categoria: computacao
---
### **Como o ECS com EC2 Escala Instâncias para Atender a Demanda de Tasks**  

Quando você usa **Amazon ECS com instâncias EC2** (não [[Fargate]]), o sistema precisa **sincronizar o escalonamento das tasks (containers) com o das instâncias [[EC2]] subjacentes**. A AWS faz isso através de dois mecanismos principais:  

1. **[[ECS Capacity Provider]]** (recomendado)  
2. **Cluster Auto Scaling (legado, mas ainda usado)**  

Vamos entender como a AWS **identifica a necessidade de mais recursos** e como o **escalonamento é acionado**.  

---

## **1. Como a AWS Sabe que o Cluster Precisa de Mais Instâncias EC2?**  

### **🔹 Situação que Dispara o Escalonamento**  
- Quando o ECS tenta **alocar uma nova task**, mas **não há instâncias EC2 com recursos suficientes** (CPU/memória livres).  
- O ECS verifica:  
  - Se existe uma instância **com recursos ociosos** que possa receber a task.  
  - Se **nenhuma instância disponível** atende aos requisitos da task.  

### **🔹 O Que Acontece?**  
1. A task fica no estado **`PROVISIONING`** (aguardando recursos).  
2. Se o **Capacity Provider** estiver configurado, o ECS **sinaliza ao ASG** que precisa de mais instâncias.  
3. O **Auto Scaling Group (ASG)** adiciona uma nova instância EC2 ao cluster.  
4. A instância é registrada no cluster ECS e começa a executar tasks.  

---

## **2. Mecanismos de Escalonamento Automático**  

### **🔹 1. Capacity Providers (Recomendado)**  
O **Capacity Provider** é a forma moderna de integrar **ECS + ASG**. Ele permite que o ECS **gerencie diretamente o ASG** com base na demanda de tasks.  

#### **Como Funciona?**  
1. Você associa um **Auto Scaling Group (ASG)** a um **Capacity Provider**.  
2. Define uma **estratégia de provisionamento** (ex.: 90% de utilização do cluster).  
3. Quando o ECS detecta falta de recursos:  
   - **Aciona o ASG** para adicionar instâncias.  
   - **Escala as tasks** (se o Service Auto Scaling estiver configurado).  

#### **Configuração Básica (AWS CLI)**  
```bash
# 1. Crie um Capacity Provider vinculado a um ASG
aws ecs create-capacity-provider \
  --name my-capacity-provider \
  --auto-scaling-group-provider '{
    "autoScalingGroupArn": "arn:aws:autoscaling:us-east-1:123456789012:autoScalingGroup/...",
    "managedScaling": {
      "status": "ENABLED",
      "targetCapacity": 90  # Mantém 10% de capacidade ociosa
    }
  }'

# 2. Associe ao cluster ECS
aws ecs put-cluster-capacity-providers \
  --cluster my-ecs-cluster \
  --capacity-providers my-capacity-provider \
  --default-capacity-provider-strategy '[
    {
      "capacityProvider": "my-capacity-provider",
      "weight": 1,
      "base": 1
    }
  ]'
```

---

### **🔹 2. Cluster Auto Scaling (Método Legado)**  
Antes dos **Capacity Providers**, o ECS usava o **Cluster Auto Scaling**, que dependia de:  
- **CloudWatch Alarms** para monitorar métricas como:  
  - `CPUReservation` (% de CPU reservada pelas tasks).  
  - `MemoryReservation` (% de memória reservada).  
- **AWS Batch** ou scripts personalizados para escalar o ASG.  

#### **Problemas do Método Legado**  
- **Mais lento** (depende de alarmes do CloudWatch).  
- **Menos preciso** (não ajusta dinamicamente como o Capacity Provider).  

---

## **3. Exemplo de Fluxo Completo**  

### **Passo a Passo: Escalonamento de Tasks e Instâncias**  
1. **Task é criada** (via `ecs run-task` ou Service Auto Scaling).  
2. **ECS tenta alocar a task em uma instância existente**:  
   - Se **houver recursos livres**, a task é alocada.  
   - Se **não houver recursos**, a task fica **`PENDING`**.  
3. **Capacity Provider detecta falta de recursos** e solicita mais instâncias ao ASG.  
4. **ASG lança uma nova instância EC2** (baseada no Launch Template).  
5. **Instância é registrada no cluster ECS** e começa a rodar tasks.  
6. **Se a demanda cair**, o ECS pode reduzir as tasks e o ASG remove instâncias ociosas.  

---

## **4. Melhores Práticas para Sincronização**  

### **✔ Use Capacity Providers (em vez do Cluster Auto Scaling legado)**  
- Mais rápido e integrado nativamente ao ECS.  

### **✔ Defina um Target Capacity (ex.: 90%)**  
- Mantém **10% de buffer** para picos repentinos.  

### **✔ Combine com Service Auto Scaling**  
- Escale **tasks** com base em CPU/memória, e o **Capacity Provider** ajusta as instâncias automaticamente.  

### **✔ Monitore Métricas do ECS no CloudWatch**  
- `CPUReservation` / `MemoryReservation` → Mostram a utilização do cluster.  
- `PendingTasksCount` → Indica se faltam recursos.  

### **✔ Use Instâncias Spot para Reduzir Custos**  
- Configure o ASG para usar **Spot Instances** quando possível.  

---

## **5. Exemplo de Problema e Solução**  

### **❌ Problema: Tasks Pendentes (Pending) por Falta de Recursos**  
- **Sintoma:** Tasks ficam em `PENDING` e não são alocadas.  
- **Causas:**  
  - ASG não consegue escalar (limite máximo atingido, sem subnets disponíveis).  
  - Instâncias existentes estão sobrecarregadas.  
- **Solução:**  
  - Verifique o **`PendingTasksCount`** no CloudWatch.  
  - Aumente o **`max_size` do ASG** ou ajuste o **`targetCapacity`**.  

---

## **6. Comparação: ECS com EC2 vs. Fargate**  
| **Caso de Uso**            | **ECS com EC2 (ASG + Capacity Provider)**     | **ECS Fargate**                              |     |
| -------------------------- | --------------------------------------------- | -------------------------------------------- | --- |
| **Escalonamento**          | Escala tasks **e** instâncias EC2.            | Escala **apenas tasks**.                     |     |
| **Controle sobre a Infra** | Você gerencia instâncias (OS, patches, etc.). | AWS gerencia tudo (serverless).              |     |
| **Custo**                  | Pode ser mais barato para cargas estáveis.    | Pago por task (ideal para cargas variáveis). |     |

---

## **Conclusão**  
- O **ECS com EC2** usa **Capacity Providers** (ou Cluster Auto Scaling legado) para **sincronizar o escalonamento de tasks e instâncias**.  
- Quando uma task não pode ser alocada, o **Capacity Provider** aciona o **ASG** para adicionar instâncias.  
- **Monitore `PendingTasksCount` e `CPUReservation`** para evitar gargalos.  

Se quiser um **exemplo completo com Terraform ou CloudFormation**, posso fornecer! 🚀