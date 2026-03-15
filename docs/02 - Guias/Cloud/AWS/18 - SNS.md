# SNS (Simple Notification Service)

## O que é
Pub/sub gerenciado para fan-out de eventos para múltiplos assinantes.

## Caso de uso
Publicar um evento e entregar para SQS, Lambda, HTTP, email ou mobile push.

## Por que existe
Existe para broadcast de eventos sem acoplamento ponto a ponto.

## Trade-offs
- ✅ Excelente para arquitetura orientada a eventos.
- ❌ Rastreabilidade fim-a-fim depende de observabilidade adicional.

## Boas práticas
- Combine SNS + SQS para consumo resiliente.
- Defina políticas de entrega e retry por protocolo.
- Versione payloads de evento.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **SNS**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
