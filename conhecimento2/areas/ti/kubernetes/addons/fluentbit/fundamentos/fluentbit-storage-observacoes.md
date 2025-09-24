---
tags:
  - Kubernetes
  - NotaPermanente
  - SRE
categoria: logs
ferramenta: fluentbit
---
Ao implementar os storages, foi importante utilizar as configurações de grace períod para impedir o pod de finalizar antes de processar todos os chunks, complementando os testes fiz a finalização do pod excluindo o mesmo, e para minha surpresa durante o processo de encerramento o output enviou todos os chunks que estavam armazenados em volume persistente.

A Estratégia de pv utilizada foi utilizar o [[downward-api|Downward Api]] do [[Kubernetes]] para obter o nome do [[node]] em que o [[daemonset]] está rodando, com isso, é criado um diretório específico para aquele pod, nesse caso, mesmo havendo exclusão, ou um desastre no node, o [[pod]] que assume poderá enviar os [[fluentbit-chunks|chunks]] persistidos, isso é garantido pela própria natureza do daemonset(1 pod por node).

[Exemplo De Configuração de Persistencia](https://github.com/LucasBertiDev/fluentbit-k8s/blob/main/infra/values.yaml)
