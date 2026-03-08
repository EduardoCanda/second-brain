# Backup, restore e disaster recovery

## O que é
Conjunto de processos técnicos e operacionais para garantir continuidade do negócio após falhas, exclusões acidentais, corrupção de dados ou indisponibilidade regional.

## Por que isso existe
Ter backup não significa estar protegido. O que protege é capacidade comprovada de restaurar dentro do RTO e com perda de dados dentro do RPO definido.

## Como funciona internamente

### RTO e RPO
- **RTO** (Recovery Time Objective): tempo máximo para recuperar serviço.
- **RPO** (Recovery Point Objective): perda máxima de dados aceitável.

### Estratégia 3-2-1
- 3 cópias dos dados.
- 2 mídias diferentes.
- 1 cópia offsite/imutável.

### Fluxo operacional
```text
Backup agendado -> validação -> retenção -> teste de restore -> evidência
```

## Exemplos práticos

### Kubernetes (Velero)
```bash
velero backup create prod-cluster-daily --include-namespaces payments
velero backup get
velero restore create --from-backup prod-cluster-daily
```

### Banco em AWS (RDS)
- snapshots automáticos com retenção definida.
- cópia cross-region para cenário de desastre regional.

### Estrutura de runbook
1. Critério de acionamento.
2. Pré-requisitos e acessos.
3. Passo a passo de restore.
4. Checklist de validação pós-restore.
5. Plano de comunicação.

## Boas práticas
- Testar restore periodicamente em ambiente isolado.
- Ativar criptografia em repouso e trânsito.
- Monitorar jobs de backup com alertas de falha.
- Definir owner por sistema e periodicidade.

## Armadilhas comuns
- Backup sem teste de restauração.
- Mesmo domínio de falha para produção e backup.
- Runbook desatualizado e sem evidência de execução.

## Referências relacionadas
- [[09 - SRE SLI SLO SLA e Incidentes]]
- [[13 - Arquitetura Cloud para DevOps]]
