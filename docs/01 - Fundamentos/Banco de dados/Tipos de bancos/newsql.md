# NewSQL

## Definição
NewSQL é uma categoria de bancos de dados que tenta combinar três propriedades que historicamente vinham separadas:
- linguagem SQL completa (joins, índices secundários, constraints e ecossistema conhecido);
- transações ACID com consistência forte;
- escalabilidade horizontal em cluster distribuído.

Em termos práticos, ele existe para resolver o problema de times que precisam crescer para múltiplas regiões e alto volume sem abrir mão de garantias transacionais fortes.

---

## Problema histórico

### Bancos SQL tradicionais
Bancos relacionais clássicos (como PostgreSQL e MySQL em deployment tradicional) foram desenhados com foco em:
- ACID robusto;
- consistência forte;
- excelente capacidade de modelagem relacional.

O limite aparece quando o crescimento exige escalar escrita e capacidade total para além de um único nó primário. Escala vertical (CPU/RAM/disco) tem teto físico e custo crescente.

### Bancos NoSQL
NoSQL nasceu para escalar horizontalmente com mais simplicidade operacional em cenários de alto volume:
- particionamento natural por chave;
- replicação em múltiplos nós;
- alta disponibilidade e throughput.

O trade-off clássico foi:
- consistência eventual em vários modelos;
- ausência de SQL completo e semântica relacional limitada;
- transações ACID restritas (muitas vezes por partição/documento).

Resumo do trade-off histórico:
- SQL tradicional: consistência e modelagem fortes, mas escala horizontal complexa.
- NoSQL: escala horizontal facilitada, mas com menos garantias transacionais globais e menor expressividade relacional.

---

## O que o NewSQL resolve
NewSQL combina os dois mundos ao oferecer:
- SQL completo para consultas e integração com ferramentas existentes;
- transações ACID distribuídas;
- arquitetura distribuída com sharding e replicação nativos.

ASCII simplificado:

```text
SQL + ACID + Escala Horizontal
            |
         NewSQL
            |
Cluster distribuído com transações globais
```

---

## Arquitetura de um banco NewSQL
Em um banco NewSQL moderno, a arquitetura normalmente inclui:

- **Cluster distribuído**: vários nós cooperando como um único banco lógico.
- **Sharding automático**: dados particionados automaticamente por ranges ou hashes, com rebalanceamento conforme crescimento.
- **Replicação**: cada shard possui réplicas para tolerância a falhas.
- **Coordenação entre nós**: metadados, liderança de partições e commit transacional coordenados por protocolos distribuídos.

Diagrama:

```text
App
 |
 v
Cluster NewSQL (gateway/SQL layer)
 |
 +--> Node A (shards + replicas)
 +--> Node B (shards + replicas)
 +--> Node C (shards + replicas)
```

---

## Conceitos fundamentais

### Consenso distribuído
Protocolos como **Raft** e **Paxos** existem para garantir acordo entre nós mesmo com falhas parciais.

Sem consenso, dois nós poderiam aceitar escritas conflitantes como verdade ao mesmo tempo (split-brain). Com consenso, o cluster define uma ordem consistente de mudanças para cada grupo de réplica.

### Transações distribuídas
Transações que atravessam múltiplos shards são difíceis porque exigem:
- coordenação entre líderes de partições;
- atomicidade global (ou tudo comita, ou tudo aborta);
- controle de concorrência em múltiplos nós.

Isso normalmente envolve protocolos como 2PC (duas fases), timestamps globais ou modelos serializáveis distribuídos, com custo de latência adicional.

### Sharding
- **Manual**: aplicação escolhe partição/chave explicitamente e assume parte da complexidade.
- **Automático**: banco particiona, move dados e reequilibra carga sem exigir lógica de roteamento no código da aplicação.

NewSQL tende a privilegiar o modelo automático para reduzir acoplamento da aplicação à topologia física.

### Replicação
- **Síncrona**: confirmação de escrita após quorum; maior consistência, maior latência.
- **Assíncrona**: primário responde antes de propagar totalmente; menor latência local, risco de perda/lag em falha.

