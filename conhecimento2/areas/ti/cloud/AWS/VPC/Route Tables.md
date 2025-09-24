---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
cloud_provider: aws
categoria_servico: hibrido
---
Tabelas de roteamentos são específicações de caminhos que são possíveis de serem alcaçados por uma [[Subnets]] ou uma [[VPC]], é possível específicar uma série de rotas estáticas e com isso, providenciar uma série de caminhos para acesso tanto a rede externa(Utilizando por exemplo um [[NAT Gateway]]), ou também específicando [[cidr-ipv4|CIDR]] de redes privadas/públicas dentro dessa tabela de roteamento. 

Geralmente a primeira coisa a ter em mente é a faixa de endereçamento que será utilizada para aquele mapeamento, após ter essa base é possível específicar qual será o destino, caso aquela faixa/endereço unicast seja solicitado.

Um ponto interessante a ser declarado é que quanto maior o CIDR específicado, maior a prioridade que será acionada para aquele destino por exemplo:

10.0.0.0/24 TARGET B
10.0.0.45/32 TARGET A

Nesse caso acima, a segunda rota terá prioridade em relação a primeira, graças a específicidade maior declarada.

## **Exemplo Completo**

1. **Main Route Table** (Padrão):
   - `10.0.0.0/16 → local`

2. **Custom Route Table (Pública)**:
   - `10.0.0.0/16 → local`
   - `0.0.0.0/0 → igw-123`

3. **Custom Route Table (Privada)**:
   - `10.0.0.0/16 → local`
   - `0.0.0.0/0 → nat-456`