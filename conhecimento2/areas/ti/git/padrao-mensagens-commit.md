---
tags: 
ferramenta: git
---
Sim — o padrão mais usado hoje é o **Conventional Commits**. Nele, o prefixo `fix:` indica correção de bug. A ideia é padronizar a linha de assunto para que pessoas e ferramentas entendam o tipo de mudança.

# Como funciona (resumo prático)

**Formato da primeira linha**

```
<type>[optional scope][!]: <short summary in imperative>
```

**Types mais comuns**

- `feat`: nova funcionalidade
    
- `fix`: correção de bug
    
- `docs`: documentação
    
- `style`: formatação (sem mudar lógica)
    
- `refactor`: refatoração (sem bugfix/feature)
    
- `perf`: melhora de performance
    
- `test`: testes
    
- `build`: mudanças em build/deps
    
- `ci`: mudanças em CI
    
- `chore`: tarefas diversas (ex.: scripts)
    
- `revert`: reverte um commit anterior
    

**Scope (opcional)**

- Entre parênteses para indicar área afetada: `fix(api)`, `feat(grafana)`, `build(helm)`.
    

**Breaking change**

- Adicione `!` após o type/scope **ou** detalhe no footer:
    
    - `feat(auth)!: drop legacy token flow`
        
    - Footer: `BREAKING CHANGE: rota /v1 removida`
        

**Corpo e rodapé (opcionais)**

- Explique o “porquê” e o “como”.
    
- Referencie issues/PRs: `Closes #123`, `Refs #456`.
    
- Co-autores e DCO quando preciso: `Co-authored-by: ...`, `Signed-off-by: ...`.
    

# Exemplos

```
fix(api): tratar timeout do client HTTP no /lancamentos

feat(grafana): dashboard de latência p95 por endpoint
Closes #482

refactor(linkerd): extrair criação de service profile para módulo

perf(prometheus): reduzir cardinalidade em labels de métricas

build(helm): atualizar prometheus-community/prometheus para 27.29.0

ci: adicionar job de lint para charts do Helm

revert: revert "feat(auth)!: remover fluxo legacy"
Motivo: clientes ainda dependem do fluxo antigo
```

**Exemplo de breaking change no footer**

```
feat(k8s)!: migrar Ingress para Gateway API

BREAKING CHANGE: o host legacy.example.com não é mais servido;
atualize DNS para o novo Gateway.
```

# Boas práticas de escrita

- Linha de assunto curta (≈50 chars) no **imperativo**: “add”, “fix”, “update”.
    
- Separe assunto do corpo com uma linha em branco; quebre o corpo em ~72 chars/linha.
    
- Um commit por objetivo; use o corpo para justificar o _porquê_, não só o _como_.
    
- Use inglês nos verbos/títulos quando o time é multilíngue; o importante é **consistência**.
    
- Para “commits de organização” durante rebase: `fixup!` e `squash!` funcionam com `--autosquash`.
    

# Ferramentas que ajudam

- **commitlint** + **husky**: valida a mensagem no pre-commit/pre-push.
    
- **Commitizen** (`cz`) ou **git cz**: assistente interativo para montar a mensagem.
    
- **semantic-release / changesets / release-please**: gera versões/CHANGELOG a partir dos types.
    

# Alternativas populares

- **Gitmoji** (emojis no início: ✨, 🐛, etc.) — divertido, mas menos “machine-friendly”.
    
- **Keep a Changelog** — foca no arquivo `CHANGELOG.md` (pode ser gerado via Conventional Commits).
    

Se quiser, te mando um `.commitlintrc` + hook do Husky e um `czrc` prontos para você colar no repo.