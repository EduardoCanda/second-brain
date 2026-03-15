# CI/CD — GitHub Actions

## Conceitos principais
- **Workflow**: arquivo YAML dentro de `.github/workflows`.
- **Job**: conjunto de passos executados em runner.
- **Step**: comando ou action reutilizável.
- **Runner**: ambiente de execução (GitHub-hosted ou self-hosted).

## Exemplo básico
```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

## Boas práticas
- Cache de dependências.
- Proteção de branch e required checks.
- Segredos no `GitHub Secrets`.
- Reuso com workflows reutilizáveis.
