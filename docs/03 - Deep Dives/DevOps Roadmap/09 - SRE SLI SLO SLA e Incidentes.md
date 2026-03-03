# SRE: SLI, SLO, SLA e gestão de incidentes

## Objetivo
Medir confiabilidade de forma objetiva e guiar prioridade operacional.

## Conceitos
- **SLI**: indicador (latência, taxa de erro, disponibilidade).
- **SLO**: meta interna do SLI.
- **SLA**: compromisso contratual.
- **Error budget**: margem de falha permitida.

## Operação de incidentes
- Runbook por serviço.
- Triage e severidade (SEV1, SEV2...).
- Comunicação durante incidente.
- Postmortem sem culpados (blameless).

## Métricas iniciais sugeridas
- Disponibilidade 99.9%.
- p95 de latência por endpoint.
- Taxa de erro HTTP 5xx.
