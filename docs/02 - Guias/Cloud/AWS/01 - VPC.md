# VPC (Virtual Private Cloud)

## O que é
Rede virtual isolada na AWS onde você define IPs (CIDR), rotas, sub-redes e políticas de tráfego.

## Caso de uso
Isolar ambientes (prod/stage/dev), conectar app, banco e integrações com controle fino de rede.

## Por que existe
Existe para dar isolamento e governança de rede sem hardware físico próprio.

## Trade-offs
- ✅ Controle completo de topologia e segmentação.
- ❌ Configuração errada de rotas/NAT/peering gera incidentes difíceis de diagnosticar.

## Boas práticas
- Defina CIDR com folga para crescimento.
- Separe subnets públicas e privadas em pelo menos 2 AZs.
- Use VPC Endpoints para reduzir saída via NAT e custo.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **VPC**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
