# GitOps com Argo CD e Flux

## Definition
GitOps com Argo CD e Flux é uma abordagem de entrega contínua em Kubernetes em que o estado desejado do cluster fica versionado em Git, e operadores reconciliam automaticamente esse estado no ambiente.

## Why it exists
Essa abordagem existe para reduzir drift entre ambientes, aumentar rastreabilidade de mudanças e transformar o Git na fonte de verdade para deploy e configuração operacional.

## How it works
O fluxo começa com alterações em manifests, charts ou overlays versionados no repositório. Argo CD ou Flux monitora esse repositório, detecta diferenças entre o estado declarado e o estado real do cluster, e aplica reconciliação contínua. Isso permite auditoria via histórico de commits, rollback por Git revert e validação de mudanças antes da promoção para produção.

## When to use
Use quando a operação de Kubernetes exigir padronização de deploy, auditoria forte, rollback previsível e redução de mudanças manuais no cluster. É especialmente útil em times com múltiplos ambientes, vários serviços e necessidade de governança de configuração.

## Examples
Um exemplo prático é manter uma pasta `clusters/prod` com manifests ou referências Helm. Quando a imagem `api:1.8.0` é promovida, o time atualiza o repositório Git e o operador GitOps sincroniza o cluster automaticamente, registrando a mudança como commit revisável.

## Visual Representation
```mermaid
flowchart LR
    Dev[Dev altera Git] --> Repo[Repositório Git]
    Repo --> Operator[Argo CD ou Flux]
    Operator --> Cluster[Cluster Kubernetes]
    Cluster --> Operator
```

## Related Notes
- [03 - ArgoCD](../CI-CD/03%20-%20ArgoCD.md)
- [04 - Helm e Kustomize](04%20-%20Helm%20e%20Kustomize.md)
- [11 - CI-CD para DevOps](../CI-CD/11%20-%20CI-CD%20para%20DevOps.md)
