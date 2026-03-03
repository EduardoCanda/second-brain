# Git e estratégia de branches para DevOps

## Objetivo
Padronizar como o time versiona código, infraestrutura e automações.

## Conceitos-chave
- **Trunk-based development**: branch curta + merge frequente.
- **GitFlow**: modelo com `main`, `develop`, `release`, `hotfix`.
- **Conventional Commits**: `feat:`, `fix:`, `chore:` para gerar changelog.
- **SemVer**: `MAJOR.MINOR.PATCH`.

## Recomendação prática
Para times pequenos/médios, começar com **trunk-based + feature flags**.

## Checklist de implementação
- [ ] Proteger branch `main`.
- [ ] Exigir PR + review.
- [ ] Rodar CI obrigatório antes de merge.
- [ ] Definir padrão de commit.
- [ ] Automatizar release notes.

## Comandos úteis
```bash
git checkout -b feat/minha-feature
git commit -m "feat(ci): adiciona validação de lint"
git rebase main
git push origin feat/minha-feature
```
