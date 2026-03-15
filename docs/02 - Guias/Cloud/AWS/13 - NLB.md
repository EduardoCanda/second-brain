# NLB (Network Load Balancer)

## O que é
Load balancer L4 de alta performance para TCP/UDP/TLS.

## Caso de uso
Serviços com latência muito baixa, alto throughput, protocolos não-HTTP.

## Por que existe
Existe para balanceamento de rede bruto com alta escala.

## Trade-offs
- ✅ Desempenho elevado e IP estático por AZ.
- ❌ Menos recursos de roteamento de aplicação que ALB.

## Boas práticas
- Use quando L7 não for necessário.
- Planeje observabilidade de app fora do balanceador.
- Valide timeouts e keepalive do protocolo.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **NLB**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
