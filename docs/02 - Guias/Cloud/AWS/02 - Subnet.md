# Subnet

## O que é
Partição de uma VPC em faixas menores de IP, associada a uma AZ específica.

## Caso de uso
Subnets públicas para balanceadores/NAT e privadas para aplicação, worker e bancos.

## Por que existe
Existe para segmentar cargas por função, risco e disponibilidade.

## Trade-offs
- ✅ Base de alta disponibilidade e segurança em camadas.
- ❌ Planejamento CIDR ruim limita crescimento e cria retrabalho pesado.

## Boas práticas
- Evite colocar banco em subnet pública.
- Distribua recursos entre AZ-A e AZ-B.
- Documente CIDRs para evitar sobreposição em peering/transit gateway.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **Subnet**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
