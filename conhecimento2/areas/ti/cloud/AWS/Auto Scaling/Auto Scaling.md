---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
categoria: computacao
---
# **Auto Scaling na AWS: Conceitos e Configuração**  

O **Auto Scaling** é um serviço da AWS que permite ajustar automaticamente o número de instâncias EC2 em resposta à demanda, garantindo **alta disponibilidade**, **escalabilidade** e **otimização de custos**.  

Vamos explorar os principais conceitos e como configurá-lo.  

---

## **📌 Por que usar Auto Scaling?**  
✔ **Escalabilidade horizontal**: Adiciona ou remove instâncias conforme a carga.  
✔ **Tolerância a falhas**: Substitui automaticamente instâncias com problemas.  
✔ **Otimização de custos**: Usa instâncias sob demanda, spot ou reservadas conforme necessário.  
✔ **Balanceamento de carga**: Integra-se com o **ELB (Elastic Load Balancer)** para distribuir tráfego.  

---

## **🔹 Componentes do Auto Scaling**  

### **1. Launch Template / Launch Configuration**  
Define **como** as instâncias serão criadas:  
- AMI, tipo de instância, security groups, chave SSH, scripts de inicialização (`user-data`).  
- **Diferença**:  
  - *Launch Configuration* (mais antigo, não permite versões).  
  - *Launch Template* (recomendado, suporta múltiplas versões e parâmetros avançados).  

### **2. Auto Scaling Group (ASG)**  
Define **onde** e **quantas** instâncias rodarão:  
- **Mínimo/Máximo/Desejado** de instâncias.  
- **Subnets** (em múltiplas AZs para alta disponibilidade).  
- **Políticas de Scaling** (quando escalar).  

### **3. Políticas de Scaling (Scaling Policies)**  
Define **quando** escalar:  
- **Target Tracking Scaling**: Baseado em métricas (ex.: CPU > 70%).  
- **Step Scaling**: Ajusta em "passos" (ex.: +2 instâncias se CPU > 80%).  
- **Simple Scaling**: Ação única após um tempo de resfriamento (*cooldown*).  

### **4. Health Checks**  
Monitora a saúde das instâncias:  
- Verifica status EC2 (se a instância está *running*).  
- Pode integrar com ELB (se a aplicação está respondendo).  

---

## **🔹 Como Configurar um Auto Scaling Group (ASG)?**  

### **Passo 1: Criar um Launch Template**  
- Escolha uma AMI (ex.: Amazon Linux 2).  
- Defina tipo de instância (ex.: `t3.micro`).  
- Configure Security Groups e `user-data` (opcional).  

### **Passo 2: Criar um Auto Scaling Group**  
- Selecione o Launch Template criado.  
- Defina:  
  - **Min**: 2 instâncias (para alta disponibilidade).  
  - **Max**: 10 instâncias (limite de escalabilidade).  
  - **Desired**: 2 instâncias (iniciais).  
- Escolha **múltiplas AZs** (ex.: us-east-1a, us-east-1b).  

### **Passo 3: Configurar Scaling Policies**  
- **Exemplo de Target Tracking**:  
  - Métrica: `CPUUtilization`.  
  - Target: 70% (se ultrapassar, adiciona instâncias).  

- **Exemplo de Step Scaling**:  
  - Se `CPUUtilization > 80%` por 5 minutos → adiciona 2 instâncias.  
  - Se `CPUUtilization < 30%` por 15 minutos → remove 1 instância.  

### **Passo 4: Integrar com ELB (Opcional)**  
- Associe um **Application Load Balancer (ALB)** ao ASG para distribuir tráfego.  

---

## **🔹 Casos de Uso Comuns**  
- **Aplicações Web**: Escala conforme tráfego (ex.: Black Friday).  
- **Batch Processing**: Usa Spot Instances para reduzir custos.  
- **Microserviços**: Garante que serviços críticos sempre tenham instâncias.  

---

## **🔹 Perguntas Frequentes em Entrevistas**  

### **1. "Qual a diferença entre Scaling Vertical e Horizontal?"**  
- **Vertical**: Aumentar o tamanho da instância (ex.: `t3.small` → `t3.large`).  
- **Horizontal**: Adicionar mais instâncias (Auto Scaling).  

### **2. "O que acontece se uma instância no ASG falhar?"**  
O Auto Scaling detecta via *health check* e substitui automaticamente.  

### **3. "Como o Auto Scaling economiza custos?"**  
- Reduz instâncias quando a demanda cai.  
- Pode usar **Spot Instances** para workloads tolerantes a falhas.  

### **4. "Posso usar Auto Scaling com containers (ECS/EKS)?"**  
Sim! O **ECS Auto Scaling** ajusta tarefas, e o **Cluster Auto Scaling** gerencia nós.  

---

## **📚 Recursos para Aprofundar**  
- [AWS Auto Scaling Docs](https://docs.aws.amazon.com/autoscaling/ec2/userguide/)  
- [Tutorial: Configurar ASG](https://aws.amazon.com/getting-started/hands-on/configure-auto-scaling/)  
- [Best Practices de Auto Scaling](https://aws.amazon.com/architecture/auto-scaling/)  

Quer simular um cenário ou ver um exemplo de CLI? É só pedir! 🚀