Soluções NewSQL voltadas a ACID global normalmente usam replicação síncrona por quorum no caminho crítico de commit.

---

## Relação com CAP Theorem
No contexto de partições de rede, NewSQL geralmente se posiciona mais próximo de **CP**:
- prioriza consistência e correção transacional;
- aceita reduzir disponibilidade de escrita em cenários extremos de partição.

Já sistemas **AP** priorizam disponibilidade, aceitando divergência temporária.

Trade-off principal:
- quanto mais forte a consistência global (principalmente entre regiões), maior tende a ser a latência de confirmação, porque o commit precisa coordenar múltiplos nós antes de responder.

---

## Comparação geral

| Critério | SQL tradicional | NoSQL | NewSQL |
|---|---|---|---|
| Consistência | Forte (ACID local/primário) | Frequentemente eventual (varia por produto) | Forte (ACID distribuído) |
| Escalabilidade | Vertical + réplicas de leitura | Horizontal nativa | Horizontal nativa |
| Complexidade | Menor em cluster simples | Menor para casos chave-valor/documento | Alta (consenso, transações distribuídas) |
| Latência | Baixa em nó local | Muito baixa em cenários específicos | Maior em writes com coordenação global |

---

## Exemplos de bancos NewSQL
- **CockroachDB**: SQL distribuído, fortemente consistente, inspirado em conceitos do Spanner, com Raft por ranges.
- **Google Spanner**: banco distribuído global com consistência externa usando sincronização temporal e consenso por réplica.
- **TiDB**: arquitetura com camada SQL separada do armazenamento distribuído (TiKV), usando Raft e transações ACID.
- **VoltDB**: foco em processamento transacional de baixa latência em memória, com modelo particionado e execução orientada a throughput.

---

## Casos de uso
NewSQL faz sentido quando há necessidade simultânea de escala e consistência forte, por exemplo:
- sistemas financeiros (ledger, saldos, reconciliação);
- pagamentos e antifraude com invariantes rígidos;
- sistemas globais multi-região com dados críticos;
- plataformas de alta concorrência com múltiplos writers.

---

## Quando NÃO usar
NewSQL pode ser exagero quando:
- o sistema é simples e monolítico;
- volume e concorrência são baixos;
- uso é local, com um único banco relacional tradicional atendendo bem;
- o time não tem maturidade operacional para operar cluster distribuído.

---

## Trade-offs
Adotar NewSQL normalmente implica:
- **complexidade operacional** maior (observabilidade distribuída, tunning de cluster, gestão de incidentes de consenso);
- **latência de coordenação** maior em operações transacionais globais;
- **custo de infraestrutura** maior para garantir quorum, réplica e resiliência multi-zona/região.

---

## Modelo mental
Pense em NewSQL como um "PostgreSQL com cérebro de sistema distribuído".

Analogia: em vez de um único cartório central validando transações, você tem vários cartórios sincronizados por regras rígidas. O processo é mais caro e um pouco mais lento, mas evita versões conflitantes da verdade.

---

## Como isso aparece na prática
Exemplo: sistema de pagamento distribuído em duas regiões.

Problema:
- cada autorização de pagamento precisa debitar saldo e registrar ledger de forma atômica;
- não pode existir estado "saldo debitado sem ledger" ou "duplo débito" em falhas.

Com NewSQL:
1. A aplicação abre uma transação SQL.
2. O banco coordena escrita nos shards envolvidos (conta, ledger, antifraude).
3. O commit só retorna sucesso após quorum e validações de concorrência.
4. Se houver conflito ou falha parcial, a transação aborta inteira.

Resultado:
- invariantes financeiras preservadas;
- modelo de programação relacional mantido;
- escala horizontal sem delegar consistência para lógica manual da aplicação.

---

## Relações (Zettelkasten)
- [[Databases]]
- [[SQL]]
- [[NoSQL]]
- [[Distributed Systems]]
- [[CAP Theorem]]
- [[Consistency Models]]
