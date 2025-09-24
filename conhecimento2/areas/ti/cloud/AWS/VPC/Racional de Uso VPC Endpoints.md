---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: hibrido
cloud_provider: aws
---
### **Entendendo a relação entre VPC e serviços AWS**  

Quando você cria uma **[[VPC]] (Virtual Private Cloud)**, está definindo uma **rede privada isolada na AWS**, onde pode colocar recursos como **[[EC2]], [[RDS]], [[Resumo Lambda|Lambda]] (em VPC), etc.** Porém, muitos serviços AWS (como **[[S3]], DynamoDB, CloudWatch, API Gateway**) são **gerenciados pela AWS** e **não estão "dentro" da sua VPC** por padrão.  

#### **Como sua VPC acessa esses serviços?**  
Por padrão, se um recurso dentro da sua VPC (ex.: uma instância EC2) quiser acessar um serviço como **S3**, ele teria que:  
1. **Passar pela internet pública** (usando um **Internet Gateway** ou **NAT Gateway**).  
   - Isso expõe o tráfego a possíveis interceptações.  
   - Pode ter custos de transferência de dados.  
   - Pode sofrer latência.  

2. **Usar um VPC Endpoint** (recomendado para segurança e eficiência).  
   - Cria uma **conexão privada entre sua VPC e o serviço AWS**, sem sair da rede da AWS.  
   - O tráfego **nunca passa pela internet**.  

### **Exemplo Prático**  
Suponha que você tem:  
- Uma **EC2** dentro da sua VPC (sub-rede privada, sem acesso à internet).  
- Um **bucket S3** (que é um serviço global da AWS, não está na sua VPC).  

#### **Sem VPC Endpoint:**  
- A EC2 precisaria de um **NAT Gateway** para acessar o S3 pela internet.  
- O tráfego sairia da AWS e voltaria, aumentando custos e riscos.  

#### **Com VPC Endpoint (Gateway Endpoint para S3):**  
- A EC2 envia uma requisição diretamente para o S3 **usando a rede interna da AWS**.  
- Não precisa de internet, NAT ou IP público.  
- Mais seguro, mais rápido e mais barato.  

### **Resumindo:**  
- **Sua VPC é sua rede privada** (onde estão EC2, RDS, etc.).  
- **Serviços como S3, DynamoDB, CloudWatch são "externos" à VPC**, mas podem ser acessados **privadamente** via VPC Endpoint.  
- **VPC Endpoint cria um "atalho privado"** entre sua VPC e o serviço AWS, sem internet.  

Isso é especialmente útil para:  
- Aplicações em **sub-redes privadas** (sem saída para internet).  
- **Ambientes com compliance rígido** (que proíbem tráfego pela internet).  
- **Redução de custos** (evitando NAT Gateway ou Data Transfer fees).  

Se ainda não estiver claro, posso dar mais exemplos ou desenhar um fluxo de tráfego. 😊