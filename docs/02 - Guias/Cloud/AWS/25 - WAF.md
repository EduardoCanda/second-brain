# AWS WAF

## O que é
Firewall de aplicação web (L7) para proteger HTTP/HTTPS.

## Caso de uso
Bloquear bots, SQLi, XSS e padrões maliciosos em ALB/API Gateway/CloudFront.

## Por que existe
Existe para camada extra de proteção antes da aplicação.

## Trade-offs
- ✅ Mitiga ataques comuns rapidamente.
- ❌ Regras agressivas podem gerar falso positivo e bloquear usuário legítimo.

## Boas práticas
- Comece com rule groups gerenciados e monitore em count mode.
- Ajuste exceções por rota quando necessário.
- Integre com observabilidade e resposta a incidente.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **WAF**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
