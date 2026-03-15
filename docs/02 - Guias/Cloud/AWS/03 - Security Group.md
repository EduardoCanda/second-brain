# Security Group

## O que é
Firewall stateful em nível de ENI/recurso, controlando tráfego de entrada e saída.

## Caso de uso
Permitir apenas tráfego necessário (ex.: app → banco na porta 5432).

## Por que existe
Existe para aplicar menor privilégio na camada de rede de forma simples.

## Trade-offs
- ✅ Regras por origem/destino com referência entre SGs.
- ❌ Regras permissivas (0.0.0.0/0) aumentam superfície de ataque.

## Boas práticas
- Modele por papel: sg-alb, sg-app, sg-db.
- Priorize origem por SG em vez de faixa IP aberta.
- Revise regras periodicamente com IaC.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **Security Group**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
