# CloudWatch

## O que é
Plataforma de métricas, logs, alarmes e dashboards da AWS.

## Caso de uso
Monitorar saúde, SLOs e acionar alarmes/automação de incidentes.

## Por que existe
Existe para dar visibilidade operacional integrada ao ecossistema AWS.

## Trade-offs
- ✅ Observabilidade centralizada e integrada.
- ❌ Custo cresce rápido sem estratégia de retenção e cardinalidade.

## Boas práticas
- Padronize logs estruturados.
- Crie alarmes por sintoma de usuário (latência/erro).
- Configure retenção por compliance e custo.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **CloudWatch**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
