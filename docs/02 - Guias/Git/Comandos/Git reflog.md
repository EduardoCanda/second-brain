`reflog` registra movimentos de `HEAD` local, útil para recuperar commits após `reset`/`rebase` incorreto:
```bash
git reflog
git checkout -b recovery HEAD@{3}
```
