---
tags:
  - Kubernetes
  - NotaPermanente
categoria: CD
ferramenta: argocd
---
Ao criar uma [[application|Applicação]] usando Argo é fundamental entender algumas práticas interessantes de se adotar, uma delas é a separação do repositório de infra-estrutura do repositório de aplicação, garantindo que haja duas workload separadas, e com isso garantindo que haja acionamentos atômicos, disparando somente a workload que seja requisitada para aquele momento.

Um exemplo claro disso é quando desejamos que seja realizado o build e construção da imagem de uma aplicação, porém sem que haja processos de infra-estrutura envolvidos. Com isso temos uma coesão e simplificação dos processos de esteira, segmentando diferentes respositórios com diferentes finalidades.

Na [documentação](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/) oficial do ArgoCD ele usa um exemplo classico:

## Separação do Build da Aplicação e Mecanismos de CI do Deploy de Infra

Caso haja necessidade de alteração somente no número de réplicas de uma aplicação, não há necessidade de rodar a esteira inteira novamente, apresentando um benefício em manter o repositório de infra-estrutura separado do build da aplicação.

## Auditoria e histórico segmentado

Outra grande vantagem é o histórico, uma vez que como as finalidades passam a ser divididas em diferentes repositórios, temos uma garantia que o histórico será muito mais claro, facilitando a auditoria, podendo avaliar somente modificações de desenvolvimento comum da aplicação.

## Implantação de multiplas aplicações utilizando [[sync-waves|waves]]

Uma grande vantagem é realizar o sequenciamento de implantação, isso é possível graças a waves(Um recurso importante do Argo CD), com isso caso haja necessidade de implantação de vários serviços interdepentes, é possível criar um repositório de deploy centralizado(Por exemplo [[Kafka]] + [[Zookeper]] ou duas aplicações que precisam ser dependentes, porém existe uma ordem a ser implantada)

## Separação de acesso entre equipes

Um outro ótimo benefício é a separação de acessos, podendo definir quem atuará na parte de infra-estrutura e quem será o responsável por cuidar do código da aplicação, segmentando os dois times em diferentes atuações.
