# API Gateway

## O que é
Camada gerenciada para publicar APIs HTTP/REST/WebSocket.

## Caso de uso
Expor backend com auth, rate limit, versionamento e observabilidade.

## Por que existe
Existe para padronizar entrada de API com segurança e governança.

## Trade-offs
- ✅ Recursos nativos de segurança, throttling e stages.
- ❌ Pode aumentar latência/custo em tráfego alto e rotas simples.

## Boas práticas
- Use HTTP API quando possível (mais simples e barato).
- Defina quotas e throttling por consumidor.
- Versione contratos e mantenha backward compatibility.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **API Gateway**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
