---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: paas
cloud_provider: aws
categoria: balanceamento_carga
---
Quando pensamos em Cluster [[Meu resumo EKS|EKS]] precisamos dar a devida atenção quando nos referimos ao tema de balanceamento de carga, existem diversas estratégias que devemos observar principalmente quando precisamos ter um balanceamento de carga [[Fluxo Interno Balanceamento Carga EKS|dentro do cluster]] e quando precisamos ter um balanceamento [[Fluxo Externo Balanceamento Carga EKS|fora do cluster]].
# Trafego Interno

Uma das principais vantagens de utilizar o [[Fluxo Interno Balanceamento Carga EKS|balanceamento interno]] do kubernetes para tráfego interno é o custo e a simplicidade uma vez que utilizaremos recursos que já são nativos da plataforma, sem a necessidade de implementar no provider esse mecanismo.
# Trafego externo

Porém uma vez que pensamos em expor essas aplicações para fora do cluster(Ex: Rota Http de Borda) é necessário considerar a utilização de balanceamento de carga do Cloud Provider, por exemplo um [[Application Load Balancer]] ou um [[Network Load Balancer]], esse mecanismo irá utilizar [[Target Groups e Listeners]] para segregar os alvos e como esses alvos serão acionados.

# Misturando os dois mundos

Existe a possibilidade de trabalhar com esses dois mundos(recomendado) através de uma mistura de Load Balancers do cloud provider e load balancer do próprio cluster(utilizando [[Gateway API Kubernetes e EKS|Gateway API]]), isso é possível graças a possibilidade de acoplar um [[Ingress Service x ALB e NLB|ingress]] em um Api Gateway utilizando ele como borda de nosso Cluster [[Meu resumo EKS|EKS]].

[[Arquitetura Mista Igress e Gateway API com Linkerd|Nessa nota]] eu exploro um cenário ficticio onde isso é possível.