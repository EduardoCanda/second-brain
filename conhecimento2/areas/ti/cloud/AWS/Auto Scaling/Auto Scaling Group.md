---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: iaas
cloud_provider: aws
categoria: computacao
---
### **Resumo Detalhado sobre Auto Scaling Group (ASG) na AWS**  

O **Auto Scaling Group (ASG)** é um serviço da AWS que **automatiza o dimensionamento de instâncias EC2** para garantir:  
✔ **Disponibilidade** (substitui instâncias falhas).  
✔ **Escalabilidade** (adapta-se à demanda).  
✔ **Custo-eficiência** (evita superprovisionamento).  

---

## **1. O que é o ASG?**  
- **Definição:** Um grupo lógico que gerencia **instâncias EC2 idênticas** (baseadas em um *Launch Template* ou *Launch Configuration*).  
- **Objetivo principal:** Manter o número desejado de instâncias saudáveis (*Desired Capacity*), escalando horizontalmente (para cima/para baixo) conforme políticas definidas.  

---

## **2. Componentes Principais**  

### **🔹 Launch Template / Launch Configuration**  
- **Modelo de configuração** das instâncias (AMI, tipo, SG, IAM role, etc.).  
- Diferença:  
  - *Launch Template* (recomendado): Suporta versões e configurações avançadas.  
  - *Launch Configuration* (legado): Não permite edição após criação.  

### **🔹 Políticas de Scaling (Scaling Policies)**  
Define **quando** e **como** o ASG deve escalar:  
1. **Target Tracking Scaling**  
   - Ajusta automaticamente para manter uma métrica-alvo (ex.: 70% CPU).  
   - Exemplo:  
     ```bash
     aws autoscaling put-scaling-policy --policy-name cpu70-target --auto-scaling-group-name my-asg --policy-type TargetTrackingScaling --target-tracking-configuration '{"PredefinedMetricSpecification": {"PredefinedMetricType": "ASGAverageCPUUtilization"}, "TargetValue": 70.0}'
     ```  
2. **Step Scaling**  
   - Escalonamento em "passos" baseado em limites (ex.: se CPU > 60%, +1 instância; se CPU > 80%, +2 instâncias).  
3. **Scheduled Scaling**  
   - Escalonamento baseado em cronograma (ex.: aumentar instâncias às 9h).  

### **🔹 Health Checks**  
- Verifica a saúde das instâncias:  
  - **EC2 Health Checks** (status da instância).  
  - **ELB Health Checks** (se a aplicação está respondendo).  

### **🔹 Elastic Load Balancer (ELB) Integration**  
- O ASG **registra automaticamente** novas instâncias no ELB (ALB/NLB).  
- Instâncias não saudáveis são substituídas.  

---

## **3. Configurações Chave**  
| Parâmetro             | Descrição                                                                 | Exemplo        |  
|-----------------------|---------------------------------------------------------------------------|----------------|  
| **Min Size**          | Número mínimo de instâncias (garante disponibilidade).                    | `2`            |  
| **Max Size**          | Número máximo de instâncias (evita custos excessivos).                    | `10`           |  
| **Desired Capacity**  | Número ideal de instâncias (ajustado pelo ASG).                           | `4`            |  
| **Availability Zones**| Distribuição em múltiplas AZs para tolerância a falhas.                   | `us-east-1a, us-east-1b` |  
| **Cool Down**         | Tempo de espera entre ações de scaling (evita oscilações).                | `300 segundos` |  

---

## **4. Fluxo de Funcionamento**  
1. **Monitoramento**: CloudWatch coleta métricas (CPU, memória, etc.).  
2. **Disparo**: Se uma métrica viola a política, o ASG age:  
   - **Scale-out**: Adiciona instâncias (se carga alta).  
   - **Scale-in**: Remove instâncias (se carga baixa).  
3. **Integração com ELB**: Novas instâncias são registradas no balanceador.  

---

## **5. Casos de Uso Comuns**  
- **Aplicações web**: Escalonamento sob tráfego variável.  
- **Batch processing**: Aumento de instâncias para jobs pesados.  
- **Ambientes tolerantes a falhas**: Substituição automática de instâncias com problemas.  

---

## **6. Melhores Práticas**  
✅ **Use múltiplas AZs** para alta disponibilidade.  
✅ **Combine Spot e On-Demand Instances** para reduzir custos.  
✅ **Defina Health Checks personalizados** (ex.: endpoint `/health`).  
✅ **Monitore métricas** (CPU, memória, RequestCountPerTarget).  
✅ **Teste políticas de scaling** em ambiente de staging.  

---

## **7. Limitações**  
- **Não escala containers diretamente** (só instâncias EC2).  
- **Não é ideal para stateful workloads** (ex.: bancos de dados tradicionais).  

---

## **8. Exemplo de Arquitetura**  
```
[Usuário]  
  ↓  
[Application Load Balancer (ALB)]  
  ↓  
[Auto Scaling Group (ASG)]  
  ├── Instância EC2 (us-east-1a) → Aplicação  
  ├── Instância EC2 (us-east-1b) → Aplicação  
  └── Instância EC2 (us-east-1c) → Aplicação  
```

---

## **Resumo Final**  
O **ASG** é o coração do escalonamento automático de **instâncias EC2** na AWS, garantindo:  
- **Resiliência** (substitui instâncias falhas).  
- **Elasticidade** (cresce/recua com demanda).  
- **Custo-otimização** (paga apenas pelo que usa).  

**Para containers (ECS/EKS)**, o ASG gerencia a infraestrutura, enquanto outros mecanismos (como **HPA** e **Service Auto Scaling**) escalam os containers.  

Espero que essas anotações ajudem! Se precisar de exemplos práticos ou integrações avançadas, é só pedir. 🚀