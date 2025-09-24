---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
cloud_provider: aws
categoria_servico: hibrido
categoria: questoes
---
## O que você considera ao implementar um sistema com tolerância a falhas em múltiplas zonas de disponibilidade (AZs)?

### ✅ **Resposta completa:**

Implementar um sistema com **tolerância a falhas entre zonas de disponibilidade (AZs)** significa projetá-lo para **continuar operando mesmo com a falha total de uma AZ**. Isso é essencial para alcançar **alta disponibilidade (HA)** e **resiliência real** em nuvem — especialmente em serviços críticos como os do setor bancário.

---

### **Minha abordagem envolve 5 frentes principais:**

---

### **1. Distribuição ativa entre AZs**

- Utilizo **load balancers** (ex: ALB, NLB) que distribuem o tráfego automaticamente entre instâncias em diferentes AZs.
- Configuro **Auto Scaling Groups com subnets multi-AZ** para garantir instâncias ativas em todas as zonas.
- Em sistemas containerizados (como no EKS ou ECS), uso **node groups espalhados entre AZs** com definições de pod anti-affinity para evitar concentração de carga.

---

### **2. Persistência de dados com replicação multi-AZ**

- Para bancos relacionais como o **RDS**, ativo o modo **Multi-AZ com failover automático**.
- Para bancos NoSQL como **DynamoDB**, aproveito a replicação regional automática e a arquitetura multi-AZ nativa.
- Em serviços de fila como **SQS**, não me preocupo com AZ diretamente, pois o serviço é gerenciado e já resiliente.

---

### **3. Tolerância no plano de controle**

- Evito **pontos únicos de falha (SPOFs)**: não adianta distribuir instâncias de aplicação entre AZs se o cache (ex: Redis em EC2) está centralizado em uma só.
- Para caches críticos, utilizo **ElastiCache em cluster multi-AZ com failover configurado**.

---

### **4. Observabilidade e failover explícito**

- Configuro **health checks por AZ**, e não apenas globais, para identificar falhas localizadas.
- Monto **circuit breakers por zona**, permitindo fallback para uma AZ saudável se outra estiver degradada.

---

### **5. Testes de falha controlada**

- Simulo falhas forçadas em AZs usando ferramentas como **AWS Fault Injection Simulator** ou scripts manuais com escalonamento de ASGs para validar comportamento do sistema.
- Isso me permite validar se, em caso de falha de uma zona, o sistema de fato **mantém operação, escala e reroteia corretamente.**

---

### ✅ **Exemplo prático:**

Em um sistema de processamento de propostas de crédito, projetei uma arquitetura em que:

- As APIs rodavam em EKS com nodes em 3 AZs.
- O banco RDS estava em modo Multi-AZ com failover automático.
- Os serviços de fila (SQS + DLQ) foram usados para desacoplar etapas críticas.
- Fizemos simulações de falha com derrubada de uma AZ inteira e garantimos RTO < 1min.

---

### ✅ Conclusão:

Alta disponibilidade entre zonas **não é apenas distribuir instâncias**, mas **garantir que dados, cache, monitoramento e plano de controle também sejam resilientes**. Tudo deve ser pensado para **não apenas sobreviver à falha, mas continuar entregando valor ao cliente mesmo sob falhas parciais**.
