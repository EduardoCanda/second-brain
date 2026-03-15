# EventBridge

## O que é
Barramento de eventos da AWS com roteamento por regras e integração SaaS.

## Caso de uso
Orquestração event-driven entre domínios e integrações entre contas.

## Por que existe
Existe para desacoplamento assíncrono com roteamento flexível por conteúdo.

## Trade-offs
- ✅ Regras poderosas e integração nativa com muitos serviços.
- ❌ Excesso de regras/event buses pode dificultar governança.

## Boas práticas
- Defina esquema de evento e versionamento.
- Use DLQ/archive/replay quando necessário.
- Padronize ownership por domínio.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **EventBridge**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
