---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **📌 Comportamento do [[introducao-argocd|Argo CD]] quando o `application.yaml` é atualizado**
Quando você declara um [[application|application]] no repositório do microsserviço (junto aos manifests [[kubernetes]]), o Argo CD monitora esse arquivo como qualquer outro recurso [[GitOps]]. Aqui está o que acontece:

1. **Se o `application.yaml` for modificado**:
   - O Argo CD detecta a mudança (via webhook ou polling) e **atualiza o recurso `Application` no cluster** para refletir o novo estado desejado.
   - Isso inclui:
     - Mudanças no `spec.source` (ex: novo [[branch 1]], path ou [[helm]] values).
     - Alterações no `spec.destination` (ex: novo namespace ou cluster).
     - Atualizações em políticas (`syncPolicy`, `automated`, etc.).

2. **Se o `Application` CRD for atualizado**:
   - O [[custom-resources|CRD]] (`Application`) é um recurso customizado do Argo CD. Se a definição do CRD mudar (ex: nova versão do Argo CD adiciona campos), o Argo CD **não altera automaticamente os `application.yaml` nos repositórios [[Git]]**.
   - Cabe a você atualizar os `application.yaml` manualmente ou via ferramentas como `kubectl apply --server-side`.

---

### **🔍 Exemplo Prático**
Suponha que você tenha este `application.yaml` no repositório do microsserviço:
```yaml
# repo-microservice-A/manifests/application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: microservice-A
spec:
  project: default
  source:
    repoURL: https://github.com/sua-org/repo-microservice-A.git
    path: manifests/
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: microservice-A
  syncPolicy:
    automated: {}
```

#### **Cenário 1: Você atualiza o `targetRevision` para `feature-branch`**
- O Argo CD **alterará o `Application` no cluster** para apontar para o novo branch.
- Na próxima sincronização, ele buscará os manifests do `feature-branch`.

#### **Cenário 2: Você adiciona um novo campo (ex: `ignoreDifferences`)**
- Se o campo for válido na versão do CRD do Argo CD, o recurso no cluster será atualizado.
- Se o campo não existir no CRD (ex: versão desatualizada), o Argo CD **ignorará o campo** (ou falhará, dependendo da configuração).

#### **Cenário 3: O CRD do Argo CD é atualizado (ex: novo campo `retryLimit`)**
- Seu `application.yaml` **não será modificado automaticamente**. Você precisa adicionar o campo manualmente.

---

### **⚠️ Pontos de Atenção**
1. **[[drift|Drift]] Detection**:
   - Se alguém modificar o `Application` diretamente no cluster (via `kubectl edit`), o Argo CD **reverterá as mudanças** na próxima sincronização (a menos que `spec.syncPolicy.allowEmpty` seja usado).

2. **Campos Imutáveis**:
   - Alguns campos (ex: `metadata.name`) não podem ser alterados sem recriar o `Application`.

3. **Validação do CRD**:
   - Se você cometer um erro de sintaxe ou usar um campo inválido, o Argo CD **não aplicará** as mudanças até que o erro seja corrigido.

---

### **🛠 Como Garantir Controle Total**
Se precisar de atualizações complexas (ex: migrar todos `Applications` para um novo formato), use:

#### **1. `kubectl apply --server-side`**
```sh
kubectl apply -f repo-microservice-A/manifests/application.yaml --server-side --force-conflicts
```
(Útil para atualizações massivas.)

#### **2. Ferramentas como `yq` ou `kustomize`**
```sh
# Atualiza todos application.yaml em um repositório
yq eval '.spec.syncPolicy.automated.prune = true' -i manifests/application.yaml
```

#### **3. Scripts de Migração**
Exemplo (Python + `pyyaml`):
```python
import yaml

with open('manifests/application.yaml', 'r') as f:
    app = yaml.safe_load(f)

app['spec']['syncPolicy'] = {'automated': {'prune': True, 'selfHeal': True}}

with open('manifests/application.yaml', 'w') as f:
    yaml.dump(app, f)
```

---

### **📌 Recomendação Final**
- **Mantenha o `application.yaml` versionado no Git** para rastreabilidade.
- **Documente as mudanças no CRD** quando atualizar o Argo CD.
- **Use um linter** (ex: `argocd app validate`) para evitar erros.

Se precisar de um exemplo de **fluxo de migração seguro**, posso elaborar um passo a passo! 😊