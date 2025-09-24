---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Sim, o **`targetRevision` no [[introducao-argocd|Argo CD]] pode ser uma [[Tag]] [[Git]]** (e essa é uma prática recomendada em ambientes de produção para garantir previsibilidade). Vamos explorar os detalhes:

---

### ✅ **Usando Tags como `targetRevision`**
#### **Como funciona?**
No seu [[application|application]] ou [[applicationset]], você pode referenciar:
```yaml
source:
  repoURL: https://github.com/meu-repo.git
  targetRevision: v1.2.3  # Tag Git
  path: manifests/
```
- O Argo CD buscará exatamente o commit associado à tag `v1.2.3`.

---

### 📌 **Vantagens**
1. **Imutabilidade**:  
   - Tags são imutáveis (ao contrário de [[areas/ti/git/Branch]]), garantindo que o deploy não mude acidentalmente.

2. **Versionamento Semântico**:  
   - Facilita rollbacks (ex.: `v1.2.3` → `v1.2.2`).

3. **Integração com CI/CD**:  
   - Pipelines podem criar tags automaticamente (ex.: `git tag -a v1.2.3 -m "Release" && git push origin v1.2.3`).

---

### ⚠️ **Cuidados Necessários**
1. **Tags devem existir no repositório**:  
   - Verifique se a tag foi pushada:  
     ```bash
     git ls-remote --tags https://github.com/meu-repo.git | grep v1.2.3
     ```

2. **Sincronização manual após nova tag**:  
   - Por padrão, o Argo CD **não atualiza** automaticamente quando uma nova tag é criada (a menos que use `semver` ou webhooks).

3. **Evite tags mutáveis**:  
   - Nunca force push (`git tag -f`) em tags já usadas em produção.

---

### 🔄 **Alternativas ao `targetRevision`**
| Tipo               | Exemplo   | Recomendação                      |
| ------------------ | --------- | --------------------------------- |
| **Tag**            | `v1.2.3`  | ✅ Melhor para produção            |
| **Branch**         | `main`    | ❌ Risco de mudanças inesperadas   |
| **[[Commit]] SHA** | `a1b2c3d` | ✅ Mais preciso, mas menos legível |
| **SemVer Range**   | `v1.2.*`  | ⚠️ Útil para dev (não para prod)  |
|                    |           |                                   |

---

### 🛠 **Exemplo Prático**
#### **1. Criando uma tag**:
```bash
git tag -a v1.2.3 -m "Release stable"
git push origin v1.2.3
```

#### **2. Aplicando no Argo CD**:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: meu-app
spec:
  source:
    repoURL: https://github.com/meu-repo.git
    targetRevision: v1.2.3  # Tag aqui
    helm:
      values:
        image.tag: v1.2.3  # Consistência com a tag do repo
```

#### **3. Atualizando para nova tag**:
- Modifique o `targetRevision` no Git (ou via UI/CLI):
  ```bash
  argocd app set meu-app --revision v1.3.0
  ```

---

### 💡 **Dica Avançada: SemVer Dinâmico**
Se quiser atualizações automáticas **dentro de uma versão** (ex.: `v1.2.*`), use:
```yaml
targetRevision: v1.2.*  # Pega a última tag v1.2.X
```
> ⚠️ **Atenção**: Isso pode introduzir variações não testadas em produção.

---

### ❓ **Perguntas Frequentes**
**Q: O Argo CD detecta novas tags automaticamente?**  
R: Não por padrão. Configure um **webhook** ou use:
```bash
argocd app sync meu-app
```

**Q: Posso usar tags não anotadas?**  
R: Sim (`git tag v1.2.3`), mas tags anotadas (`-a`) são preferíveis para rastreabilidade.

---

### ✅ **Resumo Final**
- **Tags são ideais para produção** (imutáveis + versionamento claro).  
- **Sempre verifique se a tag existe** no repositório remoto.  
- **Para atualizações**, modifique o `targetRevision` via GitOps (não manualmente via `kubectl`).  

Quer um exemplo de CI/CD gerando tags automaticamente? Posso elaborar!