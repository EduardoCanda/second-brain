---
tags:
  - Kubernetes
  - NotaPermanente
categoria: CD
ferramenta: argocd
---
Ao utilizar o [[introducao-argocd|Argo CD]] podemos esbarrar em diversos problemas, um dos mais comuns é a Workload não se manter estável, isso pode acarretar em diversos problemas de saúde para a aplicação, uma vez que ela pode não estar saudável ficará dificil de estabilizar o ambiente.

Um dos pontos mais importantes é garantir que todos os recursos que a Workload pede esteja devidamente provisionado, pois a falta de qualquer um poderá indisponibilizar o sincronismo, dificultando de forma geral a identificação do problema(Se há algo de errado no Argo CD ou na Workload).

Dificilmente um problema de estabilidade terá correlação com a Workload, na maior parte dos casos será problema de configuração do [[pod]] a nível de inicialização ou configuração a nível de execução.