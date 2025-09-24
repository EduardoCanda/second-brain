---
tags:
  - Fundamentos
  - Cloud
  - NotaPermanente
categoria_servico: iaas
cloud_provider: aws
categoria: mensageria
---
O [[Event Bridge]] é um serviço gerenciado da [[AWS]] que trabalha com barramento de eventos, de maneira geral ele trás a praticidade de possuir a integração com diversos serviços dentro da Cloud, além de trabalhar com um conceito um pouco diferente dos meios de mensageria convencional como [[Resumo Kafka|Kafka]] e [[Resumo SNS|SNS]].

Por se tratar de um barramento de eventos, é possivel criar regras específicas de roteamento de eventos, isso é simplesmente mágico! podemos definir para onde os eventos vão baseados em algum filtro, e não somente um destino definido como uma série de vários possíveis destino de uma única vez([[Fanout]]), [[Arquitetura Event Bridge|aqui]] exploramos o detalhamento de como é a arquitetura e detalhes de como podemos implementar de forma ampla e funcional.

O Barramento principal já é definido ao criar sua conta como é descrito [[Multiplos Event Bus Event Bridge|aqui]], porém é possível criar novos barramentos customizados para sua necessidade, e conforme estes são criados é possível utilizar nos benefícios de roteamento de regras e justamente por ter esse mecanismo de regras o event bridge não é classificado como [[Event Bridge VS Broadcast|broadcast]].

E Por ser projetado para trabalhar com arquitetura de eventos, ele não tem suporte para mecanismos de fila, [[Event Bridge VS FIFO|aqui]] exploramos as principais justificativas do porque isso não é possível. Cabe a nós utilizar ferramentas que possam garantir a ordem como por exemplo o [[SQS]] ou até mesmo o [[Resumo Kafka|Kafka]], a depender da necessidade do projeto.

# Exemplos de utilização do Event Bridge

[[Exemplos Utilizacao Event Bridge]]