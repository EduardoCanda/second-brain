# Auto Scaling (EC2/ECS)

## O que é
Mecanismo de ajuste automático de capacidade conforme métricas e demanda.

## Caso de uso
Aumentar/ reduzir instâncias e tasks em picos sem intervenção manual.

## Por que existe
Existe para equilibrar performance, disponibilidade e custo.

## Trade-offs
- ✅ Reduz risco de indisponibilidade por pico.
- ❌ Política mal calibrada causa oscillation (sobe/desce sem estabilidade).

## Boas práticas
- Use cooldown adequado e métricas alinhadas ao gargalo real.
- Teste comportamento em carga sintética.
- Defina limites mínimo/máximo por ambiente.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **Auto Scaling**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
