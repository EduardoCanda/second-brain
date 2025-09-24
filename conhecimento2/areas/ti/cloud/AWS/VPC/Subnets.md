---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: hibrido
cloud_provider: aws
---
# **1. Conceitos Fundamentais**

## **1.1 O que é uma Subnet?**

- Divisão lógica de uma VPC em segmentos de IP menores
- Associação obrigatória com uma **Availability Zone (AZ)**
- Controle granular sobre:
    - Acesso à internet (público/privado)
    - Isolamento de recursos
    - Políticas de roteamento(Cada subnet pode ter uma única tabela de roteamento)

### **1.2 Tipos de Subnets**

|Tipo|Internet Gateway|NAT Gateway|Casos de Uso|
|---|---|---|---|
|**Pública**|✅ Sim|❌ Não|Load Balancers, Bastion Hosts|
|**Privada**|❌ Não|✅ Opcional|Bancos de dados, Backends|
|**Isolada**|❌ Não|❌ Não|Recursos sem acesso à internet|

## **2. Arquitetura Recomendada**

### **2.1 Estrutura Básica Multi-AZ**

![[Estrutura Subnets VPC.png]]


### **2.2 Boas Práticas**

- **Balanceamento AZ**: Distribuir subnets igualmente entre AZs
- **Tamanho de CIDR**:
    - /24 (256 endereços) para maioria dos casos
    - /28 (16 endereços) para pequenos ambientes

- **Nomenclatura**: Usar tags claras (ex: `prd-net-public-a`)


## **3. Configuração Avançada**

### **3.1 Tabelas de Roteamento (Route Tables)**

|Tipo|Rota Padrão|Exemplo|
|---|---|---|
|**Pública**|0.0.0.0/0 → Internet Gateway|`10.0.1.0/24 → igw-123`|
|**Privada**|0.0.0.0/0 → NAT Gateway|`10.0.2.0/24 → nat-456`|
|**Isolada**|Sem rota padrão|-|

**Exemplo CLI:**


aws ec2 create-route --route-table-id rtb-123 \
--destination-cidr-block 0.0.0.0/0 \
--gateway-id igw-abc123

### **3.2 Alocação de IPs**

- **5 IPs reservados** por subnet:

    - Primeiros 4 e último IP do bloco CIDR
    - Usados para: Gateway de rede, DNS, etc.

### **3.3 Subnets para Serviços Gerenciados**

| Serviço     | Tipo de Subnet  | Observação                         |
| ----------- | --------------- | ---------------------------------- |
| RDS         | Privada         | Pode requerer subnets dedicadas    |
| EKS         | Pública/Privada | Depende de acesso ao control plane |
| Elasticache | Privada         | Grupo de subnets em múltiplas AZs  |

## **4. Padrões Arquiteturais**

### **4.1 Arquitetura de 3 Camadas**

![[arquitetura-3-camadas.png]]

### **4.2 Subnets para Containers (ECS/EKS)**

- **Padrão recomendado**:

    - 1 subnet pública para Load Balancer
    - 2+ subnets privadas para tasks/pods

- **Exemplo CIDR**:
    
    10.0.1.0/24 - ECS Public AZ A
    10.0.2.0/24 - ECS Private AZ A
    10.0.3.0/24 - ECS Private AZ B
    

## **5. Segurança em Subnets**

### **5.1 Network ACLs vs Security Groups**

|Critério|NACL|Security Group|
|---|---|---|
|Nível|Subnet|Instância|
|Stateful|❌ Não|✅ Sim|
|Ordem das Regras|✅ Sim (nº prioridade)|❌ Não|

**Exemplo NACL:**


aws ec2 create-network-acl-entry \
--network-acl-id acl-123 \
--rule-number 100 \
--protocol 6 \
--port-range From=80,To=80 \
--cidr-block 0.0.0.0/0 \
--rule-action allow \
--ingress

### **5.2 VPC Flow Logs para Subnets**

- Monitorar tráfego de entrada/saída
- **Filtros úteis**:
    
    filter (srcAddr = 10.0.1.5 and dstPort = 443)
    | stats count(*) by dstAddr

## **6. Troubleshooting Comum**

|Problema|Verificação|
|---|---|
|Instância sem internet|1. Route Table da subnet  <br>2. NACL  <br>3. Security Group|
|Falha comunicação entre subnets|1. Route Tables  <br>2. VPC Peering  <br>3. NACLs|
|Esgotamento de IPs|1. Tamanho da subnet  <br>2. AWS Reserved IPs|

## **7. Ferramentas de Diagnóstico**

- **Reachability Analyzer**: Testa conectividade entre recursos
- **VPC Flow Logs**: Análise detalhada do tráfego
- **Network Manager**: Visualização topológica

## **Próximos Passos**

1. Implementar subnets públicas/privadas em 2 AZs
2. Configurar NAT Gateway para subnets privadas
3. Habilitar VPC Flow Logs para monitoramento
4. Testar comunicação entre subnets com Reachability Analyzer

Precisa de um exemplo específico ou detalhes sobre integração com algum serviço AWS?