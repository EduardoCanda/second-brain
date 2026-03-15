# EKS (Elastic Kubernetes Service)

## O que é
Kubernetes gerenciado na AWS (control plane gerenciado).

## Caso de uso
Plataformas multi-time, ecossistema CNCF, padronização Kubernetes.

## Por que existe
Existe para unir portabilidade K8s com redução de esforço no controle do cluster.

## Trade-offs
- ✅ Ecossistema rico e portável.
- ❌ Curva de complexidade e custo maiores que ECS em muitos times.

## Boas práticas
- Use managed node groups ou Fargate profile conforme perfil.
- Padronize observabilidade e política com admission controllers.
- Defina estratégia de upgrades contínuos.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **EKS**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
