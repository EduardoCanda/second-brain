# DynamoDB

## O que é
Banco NoSQL key-value/documento serverless de baixa latência.

## Caso de uso
Sessões, carrinho, catálogo, eventos e workloads de escala massiva.

## Por que existe
Existe para throughput previsível e alta disponibilidade sem gestão de servidor.

## Trade-offs
- ✅ Escala horizontal nativa e alta performance.
- ❌ Exige modelagem por padrão de acesso; consultas ad hoc são limitadas.

## Boas práticas
- Modele partição para evitar hot keys.
- Planeje GSI/LSI com base nos acessos reais.
- Ative TTL e backups para governança de dados.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **DynamoDB**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
