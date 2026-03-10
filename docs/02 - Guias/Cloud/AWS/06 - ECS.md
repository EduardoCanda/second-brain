# ECS (Elastic Container Service)

## O que é
Orquestrador de containers da AWS com modos EC2 ou Fargate.

## Caso de uso
Microserviços e workers em container com operação mais simples que Kubernetes.

## Por que existe
Existe para rodar containers em escala com integração nativa AWS e pouca sobrecarga operacional.

## Trade-offs
- ✅ Simples para times pequenos/médios; ótima integração IAM/ALB/CloudWatch.
- ❌ Portabilidade menor que Kubernetes puro em cenários multi-cloud.

## Boas práticas
- Use Fargate para reduzir operação de host.
- Versione task definitions e revise limites CPU/memória.
- Combine com Auto Scaling por métricas e fila (SQS).

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **ECS**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
