## O que é
Git é um sistema de versionamento distribuído baseado em conteúdo endereçável por hash. Em operação DevOps, ele não versiona apenas aplicação, mas também infraestrutura, manifests Kubernetes, pipelines e runbooks.

Esta nota cobre:
- Git internals (`blob`, `tree`, `commit`).
- `rebase` vs `merge`.
- `hooks`, `bisect`, `reflog`.
- Estratégias avançadas de branching e versionamento.

## Por que isso existe
Sem padrão de versionamento, o time perde rastreabilidade, dificulta rollback e aumenta lead time. Em ambientes com CI/CD e GitOps, o Git vira o mecanismo de auditoria e controle de mudança.

Problemas que este guia reduz:
- Conflitos frequentes por branches longas.
- Históricos confusos com merges não intencionais.
- Releases sem convenção de versão.
- Dificuldade em descobrir qual commit quebrou produção.

## Como funciona internamente

### Git internals: blobs, trees e commits
```text
commit
 ├─ metadata (author, committer, message, parent)
 └─ tree (snapshot da raiz)
     ├─ blob  (conteúdo de arquivo)
     └─ tree  (subdiretório)
```

- **Blob**: conteúdo bruto de um arquivo.
- **Tree**: índice de nomes e permissões apontando para blobs/trees.
- **Commit**: ponteiro para uma tree + metadados + commit pai.

Comandos para inspecionar objetos:
```bash
git cat-file -t <hash>
git cat-file -p <hash>
git ls-tree -r HEAD
```

### Merge vs Rebase
- **Merge** preserva a topologia real (cria commit de merge).
- **Rebase** reaplica commits em outra base (histórico linear).

Exemplo:
```bash
# Atualizar branch de feature com main

git checkout feat/api-timeout
git fetch origin
git rebase origin/main

# Resolver conflitos e continuar
git rebase --continue
```

Recomendação prática:
- Use `rebase` local para manter histórico limpo antes de abrir PR.
- Use `merge commit` ou `squash merge` conforme política do repositório.

### Advanced workflows
- **Trunk-based**: branch curta (1-2 dias), merge frequente, feature flags.
- **GitFlow**: útil em times com release train e versionamento rígido.
- **Release branch**: estabilização antes de promover para produção.
- **Hotfix branch**: correção imediata a partir de `main`/tag de produção.

## Exemplos práticos

### Conventional Commits + SemVer
- `feat:` incrementa MINOR.
- `fix:` incrementa PATCH.
- `feat!` ou `BREAKING CHANGE:` incrementa MAJOR.

Exemplos:
```text
feat(api): adiciona paginação por cursor
fix(worker): corrige retry exponencial
feat!: remove endpoint /v1/legacy
```

## Boas práticas
- Proteja `main` com PR obrigatório e checks obrigatórios.
- Exija commits assinados (GPG/Sigstore) em repositórios críticos.
- Padronize mensagem de commit com Conventional Commits.
- Prefira branches curtas para reduzir conflito.
- Use tags anotadas para releases (`git tag -a v1.4.0 -m "release"`).

## Armadilhas comuns
- Rebase em branch compartilhada sem alinhamento com o time.
- Merge de PR sem rodar testes obrigatórios.
- Usar `git push --force` sem `--force-with-lease`.
- Tratar `reflog` como backup permanente (expira com GC).
