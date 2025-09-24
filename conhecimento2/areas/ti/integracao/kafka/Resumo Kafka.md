---
tags:
  - Fundamentos
  - Integracoes
  - NotaPermanente
categoria: mensageria
---
O Kafka representa um serviço de streaming distribuído de dados, sua composição é diversificada e apresenta diversos recursos de escalabilidade vertical, horizontal, recursos de redundancia([[Replicas e Partições|partições]] e [[Kafka#3. **Broker**|brokers]]) e diversas estratégias para lidar com os mais [[Kafka Detalhes|diversos]] cenários.

## Topicos

Os [[Kafka#2. **Topic**|Tópicos]] são uma divisão lógica de dados, eles representam um assunto, um tema e suas mensagens representam eventos relacionados a esse Tema. Um tópico pode ter multiplos "ouvintes" chamados de Consumidores, e esses são os responsáveis por realizar o processamento das mensagens.

## Partições
Cada [[Arquitetura Kafka#2. Partições (Partitions)|partição]] representa uma "Fila Ordenada de Dados" de um tópico, ele fica localizada em um broker(Servidor), Existe um mecanismo de redundancia que é controlado por um mecanismo gerenciador(Zookeper ou Kraft), onde as partições podem ter replicações de dados que ficariam em outros brokers seguindo um modelo de Lider/Subordinado, caso um Lider tenha um problema é possível que uma outra partição assuma a posição de Lider e os Consumers podem continuar a Leitura sem impacto.

## Brokers
Os brokers são servidores que compoem o Cluster Kafka, sendo uma de suas principais vantagens, por existir a possibilidade de expandir a plataforma essa se torna uma de suas principais features, além de poder distribuir o mesmo em outras regiões geográficas tornando assim o processo ainda mais seguro.

## Producers

Os producers são os responsáveis por encaminhar mensagens/eventos para um tópico Kafka, eles são a raiz de todo processamento de dados pois são responsáveis pelo nascimento da informação dentro da plataforma, porém um Producer pode ser também um consumer uma vez que o mesmo pode receber uma mensagem advinda de um outro tópico Kafka, e gerar uma nova mensagem em um outro tópico.
## Consumers

Os consumers são os responsáveis por executar processos relacionados as mensagens capturadas nas partições, eles geralmente tem um mecanismo de confirmação de leitura(ack), e por isso podem ter cada consumer a sua própria ordem de execução, uma vez que o kafka trabalha com o conceito de Broadcasting.

## Comparativos

[[Rabbit MQ Vs Kafka|Kafka VS RabbitMQ]]
[[Rabbit MQ SQS Kafka|Kafka Vs RabbitMQ Vs SQS]]
[[SNS Fifo Vs Apache Kafka]]
