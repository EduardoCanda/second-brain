---
tags:
  - SRE
  - Fundamentos
  - NotaBibliografica
---
No mundo dinâmico e acelerado da tecnologia da informação, a latência desempenha um papel crucial na experiência do usuário. Na área de tecnologia, é fundamental entender não apenas o que é latência, mas também como medi-la e interpretá-la.

Hoje vamos abordar as métricas de latência **P90**, **P95** e **P99**, explicando sua importância, como medi-las e como essas métricas se relacionam com a percepção do cliente e o [[sli-slo-sla#📜 **3. SLA (Service Level Agreement)**| Acordo de Nível de Serviço (famoso SLA)]]. Também abordaremos a diferença entre latência e throughput, e a influência dessas métricas no desempenho geral do sistema.

# Afinal de contas, o que é Latência?

Latência refere-se ao **tempo** que um **sistema leva para responder a uma solicitação**. Em termos mais técnicos, é o intervalo de tempo entre o envio de uma solicitação por parte do usuário e a recepção da resposta correspondente. A latência pode ser afetada por diversos fatores, como a rede, a capacidade de processamento do servidor, a carga de trabalho e a eficiência do código.

# Principais tipos de Latência

- **Latência de Rede:** Tempo que os dados levam para viajar do ponto A ao ponto B na rede;
- **Latência de Servidor:** Tempo que um servidor leva para processar uma solicitação e gerar uma resposta;
- **Latência de Aplicação:** Tempo que uma aplicação leva para executar uma operação específica, incluindo processamento e acesso a bancos de dados.

# Métricas de Latência P90, P95 e P99

As métricas de percentil, como P90, P95 e P99, são usadas para compreender a distribuição da latência em um sistema:

- **P90 (Percentil 90):** Indica que 90% das solicitações foram atendidas em um tempo menor ou igual ao valor da P90;
- **P95 (Percentil 95):** Indica que 95% das solicitações foram atendidas em um tempo menor ou igual ao valor da P95.
- **P99 (Percentil 99):** Indica que 99% das solicitações foram atendidas em um tempo menor ou igual ao valor da P99.

# Importância das Métricas de Percentil

As métricas de percentil são importantes porque fornecem uma visão mais detalhada sobre a distribuição da latência. A média ou mediana pode não refletir os casos extremos que afetam a experiência do usuário. Por exemplo, uma média de latência pode parecer aceitável, mas se 1% das requisições tiverem uma latência extremamente alta, isso pode impactar significativamente a percepção do cliente.

# Como Medir as Métricas de Percentil

Para medir P90, P95 e P99, é necessário coletar dados de latência durante um período e ordenar esses dados. Em seguida, calcula-se o valor da latência que corresponde ao percentil desejado.

## Exemplo Prático

Vamos supor que temos os seguintes tempos de resposta em milissegundos (ms) de um servidor para 100 requisições:

```
[10, 15, 20, 25, 30, ..., 150]
```

Para calcular o P90:

1. Ordenamos os tempos de resposta em ordem crescente;
2. Encontramos a posição correspondente ao percentil 90. Para 100 requisições, o cálculo é `100 * 0.9 = 90`;
3. O valor na **posição 90** é o nosso P90.

Repetimos o processo para P95 e P99, utilizando 95 e 99 como multiplicadores, respectivamente.

# Uso das Métricas de Percentil na Percepção do Cliente

## Importância da Latência para o Cliente

Clientes esperam respostas rápidas e consistentes ao interagir com sistemas online. Altas latências podem resultar em experiências frustrantes, levando à insatisfação do cliente e, eventualmente, à perda de negócios.

## Como os Percentis Ajudam na Percepção do Cliente

- **P90:** Garante que 90% das requisições sejam atendidas em um tempo aceitável, fornecendo uma experiência consistente para a maioria dos usuários;
- **P95:** Reduz ainda mais os casos de alta latência, garantindo uma experiência melhorada para quase todos os usuários;
- **P99:** Foca nos casos extremos, minimizando o impacto dos piores cenários de latência na experiência do usuário.

## Exemplos de Uso em SLA

_Acordos de Nível de Serviço_ (SLAs) frequentemente incluem métricas de latência para garantir um nível mínimo de desempenho. Por exemplo, um SLA pode estipular que 95% das requisições devem ser atendidas em menos de 200ms (P95 <= 200ms). Isso assegura aos clientes que a maioria das suas interações com o sistema será rápida e responsiva.

## Diferença entre Latência e Throughput

Definções importantes:

- **Latência:** Tempo que uma única requisição leva para ser processada;
- **Throughput:** Número de requisições que um sistema pode processar em um determinado período de tempo.

## Relação entre Latência e Throughput

- **Latência Alta:** Pode indicar que o sistema está sobrecarregado, resultando em um throughput menor;
- **Throughput Alto:** Pode ocorrer mesmo com latências variáveis, mas uma latência consistentemente alta afetará negativamente o throughput ao longo do tempo.

# Importância de balancear Latência e Throughput

Manter um equilíbrio entre latência e throughput é crucial para a performance geral do sistema. Um sistema com baixa latência, mas baixo throughput, não conseguirá atender a um grande número de usuários de forma eficiente. Por outro lado, um sistema com alto throughput, mas alta latência, resultará em uma experiência de usuário insatisfatória.

# Monitoramento e Melhoria Contínua

## Ferramentas de Monitoramento

Para monitorar métricas de latência e throughput, várias ferramentas podem ser utilizadas. Alguns exemplos incluem:

- **Prometheus:** Sistema de monitoramento e alerta de código aberto;
- **Grafana:** Plataforma de análise e visualização de métricas;
- **New Relic:** Ferramenta de monitoramento de performance de aplicações;
- **Datadog:** Plataforma de monitoramento e segurança para devops.

## Implementação de Melhoria Contínua

1. **Coleta de Dados:** Monitorar continuamente a latência e throughput utilizando as ferramentas mencionadas;
2. **Análise:** Utilizar métricas de percentil para identificar picos de latência e suas causas;
3. **Otimização:** Implementar melhorias no código, infraestrutura e processos para reduzir a latência e aumentar o throughput;
4. **Reavaliação:** Reavaliar constantemente as métricas para garantir que as melhorias implementadas tenham um impacto positivo contínuo.

# Conclusão

Compreender e aplicar as métricas de latência P90, P95 e P99 é essencial para garantir uma experiência de usuário positiva e cumprir os SLAs estabelecidos. Essas métricas fornecem uma visão detalhada da performance do sistema, permitindo identificar e resolver problemas de latência que poderiam passar despercebidos ao olhar apenas para a média ou mediana. Além disso, equilibrar latência e throughput é crucial para manter um sistema eficiente e responsivo. Com as ferramentas e estratégias corretas, é possível monitorar, analisar e melhorar continuamente a performance do sistema, assegurando a satisfação do cliente e o sucesso do negócio.