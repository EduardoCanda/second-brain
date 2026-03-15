# KMS e Secrets Manager

## O que é
KMS gerencia chaves criptográficas; Secrets Manager armazena e rotaciona segredos.

## Caso de uso
Criptografar dados e guardar credenciais (DB, API keys, tokens) com rotação.

## Por que existe
Existe para reduzir risco de vazamento e suportar compliance.

## Trade-offs
- ✅ Segurança forte com trilha de auditoria.
- ❌ Requer desenho de permissões e governança mais rigoroso.

## Boas práticas
- Nunca commitar segredo no repositório.
- Use rotação automática quando possível.
- Restrinja leitura de segredo por role e contexto.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **KMS e Secrets Manager**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
