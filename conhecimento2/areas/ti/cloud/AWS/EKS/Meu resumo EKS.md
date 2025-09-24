---
tags:
  - Fundamentos
  - Cloud
  - NotaPermanente
categoria_servico: paas
cloud_provider: aws
---
O Serviço EKS(Elastic [[kubernetes]] Service) é uma alternativa oferecida pela [[AWS]] para trabalhar com containers ([[IAAS ou PAAS|PAAS]]) ele oferece uma série de vantagens e desvantagens se comparado ao [[ECS]] que apresenta uma maior simplicidade em sua adoção e implementação(Conta a principal desvantagem de ser vendor lock), para uma visão de como funciona a arquitetura do EKS acesse [[Visão topográfica EKS|aqui]]

# Balanceamento de Carga

Pensando nisso é importante observar que por se tratar de uma solução que vai pesar no [[Modelo de Responsabilidade Compartilhada]] principalmente por conta que muito controle será concedido ao time que implementar essa solução, principalmente em relação ao [[Fluxo Externo Balanceamento Carga EKS|Balanceamento de carga]] que deverá considerar não somente os pods que serão difecionados mas também garantir que ele seja uniforme entre todos os [[pod|pods]] quanto os [[worker-nodes|worker nodes]] do cluster que hospedam esses pods.

[[Balanceando Carga em Cluster EKS|Nesta]] anotação eu exploro a fundo esse tema, trazendo uma visão completa sobre o tema

# Escalabilidade 

A Amazon irá gerenciar todo o [[control-plane]] facilitando muito nossa gestão, porém isso tem um custo incluído para que seja disponibilizado esse serviço, ficando a cargo de nós gerenciar somente os [[worker-nodes]].

Pensando nisso é necessário ter em mente uma estratégia muito clara de auto scaling tanto vertical quanto horizontal de nosso cluster, considerando que ele deverá representar os pods e os worker nodes.


# Segurança

Um dos principáis pontos que irá exigir atenção redobrada é o gerenciamento de segurança do [[cluster-kubernetes]], sendo necessário aplicar uma logica de comunicação do cluster com a cloud, para mais informações eu preparei um mega resumo [[Resumo segurança EKS|aqui]]

