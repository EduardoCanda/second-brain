---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
cloud_provider: aws
categoria_servico: hibrido
---
Os internet gateways são utilizados para comunicação de uma VPC com a AWS, uma VPC pode ter somente um Internet Gateway associado pois pelo próprio design do recurso a amazon já torna este de alta disponibilidade.

Esse gateway geralmente possuí uma associação a uma subnet pública, essa é a principal finalidade do mesmo e ele precisa de essa atribuição para fazer sentido, isso é feito através da adição de uma rota na [[Route Tables|tabela de roteamento]].

## **1. Internet Gateway (IGW)**
### **O que é?**
- Porta de entrada **bidirecional** entre sua VPC e a internet pública.
- Permite:
  - Recursos em subnets **públicas** acessarem a internet.
  - Tráfego da internet acessar instâncias com IP público.

### **Características**
| Feature            | Detalhe                                                   |
| ------------------ | --------------------------------------------------------- |
| **Tipo de Subnet** | Apenas subnets públicas                                   |
| **Direção**        | Bidirecional (entrada/saída)                              |
| **Custo**          | Gratuito (cobra-se apenas data transfer)                  |
| **HA**             | Altamente disponível por design                           |
| **IP Público**     | Obrigatório para recursos que recebem tráfego da internet |

### **Exemplo de Uso**
```mermaid
graph LR
    Internet --> IGW --> PublicSubnet --> EC2[EC2 com IP Público]
```
