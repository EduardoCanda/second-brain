# CloudFront

## O que é
CDN global da AWS para cache e entrega de conteúdo com baixa latência.

## Caso de uso
Frontend estático, distribuição de mídia, aceleração de APIs.

## Por que existe
Existe para aproximar conteúdo do usuário e reduzir carga na origem.

## Trade-offs
- ✅ Menor latência e menor custo na origem em escala.
- ❌ Estratégia ruim de cache/invalidation gera comportamento inesperado.

## Boas práticas
- Defina cache policy por tipo de conteúdo.
- Evite encaminhar headers/cookies desnecessários.
- Use WAF e TLS moderno no edge.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **CloudFront**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
