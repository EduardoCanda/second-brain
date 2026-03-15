# ELB (Elastic Load Balancing)

## O que é
Família de balanceadores gerenciados da AWS (ALB, NLB e CLB legado).

## Caso de uso
Distribuir tráfego com health checks, alta disponibilidade e failover.

## Por que existe
Existe para eliminar ponto único de falha na entrada da aplicação.

## Trade-offs
- ✅ Operação simplificada e integração com auto scaling.
- ❌ Custos e configuração errada de health-check podem degradar serviço.

## Boas práticas
- Escolha o tipo certo (ALB x NLB) pelo protocolo.
- Ajuste health check conforme comportamento real da app.
- Monitore 4xx/5xx/latência por target group.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **ELB**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
