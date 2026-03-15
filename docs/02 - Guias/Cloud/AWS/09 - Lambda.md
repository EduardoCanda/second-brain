# Lambda

## O que é
Compute serverless orientado a eventos, cobrando por execução e duração.

## Caso de uso
APIs leves, automações, processamento de eventos (S3/SQS/SNS/EventBridge).

## Por que existe
Existe para remover gestão de servidor e acelerar entrega de integrações.

## Trade-offs
- ✅ Escala automática e ótimo time-to-market.
- ❌ Cold start, limites de execução e observabilidade distribuída exigem cuidado.

## Boas práticas
- Prefira funções pequenas e coesas.
- Controle concorrência para proteger downstream.
- Use DLQ/retries para robustez.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **Lambda**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
