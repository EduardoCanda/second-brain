# Route 53

## O que é
Serviço DNS gerenciado da AWS com políticas avançadas de roteamento.

## Caso de uso
Domínios públicos/privados, failover geográfico, roteamento por latência.

## Por que existe
Existe para resolver nomes com alta disponibilidade global.

## Trade-offs
- ✅ Muito confiável e flexível.
- ❌ Erros de DNS/TTL podem causar incidentes de grande impacto.

## Boas práticas
- Use health checks para failover.
- Ajuste TTL conforme criticidade de mudança.
- Separe zonas por ambiente quando fizer sentido.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **Route 53**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
