---
tags:
  - Kubernetes
  - NotaPermanente
categoria: CD
ferramenta: argocd
---
Quando criamos o nosso namespace do [[introducao-argocd|Argo CD]] é possível criar um configmap para explicitar algumas configurações de nosso serviço, [[configmap-argocd|configmap-argocd]]  temos mais informações sobre essa configuração.

# Separando os repositórios de app e infra

Um outro ponto de extrema importancia é a prática de isolar o "framework" de infra-estrutura do repositório central da aplicação, dividindo a arquitetura entre repositório de aplicação e repositório de [[manifestos-kubernetes|manifestos]] [[kubernetes]] por exemplo.

Mas não somente em relação ao [[kubernetes]], pensando em ferramentas de orquestração de container podemos escalar isso inclusive para um serviço de orquestração gerenciado, como por exemplo o [[ECS]], a lógica deve ser a mesma, a medida que a infra-estrutura evoluí podemos avaliar dois históricos diferentes e entender de forma separada e muito mais clara essa evolução tanto da infra-estrutura quanto da aplicação.

Isso pode contribuir inclusive para a separação clara entre mecanismos de CI e CD, especializando ainda mais o nosso projeto.

# Sub-segmentando repositórios de infra

Um dos principáis aprendizados em relacão ao gerenciamento de infra-estrutura é a possibilidade de pensar em desacoplamento quando pensamos em infra-estrutura as a code, não somente do repositório da aplicação mas tambem em relação a própria infra-estrutura, [[isolando-linkerd-repos|nesse]] exemplo é mostrado claramente essa visão, separando o framework de service mesh [[linkerd]], dos manifestos já segmentados da aplicação.

# Gerenciamento de Drift

Outro ponto importantissimo a ser considerado, é o gerenciamento de [[drift|Drift]], quando vamos promover nossa infra-estrutura usando o Argo devido ao seu mecanismo de consistência entre o estado desejado do Cluster com o Específicado no no Repositório [[Git]](Desired State), muitas vezes agentes externos(como por exemplo o [[linkerd]] ou até mesmo um [[hpa]]) podemos ter problemas de sincronimos, podendo gerar alertas além de ser considerado um má prática.

