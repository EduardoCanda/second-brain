---
tags:
  - Kubernetes
  - NotaPermanente
categoria: CD
ferramenta: argocd
---
Quando pensamos em gerenciamento de aplications no [[introducao-argocd|Argo CD]] nos esbarramos em uma infinidade de possibilidades, desde a configuração via manifestos individuais utilizando [[application]] ou até uma configuração genérica utilizando ApplicationSet, o uso das estratégias vai depender muito do nível de controle desejado, principalmente se considerar que são recursos simples de serem utilizados, qualquer complexidade adicional é necessário implementação em mecanismos de CI por exemplo.

Um exemplo claro no aumento de complexidade é o [[applicationset-tags]], uma vez que em cada deploy há uma alteração no revision target.

Outro exemplo que fica dificil de gerenciar são [[Configurando Repositorios Privados Argo CD]] no Argo CD, uma vez que em muitos casos é necessário configurar credenciais, essas são de dificíl gestão utilizando o Argo CD dado que sua natureza é variável, a todo tempo seus dados podem se alterar gerando [[drift|inconsistências]], além do risco de [[introducao-seguranca|segurança]].
