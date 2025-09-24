---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
## Garantindo que os manifestos nas revisões do [[Git]] sejam realmente imutáveis[¶](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/#ensuring-manifests-at-git-revisions-are-truly-immutable "Link permanente")

Ao usar ferramentas de criação de templating como  helm ou `kustomize`, é possível que os manifestos mudem de significado de um dia para o outro. Isso geralmente é causado por alterações feitas em um repositório [[helm]] upstream ou na base Kustomize.

Por exemplo, considere o seguinte kustomization.yaml

`resources: - github.com/argoproj/argo-cd//manifests/cluster-install`

A kustomização acima tem uma base remota na revisão HEAD do repositório argo-cd. Como este não é um destino estável, os manifestos para esta aplicação kustomizada podem mudar de significado repentinamente, mesmo sem nenhuma alteração no seu repositório Git.

Uma versão melhor seria usar uma tag Git ou um commit SHA. Por exemplo:

`bases: - github.com/argoproj/argo-cd//manifests/cluster-install?ref=v0.11.1`