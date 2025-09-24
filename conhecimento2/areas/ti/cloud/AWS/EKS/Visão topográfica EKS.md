---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
---
Vamos lá! O **Amazon Elastic Kubernetes Service (EKS)** é um serviço gerenciado que facilita a execução do Kubernetes na AWS sem a necessidade de instalar e operar seu próprio *control plane* (painel de controle). Abaixo, uma explicação detalhada de como o EKS funciona, desde a criação do cluster até a execução de cargas de trabalho:

---

### **1. Arquitetura do EKS**
O EKS consiste em dois componentes principais:
- **Control Plane gerenciado pela AWS**: Executado em contas da AWS (não visível ao usuário).
- **Worker Nodes**: Máquinas (EC2, Fargate, ou on-premises via EKS Anywhere) onde seus *pods* são executados.

---

### **2. Componentes do Control Plane (Gerenciado pela AWS)**
O *control plane* do EKS inclui os seguintes componentes Kubernetes, gerenciados e escalados automaticamente pela AWS:
- **API Server**: Ponto de entrada para todas as operações no cluster.
- **etcd**: Banco de dados distribuído que armazena o estado do cluster.
- **Scheduler**: Decide em qual *node* um *pod* será executado.
- **Controller Manager**: Monitora o estado do cluster e aplica mudanças (ex.: replicação de pods).

🔹 **Observação**: Você não tem acesso direto a esses componentes, mas interage com eles via `kubectl` ou a API do EKS.

---

### **3. Worker Nodes (Gerenciados por Você)**
Os *nodes* são máquinas (EC2, Fargate, ou on-premises) onde seus aplicativos rodam. Eles exigem:
- **EKS Node Group**: Um grupo de instâncias EC2 gerenciado pela AWS (opcional).
- **kubelet**: Agente que comunica o *node* com o *control plane*.
- **Container Runtime**: Docker ou containerd para executar containers.
- **AWS VPC CNI Plugin**: Responsável pela atribuição de IPs aos pods dentro da VPC da AWS.

---

### **4. Como um Cluster EKS é Criado?**
1. **Criação do Control Plane**:
   - Via AWS Console, CLI (`aws eks create-cluster`), ou Terraform.
   - A AWS provisiona o *control plane* em múltiplas AZs para alta disponibilidade.
2. **Configuração do `kubectl`**:
   - O comando `aws eks update-kubeconfig` configura o acesso ao cluster.
3. **Adição de Worker Nodes**:
   - Pode ser feito via:
     - **EKS Managed Node Groups**: Grupos de EC2 gerenciados pela AWS.
     - **Fargate**: *Serverless* (sem gerenciamento de nodes).
     - **Auto Scaling Groups**: Para maior controle sobre as instâncias.

---

### **5. Rede no EKS**
- **Modelo de Rede**: Cada pod recebe um IP único da VPC (usando o **AWS VPC CNI Plugin**).
- **Security Groups**: Aplicados aos *nodes* e ao *control plane*.
- **Load Balancers**: Integração nativa com ALB/NLB via **AWS Load Balancer Controller**.

---

### **6. Autenticação e Autorização**
- **IAM**: Integrado com Kubernetes RBAC (ex.: um IAM Role pode mapear para um `ClusterRole` no Kubernetes).
- **OpenID Connect (OIDC)**: Usado para associar IAM Roles a Service Accounts do Kubernetes.

---

### **7. Logs e Monitoramento**
- **Amazon CloudWatch Logs**: Logs do control plane (API Server, audit logs).
- **[[prometheus]] + Amazon Managed Service for Prometheus (AMP)**: Para métricas detalhadas.
- **AWS Distro for OpenTelemetry (ADOT)**: Coleta de traces e métricas.

---

### **8. Atualizações e Manutenção**
- **Kubernetes Version Upgrades**: A AWS oferece suporte a upgrades do control plane com mínimo downtime.
- **Node Updates**: Atualizações de AMI ou rotação de nodes podem ser automatizadas.

---

### **9. Segurança**
- **Encriptação**: Dados em trânsito (TLS) e em repouso (EBS encriptado).
- **Network Policies**: Usando **Calico** ou **Cilium** para microssegmentação.
- **Pod Identity**: IAM Roles para Pods (evita usar credenciais hardcoded).

---

### **10. Custos**
- **Control Plane**: Cobrado por hora (~$0.10/h por cluster).
- **Worker Nodes**: Custos de EC2/Fargate + outros serviços (EBS, Load Balancers, etc.).

---

### **11. Fluxo de uma Aplicação no EKS**
1. Você envia um manifesto YAML via `kubectl apply`.
2. O **API Server** recebe a requisição e armazena o estado no **etcd**.
3. O **Scheduler** atribui o pod a um *node* disponível.
4. O **kubelet** no *node* cria o container usando o **container runtime**.
5. O **kube-proxy** configura as regras de rede para o pod.

---

### **12. Comparação com Outros Serviços**
| Feature          | EKS       | ECS       | Fargate (Serverless) |
|------------------|-----------|-----------|----------------------|
| Orchestration   | Kubernetes| Proprietário | Kubernetes/ECS |
| Gerenciamento   | Parcial   | Alto      | Total (sem nodes) |
| Flexibilidade   | Alta      | Média     | Limitada (sem nodes) |

---

### **13. Limitações**
- **Cold Starts no Fargate**: Pode haver latência inicial.
- **Custo do Control Plane**: Pode ser caro para pequenos clusters.
- **Complexidade**: Kubernetes tem curva de aprendizado íngreme.

---

### **14. Ferramentas Comuns com EKS**
- **Helm**: Gerenciador de pacotes Kubernetes.
- **Karpenter**: Auto-scaling inteligente.
- **Istio/Linkerd**: Service Mesh.
- **ArgoCD**: GitOps para deployments.

---

### **Resumo Final**
O EKS abstrai a complexidade do *control plane* do Kubernetes, permitindo que você foque nos *worker nodes* e aplicações. Ele integra-se nativamente com serviços AWS (VPC, IAM, CloudWatch) e é ideal para cargas de trabalho em produção que exigem escalabilidade e alta disponibilidade.

Quer se aprofundar em algum tópico específico?