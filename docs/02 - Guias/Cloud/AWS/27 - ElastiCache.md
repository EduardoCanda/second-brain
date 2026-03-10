# ElastiCache (Redis/Memcached)

## O que é
Cache gerenciado em memória para reduzir latência e carga do banco.

## Caso de uso
Cache de leitura, sessão, rate limit, fila leve e pub/sub interno.

## Por que existe
Existe para acelerar aplicações e proteger bancos de picos de leitura.

## Trade-offs
- ✅ Grande ganho de performance.
- ❌ Invalidação e consistência de cache exigem desenho cuidadoso.

## Boas práticas
- Defina estratégia de TTL por tipo de dado.
- Evite cache stampede com locking/local fallback.
- Monitore hit ratio e latência.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **ElastiCache**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
