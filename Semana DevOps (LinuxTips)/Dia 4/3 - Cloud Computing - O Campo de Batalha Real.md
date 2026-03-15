Você já ouviu "coloca na Cloud" como se fosse apertar um botão mágico. Mas a Cloud é uma infraestrutura real, com servidores físicos em data centers espalhados pelo planeta. Entender como ela funciona é o que separa quem "usa" de quem **domina**.

### 1. O que é Cloud Computing de Verdade?

Cloud é alugar computação, armazenamento e rede de outra empresa (AWS, GCP, Azure) sob demanda, pagando pelo que usar. Simples assim.

A mágica não é "onde" roda, mas **como** roda:

- **Elasticidade:** Escala de 2 para 200 máquinas automaticamente quando o tráfego da Black Friday chega. E volta para 2 quando acaba. Sem ligar para o data center pedindo servidor.
- **Pay-as-you-go:** Pagou por 3 horas de GPU para treinar um modelo? Desligou? Parou de pagar.
- **Disponibilidade Global:** Sua aplicação pode rodar simultaneamente em São Paulo, Virginia e Frankfurt.

### 2. A Anatomia: Regiões e Zonas de Disponibilidade

Imagine a AWS como uma rede de shopping centers pelo mundo:

- **Região (Region):** Uma cidade inteira (ex: `sa-east-1` = São Paulo). Cada região tem **múltiplos** data centers.
- **Zona de Disponibilidade (AZ):** Cada data center isolado dentro da região. Se um pegar fogo, os outros continuam operando.

**Regra de ouro:** Nunca rode tudo numa AZ só. Distribua seus Pods/instâncias em pelo menos 2 AZs. Assim, se uma cair, sua aplicação continua no ar.

### 3. IaaS vs PaaS vs SaaS — O Modelo de Responsabilidade

Quanto mais alto o nível do serviço, **menos** você gerencia (e menos controle tem):

| Modelo | Você gerencia | Exemplo | |--------|--------------|---------| | **IaaS** (Infrastructure as a Service) | OS, runtime, app, dados | EC2, GCE, Azure VMs | | **PaaS** (Platform as a Service) | Apenas app e dados | Heroku, Cloud Run, App Engine | | **SaaS** (Software as a Service) | Nada (só usa) | Gmail, Slack, Notion |

Para DevOps, o sweet spot geralmente é entre IaaS e PaaS: **Kubernetes gerenciado** (EKS, GKE, AKS). Você controla os containers, mas não precisa instalar o cluster na mão.

### 4. Serviços Gerenciados: Não Reinvente a Roda

A Cloud oferece serviços prontos para problemas comuns:

- **Banco de Dados:** RDS (PostgreSQL/MySQL gerenciado), DynamoDB (NoSQL)
- **Armazenamento:** S3 (objetos/arquivos), EBS (disco de VM)
- **Mensageria:** SQS (filas), SNS (notificações), EventBridge
- **Container Registry:** ECR (AWS), GCR (Google) — onde suas imagens Docker ficam guardadas
- **DNS e CDN:** Route53 + CloudFront (AWS), Cloud DNS + Cloud CDN (Google)

**A regra:** Se a Cloud oferece gerenciado, use gerenciado. Rodar seu próprio PostgreSQL numa EC2 é pedir para ter pesadelo com backup, patching e failover.

---

## 4.1 Mapa AWS na prática (resumo)

O detalhamento completo foi extraído para guias dedicados em **`02 - Guias/Cloud/AWS/`**, com uma nota por serviço.

- Visão geral: [AWS na prática — mapa de arquitetura](../../../02 - Guias/Cloud/AWS/00 - AWS Overview.md)
- Rede e segurança: VPC, Subnet, Security Group, IAM
- Compute: EC2, ECS, EKS, Lambda, Auto Scaling
- Dados e integração: S3, RDS, DynamoDB, SQS, SNS, EventBridge
- Borda e operação: API Gateway, ELB/ALB/NLB, Route 53, CloudFront, CloudWatch, WAF, NAT Gateway

Assim você aprofunda cada recurso com: **o que é**, **caso de uso**, **por que existe**, **trade-offs** e **boas práticas**.

### 5. Custo: O Monstro Silencioso

A Cloud cobra por **tudo**: CPU, RAM, tráfego de rede (especialmente saída!), armazenamento, até DNS queries.

Dicas de sobrevivência financeira:

- **Tags:** Marque todos os recursos com projeto/time/ambiente. Sem tags = sem controle de custo.
- **Alertas de billing:** Configure alarmes para gastar mais que X reais/mês.
- **Spot/Preemptible instances:** VMs até 90% mais baratas, mas a Cloud pode tomá-las de volta a qualquer momento. Perfeitas para workloads stateless com Kubernetes.
- **Reserved Instances / Committed Use:** Comprometa-se por 1-3 anos e economize 40-70% vs on-demand.

### 6. Cloud + Kubernetes + CI/CD = O Trinômio Moderno

O fluxo real de uma empresa moderna:

1. **Terraform** provisiona o cluster Kubernetes na Cloud (EKS/GKE/AKS)
2. **CI/CD** (GitHub Actions) builda a imagem Docker e faz push para o Container Registry
3. **Kubernetes** no cluster Cloud recebe o deploy e distribui entre as AZs
4. **Auto-scaling** ajusta o número de Pods e Nodes conforme a demanda

Isso é o que estamos montando ao longo da semana. Cada dia foi uma peça desse quebra-cabeça.
