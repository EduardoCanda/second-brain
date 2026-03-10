# ALB (Application Load Balancer)

## O que é
Load balancer L7 para HTTP/HTTPS com roteamento por host/path/header.

## Caso de uso
Microserviços web, múltiplos domínios, canary e blue/green por regra.

## Por que existe
Existe para roteamento inteligente em aplicações web modernas.

## Trade-offs
- ✅ Regras avançadas e integração com WAF/OIDC.
- ❌ Não é ideal para tráfego TCP puro e cenários ultra-low-latency.

## Boas práticas
- Centralize TLS com ACM.
- Use target groups separados por serviço.
- Adote health endpoints específicos (/healthz).

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **ALB**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
