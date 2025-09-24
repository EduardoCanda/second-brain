---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
categoria: mensageria
---
Ótima pergunta! As réplicas em Kafka **não** causam duplicação no processamento. Vou explicar detalhadamente como funciona:

## Réplicas de Partições: Propósito e Funcionamento

### 1. O que são réplicas?
- Cada partição tem N cópias (configurado via `replication.factor`, normalmente 3)
- **Apenas 1 réplica é líder** (recebe escritas e leituras)
- As outras são **réplicas seguidoras** (só replicam os dados)

### 2. Por que existem réplicas?
- **Tolerância a falhas**: Se um broker cair, outra réplica assume
- **Durabilidade**: Garante que mensagens não sejam perdidas
- **Alta disponibilidade**: O tópico continua operacional durante falhas

### 3. Como evitam duplicação no processamento?
- **Consumers só leem da réplica líder** (nunca das seguidoras)
- O offset (posição de leitura) é armazenado no tópico `__consumer_offsets`
- Mesmo que um consumer seja realocado após falha, ele continua do último offset commitado

## Fluxo Detalhado

1. **Produção**:
   ```mermaid
   graph TD
   Producer -->|Escreve| Leader[Partição Líder]
   Leader -->|Replica| Follower1[Réplica 1]
   Leader -->|Replica| Follower2[Réplica 2]
   ```

2. **Consumo**:
   ```mermaid
   graph TD
   Consumer -->|Lê apenas| Leader[Partição Líder]
   Follower1[Réplica 1] -->|Nunca lida| Consumer
   Follower2[Réplica 2] -->|Nunca lida| Consumer
   ```

## Cenário de Falha (Exemplo)

1. **Antes da falha**:
   - Broker1: Partição0 (Líder)
   - Broker2: Partição0 (Follower)
   - Broker3: Partição0 (Follower)

2. **Quando Broker1 cai**:
   - O controller elege Broker2 como novo líder
   - Consumers reconectam ao novo líder automaticamente
   - **Zero duplicação** porque:
     - O offset do consumer foi commitado antes da falha
     - O novo líder tem todas as mensagens até o último offset confirmado

## Garantias Importantes

1. **Exatamente-um processamento** (quando bem configurado):
   - `enable.idempotence=true` no producer
   - Transações com `isolation.level=read_committed` no consumer

2. **Sem duplicação por réplicas** porque:
   - Kafka usa o conceito de **ISR** (In-Sync Replicas)
   - Só réplicas em sync podem ser promovidas a líder
   - O líder só confirma escrita quando réplicas sincronizadas a receberam

## Configurações Chave

| Configuração | Efeito |
|-------------|--------|
| `replication.factor=3` | Número de cópias de cada partição |
| `min.insync.replicas=2` | Mínimo de réplicas em sync para operar |
| `unclean.leader.election.enable=false` | Evita eleger réplicas fora de sync |

**Dica prática**: Um `replication.factor=3` com `min.insync.replicas=2` permite que seu cluster tolere a falha de 1 broker sem perda de dados ou disponibilidade.