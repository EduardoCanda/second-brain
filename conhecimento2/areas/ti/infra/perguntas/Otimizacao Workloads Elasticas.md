---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria: questoes
---
## Como você acompanha e otimiza custos em workloads altamente elásticos na AWS?

### ✅ **Resposta completa:**

Em workloads altamente elásticos — como aplicações serverless, APIs em [[Fargate]], [[Meu resumo EKS|EKS]] com [[Auto Scaling|autoscaling]] ou serviços com bursts imprevisíveis — **custos podem escalar rapidamente e de forma invisível**. Meu papel como Staff Engineer é **garantir visibilidade, previsibilidade e controle**, sem prejudicar performance ou agilidade.

---

### **Minha abordagem segue 5 frentes principais:**

---

### **1. Visibilidade total com tagging e dashboards de custo**

- **Aplico cost allocation tags obrigatórias** por projeto, time, ambiente e tipo de workload.
- Centralizo relatórios no **Cost Explorer**, **AWS Budgets** e, quando necessário, **QuickSight** com dados do **CUR (Cost and Usage Report)**.
- Configuro **alertas de anomalias com AWS Cost Anomaly Detection** para detectar desvios de padrão.

---

### **2. Monitoramento contínuo com métricas por unidade**

- Cruzo métricas de CloudWatch (CPU, memória, invocações) com **custo estimado por recurso**.
- Acompanho métricas de eficiência como:
    - Custo por request (`$ / 1000 req`)
    - Custo por GB processado
    - Custo por invocação (no caso de Lambda)
- Exemplo: em Fargate, monitoro o percentual de uso de CPU/memória vs. alocação para identificar overprovisioning.

---

### **3. Dimensionamento e right-sizing automatizado**

- Aplico **autoscaling com limites bem definidos**: limites mínimos e máximos realistas para EC2, Fargate e Kubernetes pods.
- Uso ferramentas como:
    - **Compute Optimizer** para EC2/ECS/EKS.
    - **Karpenter (EKS)** ou **Cluster Autoscaler** para ajustar nodes dinamicamente.
    - **Lambda Power Tuning** para encontrar o melhor balanceamento entre performance e custo.

---

### **4. Otimizações com modelos de compra adequados**

- Uso de:
    - **Spot Instances** para jobs tolerantes a interrupções (como batch ou processamento paralelo).
    - **Savings Plans** ou **Reserved Instances** para workloads previsíveis com commitment de 1 ou 3 anos.
- Avalio o uso de **Graviton2/3** como instâncias ARM para reduzir custos em APIs e containers.

---

### **5. Acompanhamento com cultura de FinOps**

- Compartilho **dashboards de custo com os times**, envolvendo squads nas decisões de otimização.
- Crio **workshops internos de conscientização de custo**, mostrando o impacto de decisões arquiteturais no billing.
- Promovo práticas como:
    - “Stop the idle”: destruir ambientes não utilizados.
    - “Fail fast”: não deixar recursos sob utilização mínima em auto scaling groups mal dimensionados.

---

### ✅ **Exemplo prático:**

Em um ambiente com workloads Fargate e Lambda, identifiquei aumento de custo de 40% em dois meses. Ao investigar:

- Notei aumento no timeout de Lambdas causado por novas dependências.
- Ajustei memória e timeout para valores ideais com base em profiling.
- Adicionei throttling controlado no API Gateway.
- Resultado: redução de 28% no custo total sem afetar performance.

---

### ✅ Conclusão:

Otimizando custos em workloads elásticos exige **monitoramento contínuo, automação de ajuste, compra inteligente de recursos e, principalmente, cultura técnica de ownership financeiro.** Como Staff, meu papel é **antecipar desperdícios, promover práticas FinOps e alinhar eficiência com a estratégia da organização.**
