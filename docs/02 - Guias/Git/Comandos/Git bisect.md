### Git bisect
Busca binária para encontrar commit regressivo:
```bash
git bisect start
git bisect bad HEAD
git bisect good v1.8.0
# executar teste
./scripts/smoke-test.sh && git bisect good || git bisect bad
git bisect reset
