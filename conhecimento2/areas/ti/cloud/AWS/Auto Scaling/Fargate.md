---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
categoria: computacao
---
### **Amazon ECS Fargate: Funcionamento e Conceitos-Chave**  

O **AWS Fargate** é um mecanismo de computação **serverless** para containers, eliminando a necessidade de gerenciar servidores subjacentes (instâncias EC2). Ele é compatível com:  
- **Amazon [[ECS]]** (Elastic Container Service) → Foco nesta explicação.  
- **Amazon [[Meu resumo EKS|EKS]]** (Elastic Kubernetes Service) → Versão "Fargate for EKS".  

---

## **1. Como o Fargate Funciona?**  
### **🔹 Arquitetura Básica**  
1. **Você define:**  
   - Uma **task definition** (configuração do container: imagem, CPU, memória, portas).  
   - Um **serviço ECS** (se desejar orquestração contínua).  
2. **O Fargate provisiona automaticamente:**  
   - Recursos computacionais (CPU/memória) sob demanda.  
   - Isolamento por task (cada task roda em um sandbox dedicado).  

### **🔹 Comparação: Fargate vs. ECS com EC2**  
| **Característica**       | **Fargate**                          | **ECS com EC2**                     |  
|--------------------------|--------------------------------------|-------------------------------------|  
| **Gerenciamento**        | AWS gerencia a infraestrutura.       | Você gerencia instâncias EC2.       |  
| **Escalonamento**        | Escala apenas tasks (não há "nodes").| Escala tasks **e** instâncias EC2.  |  
| **Cobrança**            | Por vCPU/memória **por tarefa**.    | Por instância EC2 (+ custos ECS).   |  
| **Use Cases**           | Microservices, workloads efêmeros.  | Workloads estáveis, custo otimizado.|  

---

## **2. Componentes do ECS Fargate**  
### **🔹 Task Definition**  
Arquivo JSON que define:  
- Imagem do container (ex.: `nginx:latest`).  
- Recursos alocados (ex.: `2 vCPUs`, `4GB RAM`).  
- Variáveis de ambiente, portas mapeadas, volumes.  

**Exemplo (simplificado):**  
```json
{
  "family": "my-fargate-task",
  "networkMode": "awsvpc",
  "cpu": "2 vCPU",
  "memory": "4 GB",
  "containerDefinitions": [
    {
      "name": "nginx",
      "image": "nginx:latest",
      "portMappings": [{ "containerPort": 80 }]
    }
  ]
}
```

### **🔹 Service (Opcional)**  
- Mantém um número desejado de tarefas em execução (**auto healing**).  
- Pode ser vinculado a um **Application Load Balancer (ALB)**.  

### **🔹 Networking (awsvpc Mode)**  
- Cada task Fargate recebe seu próprio **Elastic Network Interface (ENI)**.  
- Permite atribuir IPs privados/públicos, Security Groups, e subnets.  

---

## **3. Escalonamento no Fargate**  
O Fargate **não usa ASG** (já que não há instâncias EC2). Em vez disso:  
### **🔹 Service Auto Scaling**  
- Ajusta o número de **tarefas** com base em métricas (CPU, memória, custom).  
- **Exemplo (CLI):**  
  ```bash
  aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --resource-id service/my-cluster/my-fargate-service \
    --scalable-dimension ecs:service:DesiredCount \
    --min-capacity 1 \
    --max-capacity 10
  ```

### **🔹 Scheduled Scaling**  
- Útil para horários previsíveis (ex.: aumentar tarefas às 9h).  

---

## **4. Preços do Fargate**  
- **Cobrança por segundo** (com mínimo de 1 minuto).  
- **Fatores de custo:**  
  - **vCPU** (ex.: $0.04048/hora para 1 vCPU em us-east-1).  
  - **Memória** (ex.: $0.004445/GB-hora).  
- **Exemplo:**  
  - 1 tarefa com **2 vCPUs + 4GB RAM** = ±$0.20/hora.  

---

## **5. Quando Usar Fargate?**  
✅ **Workloads efêmeras** (jobs batch, APIs stateless).  
✅ **Evitar gestão de servidores** (patches, segurança, scaling).  
✅ **Ambientes de desenvolvimento/teste** (rápido deploy).  

### **❌ Quando Evitar?**  
- **Workloads stateful** (ex.: bancos de dados).  
- **Aplicações com GPU** (Fargate suporta GPU, mas é caro).  
- **Cargas muito previsíveis** (EC2 pode ser mais barato).  

---

## **6. Exemplo Prático: Deploy de um Serviço Fargate**  
### **Passo 1: Criar uma Task Definition**  
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### **Passo 2: Criar um Serviço ECS**  
```bash
aws ecs create-service \
  --cluster my-fargate-cluster \
  --service-name my-fargate-service \
  --task-definition my-fargate-task:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-123456],securityGroups=[sg-123456]}"
```

### **Passo 3: Configurar Auto Scaling (Opcional)**  
```bash
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-target-scaling \
  --service-namespace ecs \
  --resource-id service/my-fargate-cluster/my-fargate-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{"TargetValue":70,"PredefinedMetricSpecification":{"PredefinedMetricType":"ECSServiceAverageCPUUtilization"}}'
```

---

## **7. Segurança no Fargate**  
- **Isolamento:** Cada task roda em um sandbox dedicado (Firecracker microVM).  
- **IAM Roles:** Atribua permissões mínimas às tasks.  
- **Security Groups:** Controle tráfego de rede por task.  

---

## **8. Vantagens do Fargate**  
🚀 **Zero gestão de infraestrutura** (sem EC2, SSH, patches).  
📊 **Escalonamento fino** (por tarefa, não por instância).  
🔒 **Isolamento nativo** entre tasks.  

---

## **Resumo Final**  
O **Fargate** é a opção **serverless** para containers na AWS:  
- **Ideal** para workloads stateless e microservices.  
- **Pague apenas pelos recursos** (vCPU/memória) usados por tarefa.  
- **Integrado** com ECS/EKS, ALB, CloudWatch.  

Quer um tutorial passo a passo para deploy de uma aplicação real? Posso guiar! 💡