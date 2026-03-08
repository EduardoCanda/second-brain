# Arquitetura Cloud para DevOps

## O que é
Arquitetura cloud para DevOps é o desenho de identidade, rede, observabilidade, disponibilidade e custo para operar plataformas de forma segura e escalável.

## Por que isso existe
Decisões de arquitetura afetam diretamente confiabilidade, velocidade de entrega e custo. Sem padrão, surgem ambientes inseguros, caros e difíceis de operar.

## Como funciona internamente

### IAM design
- princípio do menor privilégio.
- roles por workload e por equipe.
- credenciais temporárias (STS/IRSA) em vez de chaves estáticas.

### Networking
```text
Internet -> WAF/ALB -> Subnets privadas (apps) -> Subnets de dados (DB)
```

Pilares:
- segmentação de rede por camadas,
- security groups/NACLs,
- egress control e DNS interno.

### Observability architecture
- Logs centralizados (CloudWatch/Loki/ELK).
- Métricas (Prometheus/Managed service).
- Traces distribuídos (OpenTelemetry).

### High availability
- Multi-AZ por padrão para serviços críticos.
- Planejar failover regional quando exigido por RTO/RPO.

### Cost optimization
- tagging obrigatória para chargeback/showback.
- rightsizing e autoscaling.
- uso de instâncias reservadas/savings plans quando previsível.

## Exemplos práticos

### AWS CLI
```bash
aws ec2 describe-security-groups --group-ids sg-1234567890
aws ce get-cost-and-usage --time-period Start=2026-01-01,End=2026-01-31 --granularity MONTHLY --metrics UnblendedCost
aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:role/app-role --action-names s3:GetObject
```

### Padrão de contas
- conta `shared-services` (CI/CD, observabilidade),
- contas por ambiente (`dev`, `staging`, `prod`),
- guardrails com SCP e baseline de segurança.

## Boas práticas
- Definir landing zone e padrões antes de escalar workloads.
- Centralizar logs/auditoria (CloudTrail, Config) em conta dedicada.
- Revisar permissões IAM periodicamente.
- Priorizar serviços gerenciados para reduzir carga operacional.

## Armadilhas comuns
- Conta única para tudo sem isolamento de blast radius.
- Papéis IAM genéricos com permissões excessivas (`*:*`).
- Otimização de custo sem considerar SLO/risco operacional.

## Referências relacionadas
- [[02 - Terraform para IaC]]
- [[08 - Secrets e Supply Chain Security]]
- [[09 - SRE SLI SLO SLA e Incidentes]]
- [[10 - Backup Restore e Disaster Recovery]]
