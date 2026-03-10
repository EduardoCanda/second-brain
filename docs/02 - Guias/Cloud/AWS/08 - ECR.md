# ECR (Elastic Container Registry)

## O que é
Registro privado de imagens Docker/OCI da AWS.

## Caso de uso
Armazenar imagens para ECS, EKS e Lambda (container image).

## Por que existe
Existe para distribuição segura e integrada de imagens no ecossistema AWS.

## Trade-offs
- ✅ Integração nativa com IAM e scanning.
- ❌ Acoplamento maior à AWS para pipelines multi-cloud.

## Boas práticas
- Aplique política de retenção de imagens.
- Assine/scaneie imagens no pipeline.
- Organize repositórios por domínio/contexto.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **ECR**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
