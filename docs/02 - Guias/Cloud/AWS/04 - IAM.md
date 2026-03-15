# IAM (Identity and Access Management)

## O que é
Serviço de identidade e autorização da AWS: usuários, grupos, roles e policies.

## Caso de uso
Permitir que ECS leia S3, Lambda publique SNS, humanos acessem conta com MFA.

## Por que existe
Existe para centralizar autenticação/autorização e auditoria de acesso.

## Trade-offs
- ✅ Permissão granular e auditável.
- ❌ Policies extensas e mal projetadas causam risco ou bloqueio operacional.

## Boas práticas
- Use roles para workloads, não access key fixa.
- Aplique princípio do menor privilégio.
- Habilite MFA e trilha de auditoria (CloudTrail).

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **IAM**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
