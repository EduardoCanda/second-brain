---
tags:
  - Fundamentos
  - Cloud
  - NotaPermanente
categoria_servico: paas
cloud_provider: aws
categoria: mensageria
---
O [[Amazon SNS|SNS]](Simple Notification Service) como o próprio nome já diz, é um serviço simples de mensageria e ele trabalha com o conceito de pub/sub, basicamente ele irá funcionar de forma análoga ao [[Kafka]], porém com algumas diferenças, ele também é comparado com o [[Event Bridge]] destacadas [[SNS Vs Event Bridge|aqui]].

Ele trabalha com multiplos produtores, consumidores de eventos, e toda mensagem públicada em uma tópico SNS é enviada a todos os consumidores que estão "escutando" aquele tópico.

# Benefícios conexão com a Cloud AWS

Outra característica que pode ser extremamente benéfica para quem usa a tecnologia é que ela é gerenciada pelo provider, facilitando muito na gestão/overhead operacional além de facilitar muito diversos aspectos de segurança, uma vez que trabalha com [[IAM]] podendo segregar a autorização e acesso a esse recurso.

# Possibilidades de comunicação e integração

Como ele trabalha dentro do contexto da [[AWS]] isso facilita de uma maneira as integrações intra-cloud, porém ele possuí suporte para integrações fora da conta também possuindo grande leque de [[Amazon SNS#**Principais características do Amazon SNS **|possibilidades]], essa característica torna a ferramenta extramemente interessante para multiplas integrações entre aplicações dentro de uma [[VPC]] por exemplo, construíndo uma relação segura através do [[IAM]], além do fato de ser gerenciado pelo provider, o que garante uma responsabilidade da [[AWS]] sobre a infra-estrutura.

O SNS também tem um padrão de comunicação para notificações de eventos, isso acontece por conta que ele pode se comunicar com multiplos protocolos de aplicação(EX: HTTP, HTTPS), então é importante conferir como se comunicar para notificar o dispositivo/sistema alvo.
# Ordenação de eventos

Existe sempre uma grande dúvida em relação a possibilidade de trabalhar com ordenação de eventos utilizando SNS, e existe já uma [[SNS FIFO|solução]] nativa para esse problema, porém é importante observar que caso isso seja habilitado poderá ocorrer um grande impacto em relação a performance(300ops/seg), por isso é importante sempre considerar outras soluções como um [[SQS FIFO]]
# Exemplos

Aqui temos alguns [[Exemplos Utilizacao SNS|exemplos]] utilizando SNS