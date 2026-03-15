# Playbook — Incidente em produção (API lenta e erros 5xx)

## Quando usar

Use este playbook quando houver aumento de latência, timeout ou crescimento de erros HTTP 5xx em ambiente produtivo.

## Objetivo

- Restaurar o serviço com segurança.
- Minimizar impacto no cliente.
- Registrar contexto para pós-incidente.

## Checklist rápido (5–15 min)

1. Confirmar impacto (janela de tempo, endpoints afetados, percentual de erro).
2. Acionar canal de incidente e definir responsável técnico.
3. Verificar último deploy/configuração alterada.
4. Inspecionar 3 sinais: **métricas, logs e traces**.
5. Decidir: mitigação imediata (rollback, scale-out, feature flag).

## Passo a passo operacional

### 1) Validar sintoma e escopo

- Quais rotas estão com erro?
- O problema é global ou regional?
- Começou após deploy, mudança de infra ou pico de tráfego?

Consultas úteis:

```bash
# Taxa de 5xx nos últimos 15 minutos (Prometheus)
rate(http_server_requests_seconds_count{status=~"5.."}[5m])

# Latência p95 por endpoint
histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le, uri))
```

### 2) Correlacionar com mudanças

- Conferir histórico de deploy no período.
- Verificar flags, segredos e mudanças de config.
- Mapear dependências externas (DB, cache, filas, APIs de terceiros).

### 3) Diagnóstico por hipótese

Hipóteses comuns e como validar:

- **CPU/memória saturada** → checar uso por pod/instância.
- **Banco degradado** → conexões esgotadas, lock, query lenta.
- **Dependência externa lenta** → timeout crescente em cliente HTTP.
- **Regressão de código** → erro iniciado após release recente.

### 4) Mitigação imediata

Escolha uma ação de menor risco:

- rollback para última versão estável;
- desativar feature problemática via flag;
- aumentar réplicas para absorver pico;
- reduzir timeout/retry agressivo que amplifica efeito cascata.

### 5) Comunicação do incidente

Template curto de atualização:

> "Incidente ativo em API X desde HH:MM, impacto em endpoint Y, erro 5xx em Z%. Mitigação aplicada: <ação>. Próxima atualização em 15 min."

### 6) Critério de recuperação

- 5xx voltou para baseline.
- Latência p95/p99 estabilizou.
- Não há fila de erro aumentando.

## Pós-incidente (até 48h)

- Abrir postmortem sem culpados.
- Registrar linha do tempo (detecção → mitigação → recuperação).
- Definir ações preventivas com responsável e prazo.

## Erros comuns

- Focar em log sem validar métrica/traces em paralelo.
- Aplicar várias mudanças ao mesmo tempo (dificulta causalidade).
- Encerrar incidente sem critérios objetivos de recuperação.
