---
tags:
  - Fundamentos
  - Cloud
  - Segurança
  - NotaPermanente
categoria_servico: hibrido
cloud_provider: aws
---
Quando pensamos em [[introducao-seguranca|segurança]] no nosso EKS precisamos abordar uma série gigantesca de fatores, incluindo disponibilização de pods e nodes em multiplas [[Availability Zones (AZs)|AZs]], para garantir redundancia total em caso de falha regional, garantindo uma disponibilidade total do serviço.

# Autorização Cruzada

Precisamos também configurar uma integração dos nossos [[pod|pods]] com serviços da nossa conta [[AWS]], para isso será necessária uma implementação cruzada de [[Politicas IAM E RBAC|IAM X RBAC]], pois caso haja a injeção manual de credencias [[IAM]] o risco acaba sendo exponêncial.

Para usar a estratégia de [[Arquivo aws-auth x IRSA]] é necessário habilitar um gerenciador de identidades no cluster, para isso basta seguir esse [[OIDC no Cluster|guia]], pois sem a estratégia de IRSA(Iam Roles for Service Accounts) é extretamente complicado integrar os dois mundos([[Meu resumo EKS|EKS]] e [[AWS]])