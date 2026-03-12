# Playbook — Rollback de deploy

## Quando usar

Use quando uma versão recém-publicada causar regressão funcional, degradação de performance, erro 5xx acima do tolerável ou risco de segurança.

## Pré-condições

- Existe versão estável conhecida (N-1).
- Pipeline ou ferramenta de deploy permite reversão.
- Time está alinhado em janela de comunicação do incidente.

## Estratégia recomendada

1. **Congelar novas mudanças** até estabilizar.
2. **Executar rollback mínimo** (app antes de infra, quando possível).
3. **Validar saúde** com métricas e smoke tests.
4. **Comunicar status** para stakeholders.

## Procedimento

### 1) Confirmar gatilho do rollback

- Erros 5xx acima do SLO.
- Latência p95/p99 fora da faixa normal.
- Falha em fluxo crítico de negócio.

### 2) Identificar artefato alvo

- Tag/commit da última versão estável.
- Manifest/helm chart anterior.
- Migração de banco aplicada (sim/não).

### 3) Executar rollback

Exemplo Kubernetes com rollout:

```bash
kubectl rollout history deployment/minha-api -n producao
kubectl rollout undo deployment/minha-api -n producao
kubectl rollout status deployment/minha-api -n producao
```

Exemplo Helm:

```bash
helm history minha-api -n producao
helm rollback minha-api <REVISAO_ESTAVEL> -n producao
helm status minha-api -n producao
```

### 4) Validar recuperação

- Endpoint de healthcheck responde 200.
- Taxa de erro retornou ao baseline.
- Fluxo crítico passou em smoke test.

### 5) Encerrar e documentar

- Registrar causa provável.
- Anotar horário de início/fim e impacto.
- Criar tarefa para correção definitiva antes de novo deploy.

## Cuidados importantes

- Se houve migração de banco incompatível, rollback de app pode não bastar.
- Evite rollback parcial sem mapear dependências (jobs, consumidores, cron).
- Se rollback falhar, acione plano B: feature flag ou modo degradado.
