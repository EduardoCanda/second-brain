# CI-CD para DevOps

## Definition
CI-CD para DevOps é o conjunto de práticas e pipelines que automatizam build, testes, validações, empacotamento e entrega de software de forma contínua.

## Why it exists
Essa prática existe para reduzir lead time, aumentar confiabilidade das entregas, padronizar qualidade e diminuir risco operacional causado por processos manuais.

## How it works
O pipeline normalmente inicia em um commit ou pull request, executa lint, testes e build, publica artefatos versionados e promove versões entre ambientes conforme políticas do time. Em cenários maduros, o CD pode disparar deploy automatizado ou atualizar o repositório usado por GitOps.

## When to use
Use em praticamente qualquer produto que precise de entregas frequentes, rastreabilidade, validação automatizada e feedback rápido sobre regressões. O ganho é maior em sistemas com múltiplos serviços, alta cadência de mudança e dependência de ambientes consistentes.

## Examples
Um fluxo comum é: `git push` aciona GitHub Actions, que roda testes, cria imagem Docker, publica no registry e atualiza um manifest de deploy consumido por Argo CD. Isso reduz trabalho manual e mantém o processo repetível.

## Visual Representation
```mermaid
flowchart LR
    Commit[Commit] --> CI[CI]
    CI --> Tests[Testes]
    Tests --> Build[Build]
    Build --> Registry[Artefato ou imagem]
    Registry --> CD[CD]
    CD --> Env[Ambiente alvo]
```

## Related Notes
- [00 - Fundamentos](00%20-%20Fundamentos.md)
- [01 - GitHub Actions](01%20-%20GitHub%20Actions.md)
- [03 - ArgoCD](03%20-%20ArgoCD.md)
