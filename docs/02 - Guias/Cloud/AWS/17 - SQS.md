# SQS (Simple Queue Service)

## O que é
Fila gerenciada para comunicação assíncrona entre serviços.

## Caso de uso
Processar pedidos, envio de email, geração de relatório fora da requisição síncrona.

## Por que existe
Existe para desacoplar sistemas e absorver picos sem derrubar dependências.

## Trade-offs
- ✅ Simples, resiliente e escalável.
- ❌ Requer consumidores com idempotência e controle de visibilidade/retry.

## Boas práticas
- Defina DLQ para mensagens com falha recorrente.
- Ajuste visibility timeout ao tempo real de processamento.
- Monitore age/queue depth para auto scaling de workers.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **SQS**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
