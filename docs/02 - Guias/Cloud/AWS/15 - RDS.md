# RDS (Relational Database Service)

## O que é
Banco relacional gerenciado (PostgreSQL, MySQL, MariaDB etc.).

## Caso de uso
Sistemas transacionais com SQL, joins e transações ACID.

## Por que existe
Existe para reduzir operação de banco (backup, patch, replica, failover).

## Trade-offs
- ✅ Menos carga operacional e maior confiabilidade padrão.
- ❌ Menor liberdade de tunning profundo comparado a self-managed.

## Boas práticas
- Use Multi-AZ em produção crítica.
- Dimensione IOPS/storage por perfil real de carga.
- Faça revisão de índices e queries continuamente.

## Quando não usar
- Quando o problema pode ser resolvido com uma opção mais simples e barata.
- Quando o time não tem maturidade operacional para sustentar a complexidade do **RDS**.
- Quando os requisitos de latência, compliance ou portabilidade pedem outra estratégia.

## Erros comuns
- Escolher tecnologia por hype, sem mapear padrão real de acesso/tráfego.
- Ignorar custo total (execução + transferência + observabilidade + operação).
- Não definir limites, alarmes e dono do serviço em produção.

## Checklist de decisão rápida
- Qual SLO/SLA esperado (latência, disponibilidade, throughput)?
- Qual o volume de tráfego e perfil de crescimento (picos previsíveis ou não)?
- Qual o nível de esforço operacional aceitável para o time?
