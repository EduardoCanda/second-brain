Hooks automatizam validações locais e no servidor.

Exemplos úteis:
- `pre-commit`: lint, secrets scan, formatação.
- `commit-msg`: validar Conventional Commits.
- `pre-push`: rodar suíte rápida de testes.

Exemplo (`.git/hooks/pre-commit`):
```bash
#!/usr/bin/env bash
set -euo pipefail
terraform fmt -check -recursive
hadolint Dockerfile
```
