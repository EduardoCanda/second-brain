# Deployment Strategies em Kubernetes

## O que é
Estratégias de deployment definem como uma nova versão é liberada para usuários reduzindo risco operacional.

## Por que isso existe
Troca abrupta de versão pode causar indisponibilidade e impacto amplo. Estratégias graduais permitem validação controlada e rollback rápido.

## Como funciona internamente

### Blue/Green
Duas versões completas em paralelo:
```text
LB -> Blue (ativa)
LB -> Green (nova)
```
Após validação, o tráfego é comutado para green.

### Canary
Pequena porcentagem de tráfego vai para nova versão e cresce progressivamente.

### Rolling
Atualização gradual de pods usando estratégia nativa de Deployment.

### Feature flags
Controle de funcionalidade em tempo de execução sem redeploy.

## Exemplos práticos

### Rolling update Kubernetes
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1
    maxSurge: 1
```

### Canary com Nginx Ingress (conceitual)
- Ingress principal aponta para versão estável.
- Ingress canário roteia 5% do tráfego para nova versão.

### Comandos úteis
```bash
kubectl rollout status deployment/api -n prod
kubectl rollout history deployment/api -n prod
kubectl rollout undo deployment/api -n prod
```

### Blue/Green em Kubernetes
- dois Deployments (`api-blue`, `api-green`),
- Service aponta para seletor da versão ativa,
- comutação via alteração de label selector.

## Boas práticas
- Definir métricas de sucesso antes do rollout (erro, latência, saturação).
- Automatizar rollback por threshold.
- Usar readiness/liveness probes corretas.
- Combinar canary com feature flags para reduzir blast radius.

## Armadilhas comuns
- Canary sem observabilidade por versão.
- Blue/Green sem teste realista na versão green.
- Rollout rápido demais para perceber degradação lenta.

## Referências relacionadas
- [[07 - Nginx e Reverse Proxy]]
- [[09 - SRE SLI SLO SLA e Incidentes]]
- [[11 - CI-CD para DevOps]]
