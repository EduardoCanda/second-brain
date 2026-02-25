# GitOps com Argo CD e Flux

## Objetivo
Usar Git como fonte única de verdade para estado desejado do cluster.

## Conceitos-chave
- Mudança entra via PR.
- Controlador (Argo CD/Flux) reconcilia estado real x desejado.
- Rollback por commit.

## Benefícios
- Auditoria completa.
- Menos drift manual.
- Padronização de deploy entre ambientes.

## Fluxo sugerido
1. Atualizar manifest/chart no Git.
2. Abrir PR e validar no CI.
3. Merge em branch alvo.
4. Argo/Flux sincroniza automaticamente.
