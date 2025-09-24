---
tags:
  - Linux
  - Namespaces
ferramenta: cli
---
O Comando unshare é utilizado para criação de [[Namespaces|namespaces]] temporários, ele pode receber diversos argumentos para execução do programa especificado. Com isso podemos isolar as partes especificadas do sistema através das opções desejadas.

Os namespaces criados com o comando unshare são temporários, quando o processo que iniciou o namespace morre por consequência ele também será extinto
necessitando assim uma estratégia para persistir esses namespaces mesmo que o host seja reiniciado.

Um ponto adicional a ser considerado é que ao usar o comando unshare, caso alguma característica desejada não seja especificada o namespace terá acesso ao recurso do host, por exemplo, caso seja criado um namespace e esse não receba a flag --pid, o namespace conseguirá enxergar os processos do host/namespace que o gerou.

Como namespaces podem ser recursivos, é possível criar um namespace pai que tenha acesso a determinados recursos do host, e por sequencia criar outros namespaces que tenham visão limitada sobre os recursos compartilhados com o namespace "raiz".


## Tornando Namespaces Persistentes

Para tornar um namespace persistente existe uma forma extremamente simples, ao executar o comando especificando quais são os pontos a ser isolados é possível especificar um arquivo para que se seja feita a persistencia em disco, isso é feito através de um [[mount|ponto de montagem]], basta informar o tipo de isolamento seguido do arquivo onde será feito a persistência do namespace **/mnt/namespace/pid**

## **Opções comuns usadas**

`unshare --mount --uts --net --pid bash`

- `--mount`: Cria um namespace de montagem.[]()
- `--uts`: Cria um namespace UTS (permite alterar hostname).
- `--net`: Cria um namespace de rede.
- `--pid`: Cria um namespace de processos.


## Notas de Detalhamento

[[Opção --fork]]


# Laboratorios


[[Criando Namespaces de rede com unshare]]
[[Criando Namespaces de PID com unshare]]
[[Criando Namespaces de mount com unshare]]



