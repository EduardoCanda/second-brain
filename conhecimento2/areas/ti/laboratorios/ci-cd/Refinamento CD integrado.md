---
tags:
  - Kubernetes
  - NotaPermanente
  - Laboratorio
ferramenta: git
---
Ao desenvolver meu projeto de gestão financeira houve a necessidade de implementar um mecanismo para deploys automaticos, segmentados por cada chart [[helm]], uma grande vantagem de usar o [[introducao-argocd|Argo CD]], é a possibilidade de utilizar [[helm-charts]] e gerenciar as workloads de somente com o Argo usando este somente como ferramenta de renderizacão de infraestrutura.

Nesse projeto iremos centralizar o mapeamento de Applications em um único repositório, e este irá recursivamente montar as outras aplicacões que estão mapeadas nele.

# Estrutura base

Para montar e organizar nosso repositório iremos separar a infra do código da aplicação seguindo as boas práticas sugeridas pelo Argo CD, nesse novo repositório de infra os manifestos do [[kubernetes]] estarão no diretório **infra**, e esse mapeamento deverá estar explicito no [[application|application]].