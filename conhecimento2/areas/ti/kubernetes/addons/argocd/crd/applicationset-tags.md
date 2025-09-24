---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Sim, o uso de **[[applicationset]] com [[Tag|tags]] dinâmicas** pode introduzir desafios significativos em ambientes de produção, mas há estratégias para mitigar esses problemas. Vamos explorar os riscos e soluções:

---

### 🔍 **Problemas com Tags Dinâmicas no ApplicationSet**

#### 1. **Inconsistência de Versões**
   - Se o `targetRevision` apontar para um padrão dinâmico (ex.: `v1.2.*`), diferentes Applications podem usar versões diferentes do mesmo [[Chart]], mesmo que o ApplicationSet seja atualizado simultaneamente.
   - **Exemplo**: 
     ```yaml
     generators:
       - list:
           elements:
             - app: app1
               version: v1.2.*  # Pega a última tag 1.2.X
             - app: app2
               version: v1.2.*  # Pode resolver para v1.2.3 (enquanto app1 usa v1.2.4)
     ```

#### 2. **Falta de Determinismo**
   - O ApplicationSet **não garante atomicidade** na atualização de múltiplos Applications. Se uma nova tag for criada durante a reconciliação, alguns apps podem sincronizar com a tag antiga e outros com a nova.

#### 3. **Dificuldade de Rollback**
   - Rollbacks exigem modificar manualmente o `targetRevision` em cada Application gerado (ou reverter o ApplicationSet, o que pode ser lento).

---

### ✅ **Estratégias para Mitigar**

#### 1. **Use SHA de Commit (Imutável)**
   Substitua tags por **commit SHAs** quando precisar de precisão absoluta:
   ```yaml
   targetRevision: a1b2c3d  # SHA do commit
   ```
   - **Vantagem**: Totalmente imutável.
   - **Desvantagem**: Menos legível que tags.

#### 2. **Trave Tags com SemVer Exato**
   Evite padrões dinâmicos (ex.: `v1.2.*`) e use tags fixas:
   ```yaml
   generators:
     - list:
         elements:
           - app: app1
             version: v1.2.3  # Tag fixa
   ```

#### 3. **ApplicationSet + [[helm]] Release Versions**
   - Armazene a versão desejada em um **[[configmap]]/[[secret]]** gerenciado pelo Helm.
   - O ApplicationSet lê a versão desse recurso:
     ```yaml
     generators:
       - scmProvider:
           github:
             api: "https://api.github.com"
             owner: "meu-user"
             tokenRef:
               secretName: github-token
               key: token
     template:
       spec:
         source:
           helm:
             values: |
               version: {{ .latestReleaseTag }}  # Lido de um ConfigMap
     ```

#### 4. **Sincronização Manual via CI/CD**
   - Pipeline de CI atualiza o ApplicationSet **após criar uma nova tag**:
     ```bash
     # Após git tag v1.2.4:
     argocd appset set my-appset --git-revision v1.2.4
     ```

---

### ⚠️ **Anti-Padrões a Evitar**

| Cenário                | Problema                          | Solução Alternativa               |
|------------------------|-----------------------------------|-----------------------------------|
| `targetRevision: main` | Mudanças inesperadas              | Usar tags ou SHAs                 |
| `targetRevision: v1.*` | Muito amplo (pega versões quebradas) | Travar versão exata (v1.2.3) |

---

### 📌 **Exemplo Seguro**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: safe-appset
spec:
  generators:
    - list:
        elements:
          - app: app1
            version: v1.2.3  # Tag fixa
          - app: app2
            version: v1.2.3  # Mesma versão para todos
  template:
    spec:
      source:
        repoURL: https://github.com/meu-repo.git
        targetRevision: '{{version}}'  # Usa a tag fixa
        helm:
          values:
            image.tag: '{{version}}'  # Garante consistência
```

---

### 🔄 **Fluxo Recomendado para Tags Dinâmicas**
1. **Pipeline de CI**:
   - Gera uma **nova tag** (`v1.2.4`) e push no Git.
   - Atualiza o **ApplicationSet** no repositório de configuração:
     ```yaml
     targetRevision: v1.2.4  # Modificado no Git
     ```
2. **Argo CD**:
   - Detecta a mudança no ApplicationSet via webhook.
   - Atualiza todos os [[Applications]] **atomicamente**.

---

### 📊 **Comparação de Abordagens**

| Abordagem               | Vantagens                  | Desvantagens              |
| ----------------------- | -------------------------- | ------------------------- |
| **[[Tag\|Tags]] Fixas** | Previsível, fácil rollback | Requer atualização manual |
| **[[Commit]] SHA**      | Imutável                   | Pouco legível             |
| **SemVer Dinâmico**     | Atualizações automáticas   | Risco de inconsistência   |
| **CI/CD Controlada**    | Sincronização atômica      | Complexidade aumentada    |

---

### ✅ **Conclusão**
- **Para produção**: Prefira **tags fixas** ou **commit SHAs** no ApplicationSet.  
- **Evite padrões dinâmicos** (ex.: `v1.*`) a menos que tenha um pipeline de CI robusto para validar as atualizações.  
- **Sincronização atômica** é crítica: considere usar um **repositório intermediário** com as versões travadas.  

Se precisar de um exemplo completo de CI/CD + ApplicationSet, posso elaborar um fluxo passo a passo! 😊