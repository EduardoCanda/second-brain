## O que é
SRE é uma disciplina para operar sistemas confiáveis com engenharia. Usa metas objetivas de confiabilidade e processos de resposta a incidentes para balancear velocidade e estabilidade.

## Por que isso existe
Sem métricas claras, incidentes viram decisões subjetivas. SLI/SLO/SLA e error budget criam linguagem comum entre produto, engenharia e operação.

## Como funciona internamente

### SLI, SLO e SLA
- **SLI**: métrica observável (latência, disponibilidade, taxa de erro).
- **SLO**: alvo interno para o SLI (ex.: 99,9% mensal).
- **SLA**: compromisso externo com penalidades contratuais.

### Error budget
```text
Disponibilidade alvo: 99.9% / mês
Erro permitido: 0.1% (~43m49s/mês)
```

Se o budget acaba, prioridade muda para confiabilidade (congelamento de release, correções estruturais).

### Incident response
1. Detecção e classificação de severidade.
2. Comando de incidente e canais de comunicação.
3. Mitigação rápida (containment).
4. Correção definitiva e follow-up.

## Exemplos práticos

### Métricas iniciais
- Disponibilidade por serviço (SLI): requests válidos / total.
- Latência p95 por endpoint crítico.
- Taxa de erro 5xx em janela móvel de 5 minutos.

### Exemplo de consulta PromQL
```promql
sum(rate(http_requests_total{status=~"5..",job="api"}[5m]))
/
sum(rate(http_requests_total{job="api"}[5m]))
```

### Postmortem blameless
Estrutura mínima:
- impacto,
- linha do tempo,
- causa raiz,
- ações corretivas,
- responsáveis e prazo.

## Boas práticas
- Definir poucos SLOs críticos por jornada de usuário.
- Automatizar alertas orientados a sintomas, não só infraestrutura.
- Manter runbooks por alerta de alta recorrência.
- Revisar semanalmente consumo de error budget.

## Armadilhas comuns
- Meta de 100% disponibilidade para tudo (custo proibitivo).
- Alert fatigue por thresholds sem contexto.
- Postmortem sem ação rastreável e sem dono.