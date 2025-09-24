---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
categoria: computacao
---
Ótima pergunta! O **[[Auto Scaling Group]] (ASG)** na AWS é **específico para instâncias [[EC2]]** e não escala containers diretamente. No entanto, ele pode ser **indiretamente usado** para escalar a infraestrutura que executa containers (como nós worker em [[Meu resumo EKS|EKS]] ou instâncias em clusters [[ECS]]). Vamos detalhar:

---

## **1. ASG é Apenas para Instâncias EC2?**  
✅ **Sim**, o ASG é um recurso do **EC2** e só escala **máquinas virtuais (instâncias)**.  
❌ **Não** escala containers diretamente (como tarefas ECS ou [[pod|pods]] [[kubernetes]]).  

---

## **2. Como o ASG se Relaciona com Containers?**  
Embora o ASG não escale containers, ele é usado em conjunto com serviços de orquestração para **gerenciar a infraestrutura subjacente**:

### **🔹 Para Amazon ECS (Elastic Container Service)**  
- O ASG controla o número de **instâncias EC2** em um cluster ECS.  
- O **ECS Service Auto Scaling** escala as **tarefas (containers)** dentro dessas instâncias.  
- **Exemplo:**  
  - Se o ECS precisar de mais recursos para executar tarefas, o **Capacity Provider** (vinculado a um ASG) adiciona instâncias automaticamente.  

### **🔹 Para Amazon EKS (Elastic Kubernetes Service)**  
- O ASG gerencia os **nós (nodes) worker** do cluster Kubernetes.  
- O **Cluster Autoscaler** (ou Karpenter) escala o ASG com base em pods pendentes.  
- **Exemplo:**  
  - Se um pod não puder ser alocado por falta de recursos, o Cluster Autoscaler aumenta o ASG.  

---

## **3. Alternativas para Escalonar Containers Diretamente**  
Se você quer escalar **containers/pods** (não a infraestrutura), use:  

### **🔹 No ECS**  
- **Service Auto Scaling**: Escala **tarefas** com base em CPU/memória.  
  ```bash
  aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --resource-id service/my-cluster/my-service \
    --scalable-dimension ecs:service:DesiredCount \
    --min-capacity 1 \
    --max-capacity 10
  ```

### **🔹 No EKS**  
- **Horizontal Pod Autoscaler (HPA)**: Escala **pods** em um Deployment.  
  ```yaml
  apiVersion: autoscaling/v2
  kind: HorizontalPodAutoscaler
  metadata:
    name: my-app-hpa
  spec:
    scaleTargetRef:
      apiVersion: apps/v1
      kind: Deployment
      name: my-app
    minReplicas: 2
    maxReplicas: 10
    metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
  ```

### **🔹 No AWS Fargate**  
- **Serverless**: Não usa ASG (a AWS gerencia a infraestrutura).  
- O auto scaling é aplicado apenas às **tarefas (ECS) ou pods (EKS)**.  

---

## **4. Comparação: ASG vs. Escalonamento de Containers**  
| **Recurso**               | **Escala**                | **Usado em**               | **Mecanismo**                     |
|---------------------------|---------------------------|----------------------------|------------------------------------|
| **ASG**                   | Instâncias EC2            | ECS (EC2), EKS (nodes)     | Políticas de CPU/tráfego.         |
| **ECS Service Scaling**   | Tarefas (containers)      | ECS                        | Target Tracking (CPU/memória).    |
| **EKS HPA**               | Pods Kubernetes           | EKS                        | HorizontalPodAutoscaler (HPA).    |
| **Cluster Autoscaler**    | Nós Kubernetes (via ASG)  | EKS                        | Escalonamento baseado em pods.    |

---

## **5. Quando Usar ASG com Containers?**  
- Se você estiver usando **ECS com launch type EC2** (não Fargate).  
- Se você estiver usando **EKS com self-managed nodes** (não Fargate).  
- Se precisar controlar **o tipo de instância, Spot/On-Demand, ou configurações de rede**.  

---

## **6. Conclusão**  
- **ASG escala apenas instâncias EC2**, mas é **indiretamente usado** em clusters ECS/EKS para prover infraestrutura.  
- Para escalar **containers/pods**, use:  
  - **ECS Service Auto Scaling** (para tarefas).  
  - **EKS HPA + Cluster Autoscaler** (para pods e nós).  
- **Fargate** elimina a necessidade de ASG (a AWS gerencia a infraestrutura).  

Se você quer um exemplo prático de como configurar um ASG para um cluster EKS ou ECS, posso te guiar! 🚀