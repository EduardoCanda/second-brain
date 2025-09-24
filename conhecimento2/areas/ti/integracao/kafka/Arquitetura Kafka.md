---
tags:
  - Fundamentos
  - NotaBibliografica
  - Integracoes
categoria: mensageria
---
# Apache Kafka: Arquitetura Detalhada e Escalabilidade

## Componentes Fundamentais do Kafka

### 1. Tópicos (Topics)
São categorias ou feeds de mensagens onde os dados são publicados. Funcionam como:
- Canais de comunicação entre producers e consumers
- Divisão lógica dos dados por tipo ou finalidade
- Podem ser configurados com diferentes políticas de retenção

**Características**:
- Os tópicos são imutáveis - uma vez escritos, os dados não podem ser alterados
- Mantêm as mensagens ordenadas por tempo de chegada
- Podem ser configurados para reter mensagens por tempo ou tamanho

# 2. Partições (Partitions)
Cada tópico é dividido em partições para permitir paralelismo e escalabilidade:

- **Propósito**: Permitir que o tópico escale além da capacidade de um único servidor
- **Características**:
  - Cada partição é uma sequência ordenada e imutável de mensagens
  - As mensagens dentro de uma partição têm um ID sequencial chamado offset
  - A ordem é garantida apenas dentro de uma partição, não entre partições

# 3. Producers
São aplicações que publicam mensagens nos tópicos do Kafka:

- **Funcionamento**:
  - Podem publicar para tópicos específicos
  - Podem escolher a partição diretamente ou usar um algoritmo de balanceamento
- **Estratégias de envio**:
  - Round-robin (padrão)
  - Baseado em chave (mensagens com mesma chave vão para mesma partição)
  - Personalizado

# 4. Consumers
Aplicações que leem mensagens dos tópicos:

- **Grupos de Consumers**:
  - Consumers organizados em grupos para dividir o trabalho
  - Cada mensagem é entregue a apenas um consumer dentro do grupo
- **Commit de offsets**:
  - Consumers mantêm controle de quais mensagens já foram processadas
  - Podem reprocessar mensagens se necessário

# 5. Brokers
Servidores que formam o cluster Kafka:

- **Funções**:
  - Receber e armazenar mensagens dos producers
  - Servir mensagens aos consumers
  - Replicar dados para tolerância a falhas
- **Coordenação**:
  - Um broker atua como controller (gerenciador do cluster)
  - Usam ZooKeeper (em versões antigas) ou KRaft (novas versões) para coordenação

# Arquitetura de Escalabilidade

## Escalando Producers
- **Aumento de throughput**:
  - Adicionar mais producers em paralelo
  - Particionar melhor os dados (mais partições = mais paralelismo)
- **Otimizações**:
  - Batch de mensagens
  - Compressão
  - Configuração de acks (0, 1 ou all)

## Escalando Consumers
- **Balanceamento de carga**:
  - Adicionar mais consumers ao grupo (até o número de partições)
  - Kafka automaticamente redistribui partições entre consumers
- **Estratégias**:
  - Cada consumer processa um subconjunto de partições
  - Se um consumer falha, suas partições são redistribuídas

## Escalando Brokers
- **Expansão do cluster**:
  - Adicionar novos brokers ao cluster
  - Rebalancear partições automaticamente
- **Considerações**:
  - Mais brokers melhoram throughput e tolerância a falhas
  - Cada partição deve caber em um único broker

# Balanceamento de Carga entre Consumers

### Mecanismo de Rebalanceamento
1. **Trigger**: Ocorre quando:
   - Um consumer entra ou sai do grupo
   - Partições são adicionadas ao tópico
   - O heartbeat do consumer expira (session.timeout.ms)

2. **Processo**:
   - O coordinator (um broker designado) gerencia o rebalanceamento
   - Todos os consumers param de processar
   - Nova atribuição de partições é calculada
   - Consumers recebem suas novas atribuições

3. **Estratégias de Atribuição**:
   - **Range** (padrão): Atribui intervalos de partições
   - **Round Robin**: Distribui uniformemente
   - **Sticky**: Minimiza movimentação de partições entre rebalanceamentos

### Boas Práticas para Balanceamento
- **Número de partições**: Deve ser múltiplo do número de consumers
- **Tamanho do grupo**: Não deve exceder o número de partições
- **Configurações chave**:
  - `session.timeout.ms`: Tempo para detectar consumers falhos
  - `max.poll.interval.ms`: Tempo máximo para processar um lote
  - `heartbeat.interval.ms`: Frequência de heartbeats

# Tolerância a Falhas e Alta Disponibilidade

### Replicação
- Cada partição tem N réplicas (configurável)
- Uma réplica é líder (recebe escritas)
- Outras são seguidoras (replicam dados)

### Eleição de Líder
- Se o broker líder falha:
  - O controller elege uma nova réplica líder
  - Processo automático e rápido (geralmente < 1s)

### Garantias de Entrega
- **acks=0**: Não espera confirmação (mais rápido, menos seguro)
- **acks=1**: Espera confirmação do líder
- **acks=all**: Espera confirmação de todas as réplicas (mais lento, mais seguro)

# Monitoramento e Otimização

### Métricas Chave
- Lag do consumer (atraso no processamento)
- Throughput de produção/consumo
- Tempo de resposta do broker
- Utilização de disco e CPU

### Ferramentas
- Kafka Manager
- Prometheus + Grafana
- JMX metrics
- Confluent Control Center (versão enterprise)

# Considerações Finais

Kafka é altamente escalável quando:
- O número de partições é planejado adequadamente
- Os consumers são stateless ou gerenciam seu estado corretamente
- O cluster é dimensionado para o throughput esperado
- As configurações de replicação e acks são ajustadas ao caso de uso

Para sistemas críticos, recomenda-se:
- Testar diferentes cenários de falha
- Monitorar continuamente o lag e performance
- Ajustar configurações conforme o padrão de uso evolui