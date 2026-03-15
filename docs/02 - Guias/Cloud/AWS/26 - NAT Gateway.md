# NAT Gateway

## O que é
Serviço que permite saída para internet de recursos em subnet privada.

## Caso de uso
Aplicação privada baixando updates/chamando APIs externas sem IP público.

## Por que existe
Existe para manter recursos privados sem perder acesso de saída controlada.

## Trade-offs
- ✅ Simplifica arquitetura segura para egress.
- ❌ Pode representar custo alto; VPC endpoints podem reduzir gasto.

## Boas práticas
- Coloque NAT por AZ para resiliência.
- Avalie VPC endpoints para S3/DynamoDB.
- Monitore tráfego de saída e custos.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **NAT Gateway**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
