# GitOps com Argo CD e Flux

## O que é
GitOps é um modelo operacional em que o Git define o estado desejado de infraestrutura e aplicações. Controladores no cluster comparam estado desejado vs estado real e reconciliam automaticamente.

## Por que isso existe
Deploy manual com `kubectl apply` direto em produção gera baixa auditabilidade e alto risco de drift. GitOps fornece trilha de auditoria por commit, rollback previsível e convergência contínua.

## Como funciona internamente

### Princípios GitOps
1. Estado declarativo versionado no Git.
2. Mudanças aprovadas por PR.
3. Reconciliação automática contínua.
4. Observabilidade de sync/health.

### Reconciliation loop e drift detection
```text
Git (desired state) ---> Controller (ArgoCD/Flux) ---> Kubernetes API
        ^                         |                         |
        |--------------------- drift detection -------------|
```

- O controlador detecta divergência (drift).
- Aplica correções para voltar ao estado declarado.
- Pode emitir alertas quando sincronização falha.

### Argo CD vs FluxCD
- **Argo CD**: UI robusta, app-of-apps, boa experiência visual para operações.
- **FluxCD**: abordagem modular por controllers, forte integração com Kustomize.

## Exemplos práticos

### Fluxo de mudança
1. Alterar chart/manifest no repositório de ambiente.
2. Abrir PR com validações (lint, policy, segurança).
3. Merge em `main`.
4. Argo CD/Flux sincroniza cluster.

### Comandos úteis Argo CD
```bash
argocd app list
argocd app get payments-prod
argocd app sync payments-prod
argocd app rollback payments-prod 3
```

### Exemplo de Application (Argo CD)
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payments-prod
spec:
  source:
    repoURL: https://github.com/org/platform-config.git
    path: apps/payments/overlays/prod
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: payments
```

## Boas práticas
- Separar repositório de aplicação e repositório de configuração de ambiente.
- Exigir PR com revisão para qualquer mudança em produção.
- Integrar policy-as-code (OPA/Kyverno) antes da sincronização.
- Configurar alertas para app `OutOfSync` e `Degraded`.

## Armadilhas comuns
- Dar acesso amplo de escrita no cluster e bypass do GitOps.
- Misturar segredos em texto plano no Git.
- Falta de estratégia para ordem de deploy entre dependências.

## Referências relacionadas
- [[01 - Git e Estratégia de Branches]]
- [[04 - Helm e Kustomize]]
- [[08 - Secrets e Supply Chain Security]]
