---
tags:
  - Fundamentos
  - SRE
  - NotaPermanente
---
A observabilidade é uma prática que ajuda a minimizar os desafios trazidos por ambientes de TI cada vez mais complexos e descentralizados, trazendo uma visão holística de tudo que envolve as aplicações e sistemas, auxiliando os profissionais a identificar problemas, suas causas raízes e pontos de melhoria.

Para que isso ocorra existem 3 pilares da observabilidade que são a base para o entendimento dos estados das aplicações, são eles: logs de eventos, métricas e traces (rastreamento de dados).

Mas antes de falarmos sobre os pilares, vale relembrar que anteriormente aqui em nosso blog, já conversamos sobre [o que é observabilidade](https://www.opservices.com.br/o-que-e-observabilidade/) e [diferenças entre monitoramento e observabilidade](https://www.opservices.com.br/diferenca-entre-monitoramento-e-observabilidade/), e [como implementar uma boa estratégia](https://www.opservices.com.br/como-implementar-uma-boa-estrategia-de-observabilidade/) caso você queira saber mais sobre esse assunto. Sem mais delongas, vamos ao assunto de hoje: os 3 Pilares da Observabilidade!

## Pilares da Observabilidade

Os 3 itens elencados não fazem por si só um sistema “observável”, mas ao se correlacionarem se tornam um ponto-chave na hora de entender como anda o desempenho de um sistema, ajudando a gerar boas experiências aos usuários finais. Confira os pilares:

### 1 – Logs

Os logs são registros imutáveis que possuem data/hora de eventos que ocorrem em um sistema, incluindo erros, alertas e informações de depuração. Possui 3 diferentes formas, podendo ser em formato texto, estruturado ou binário.




### 2 – Métricas

As métricas são medidas quantitativas do desempenho de um sistema, como a taxa de solicitações por segundo, a utilização de CPU e a latência de rede. Elas permitem acompanhar o desempenho de um sistema ao longo do tempo e identificar tendências e problemas.

Ao unir a matemática e a [análise preditiva](https://www.opservices.com.br/monitoramento-preditivo/), as métricas podem formar o devido conhecimento para entender o comportamento de um sistema dentre intervalos de tempo, tanto no presente quanto no futuro.

Uma ferramenta útil para gestão de métricas é o [[prometheus]]
### 3 – Traces

Os traces (tracing ou rastreamento) são registros detalhados das chamadas entre diferentes componentes de um sistema, incluindo informações como o tempo gasto em cada chamada, entradas e saídas. Eles permitem rastrear e entender a cadeia de eventos que levam a um problema ou lentidão no sistema, identificando a quantidade de trabalho que foi realizada em cada camada do caminho seguido por uma requisição.

Cada trace pode conter um agrupamento de [[span]], que vão demonstrar cada passo dentro daquela requisição, considerando 

## Exemplo prático de Observabilidade

Um exemplo de observabilidade é o uso de ferramentas de monitoramento de desempenho em um sistema de nuvem. Ao se ter hospedado em nuvem aplicativos críticos para o funcionamento do negócio, uma das principais preocupações é garantir que a plataforma esteja sempre disponível e performando de forma adequada. Para isso, é importante contar com uma boa ferramenta de monitoramento que coleta dados como logs, métricas e traces em tempo real sobre o uso de recursos, como CPU, memória, armazenamento, rede e etc.

Com essas informações, você pode monitorar o desempenho da plataforma e identificar problemas rapidamente. Por exemplo, se você perceber que a utilização da CPU está em níveis elevados em um determinado momento, pode investigar o que está causando esse aumento e tomar medidas para corrigir o problema antes que ele afete a disponibilidade do sistema. Além disso, as informações coletadas também podem ser usadas para otimizar o uso de recursos e reduzir custos.

## Conclusão

Os logs, métricas e traces tem seus propósitos individuais, mas são complementares na hora de trazer a máxima visibilidade completa sobre o comportamento de sistemas distribuídos.

Com esses 3 pilares, você torna a observabilidade uma técnica valiosa para garantir a disponibilidade e desempenho dos sistemas de TI, além de ajudar a identificar problemas rapidamente e tomar decisões informadas.