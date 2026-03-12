# Playbook — Investigação de banco (latência, lock e conexão esgotada)

## Quando usar

Use este playbook quando houver sinais de degradação relacionados ao banco de dados, como:

- aumento de latência em endpoints que consultam/escrevem no banco;
- crescimento de erros de timeout;
- mensagens de **"too many connections"**;
- filas de requisições travando por **lock**.

## Objetivo

- Restaurar estabilidade do serviço com segurança.
- Identificar rapidamente se o gargalo é conexão, lock, consulta lenta ou saturação de recurso.
- Registrar evidências para correção definitiva.

## Checklist rápido (5–15 min)

1. Confirmar impacto (quais serviços/rotas, desde quando, severidade).
2. Verificar disponibilidade do banco e métricas básicas (CPU, memória, IOPS, conexões).
3. Checar pool de conexão da aplicação (uso atual, timeout, erros).
4. Identificar queries lentas e sessões bloqueadas.
5. Aplicar mitigação de menor risco (reduzir carga, matar sessão problemática, ajustar pool temporariamente).

## Passo a passo operacional

### 1) Validar escopo do incidente

- O problema afeta leitura, escrita ou ambos?
- Acontece em todas as instâncias ou apenas parte do tráfego?
- Começou após deploy, migração ou mudança de configuração?

Correlacione com sinais de aplicação:

- latência p95/p99 por endpoint;
- taxa de erro (5xx, timeout, conexão recusada);
- fila interna (workers/jobs) acumulando.

### 2) Confirmar saúde do banco

Verifique no provedor/host do banco:

- CPU e memória;
- uso de disco e IOPS;
- conexões ativas vs limite;
- replicação (quando aplicável).

Se houver saturação de recurso, priorize mitigar carga antes de mudanças estruturais.

### 3) Investigar conexão esgotada

Sinais típicos:

- erros `too many connections`;
- pool da aplicação em 100% de uso;
- requisições aguardando conexão por muito tempo.

Ações:

- confirmar `max_connections` do banco;
- revisar tamanho de pool por instância da aplicação;
- validar vazamento de conexão (conexões não fechadas).

Exemplo SQL (PostgreSQL):

```sql
SELECT count(*) AS conexoes_ativas FROM pg_stat_activity;

SELECT state, count(*)
FROM pg_stat_activity
GROUP BY state;
```

### 4) Investigar lock e bloqueios

Sinais típicos:

- transações "presas" por longos períodos;
- aumento de timeout em escrita;
- throughput caindo mesmo com CPU moderada.

Exemplo SQL (PostgreSQL):

```sql
SELECT pid, usename, state, wait_event_type, wait_event, query
FROM pg_stat_activity
WHERE wait_event_type IS NOT NULL;

SELECT blocked.pid     AS blocked_pid,
       blocked.query   AS blocked_query,
       blocking.pid    AS blocking_pid,
       blocking.query  AS blocking_query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
  ON blocking.pid = ANY (pg_blocking_pids(blocked.pid));
```

Se necessário, encerrar apenas sessões comprovadamente responsáveis pelo bloqueio crítico.

### 5) Investigar latência por query

Sinais típicos:

- poucas queries consumindo grande parte do tempo total;
- plano de execução degradado;
- ausência de índice em filtros críticos.

Ações:

- habilitar/consultar slow query log;
- ordenar por maior tempo total e maior p95;
- usar `EXPLAIN (ANALYZE, BUFFERS)` em ambiente seguro.

Perguntas-chave:

- a query mudou recentemente?
- há crescimento de volume de dados sem ajuste de índice?
- estatísticas do otimizador estão desatualizadas?

### 6) Mitigação imediata (ordem sugerida)

1. Reduzir pressão no banco (rate limit, pausar jobs pesados, modo degradado).
2. Corrigir gargalo operacional evidente (sessão bloqueadora, query runaway).
3. Ajustar pool/timeout temporariamente para estabilizar.
4. Se incidente iniciou após release, considerar rollback da aplicação.

> Evite aplicar múltiplas mudanças grandes ao mesmo tempo. Faça uma por vez e meça o efeito.

### 7) Critério de recuperação

- latência p95/p99 volta ao baseline;
- taxa de timeout/erro cai para patamar aceitável;
- conexões e locks estabilizam sem crescimento contínuo;
- backlog de filas volta a escoar.

## Pós-incidente (até 48h)

- Documentar causa raiz provável e evidências.
- Criar plano definitivo (índices, refatoração de query, ajuste de pool, particionamento, cache).
- Definir alertas preventivos:
  - conexão ativa/limite;
  - lock wait time;
  - p95 de queries críticas;
  - taxa de timeout de banco.

## Erros comuns

- Aumentar `max_connections` sem revisar pool e padrão de uso.
- Matar sessões sem identificar quem está bloqueando quem.
- Otimizar query sem validar plano de execução.
- Encerrar incidente sem ação preventiva e sem alerta.
