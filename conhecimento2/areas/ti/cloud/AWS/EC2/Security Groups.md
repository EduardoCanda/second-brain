---
tags:
  - Fundamentos
  - Cloud
  - NotaPermanente
cloud_provider: aws
categoria_servico: iaas
categoria: computacao
---
Os security groups atuam como firewall dentro de nossa cloud aws, eles atuam a nível de instancia [[EC2]], [[ECS]], [[Meu resumo EKS|EKS]] e até [[Lambda Detalhes|Lambda]], ou seja ele é responsável por uma camada adicional de segurança entre instancias e security groups.

Por padrão o trafego dentro da VPC é liberado devido a rota local no main route table, para mais informações acesse [[Route Tables]], e para isso o security group pode entrar para limitar esse acesso.

È possível monitorar esse tráfego através de VPC Flow Logs, caso haja necessidade.

### **Principais características:**

- ✅ **Stateful**: Se uma conexão de entrada é permitida, a resposta é automaticamente autorizada.
- ✅ **Aplicados a instâncias individuais** (não a subnets).
- ✅ **Suportam regras baseadas em IP, outros SGs e prefix lists**.
- ❌ **Não têm regras de "DENY"** (apenas ALLOW).

# Casos onde SGs Não Filtram

- **Tráfego para a própria instância** (loopback/localhost).
- **Se nenhuma regra inbound for definida** (todas as conexões são bloqueadas por padrão).


# Diferença para Network ACLs

| Critério      | Security Groups                       | Network ACLs         |
| ------------- | ------------------------------------- | -------------------- |
| **Escopo**    | Nível de instância                    | Nível de subnet      |
| **Stateful**  | Sim (respostas são automáticas)       | Não                  |
| **Aplicação** | Mesma VPC ou entre VPCs (com peering) | Apenas dentro da VPC |


# Troubleshooting de Comunicação Intra-VPC

Se a Instância A não consegue acessar a Instância B:

1. **Verifique o SG de destino (Instância B)**:
    - Há uma regra inbound permitindo o protocolo/porta do SG de origem?

2. **Verifique o SG de origem (Instância A)**:
    - Regras outbound permitem a saída para o destino?

3. **Teste conectividade básica**:
```bash
# Na Instância A (Linux):
telnet <IP-Instância-B> 3306
```


# Exemplos de security group
## Exemplo 1

Se a Instância A (SG-A) quer acessar a Instância B (SG-B), as regras de **inbound do SG-B** e **outbound do SG-A** são avaliadas.

**SG-A (Origem)** precisa ter uma regra Outbound permitindo:
    - Protocolo: TCP
    - Porta: All
    - Destino: **SG-B** (recomendado) ou CIDR da subnet/IP da Instância A.(Geralmente os security groups tem outbound permitindo qualquer endereço e qualquer porta)

**SG-B (Destino)** precisa ter uma regra inbound permitindo:
    - Protocolo: TCP
    - Porta: 3306
    - Origem: **SG-A** (recomendado) ou CIDR da subnet/IP da Instância A.

Eles são stateful, isso significa que ao permitir uma entrada/saída, as respostas serão automáticas, e uma ótima prática é utilizar referência por security group e não CIDR.

**Vantagens**:
- Não precisa atualizar regras se os IPs das instâncias mudarem.
- Mais seguro (não expõe intervalos de IPs).

## Exemplo 2


- **SG-WEB**:
    - Inbound: Permite porta 80.
- **SG-App**:
    - Inbound: Permite porta 8080 apenas de **SG-Web**.
- **SG-DB**:
    - Inbound: Permite porta 3306 apenas de **SG-App**.

## Exemplo 3

- **SG-API**: Permitir porta 80 de **SG-Front**.
- **SG-Auth**: Permitir porta 50051 de **SG-API**.
- **SG-DB**: Permitir porta 27017 de **SG-Auth**.