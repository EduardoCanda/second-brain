---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Sim, os **[[custom-resources|CRDs]] (Custom Resource Definitions)** do [[introducao-argocd|Argo CD]], incluindo [[application|application]] e [[applicationset]], **devem ser instalados no cluster**, mas **não estão vinculados a um [[namespace]] específico**, pois são recursos de escopo global (cluster-scoped).  

Já os **recursos instanciados desses CRDs** (como um `Application` ou `ApplicationSet` específico) **podem ser criados no namespace do Argo CD** (`argocd`) ou em outros namespaces, dependendo da configuração.  

---

### **📌 Resumo: Onde Criar Cada Recurso?**
| Recurso                                    | Escopo                  | Namespace Recomendado | Observação                                                                              |
| ------------------------------------------ | ----------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| **CRDs** (`Application`, `ApplicationSet`) | Cluster-scoped (global) | -                     | Instalados uma vez no cluster (geralmente pelo [[helm]] ou `kubectl apply`).            |
| **Recursos `Application`**                 | Namespace-scoped        | `argocd` (ou outro)   | Se criados fora do `argocd`, o Argo CD precisa ter permissões [[rbac]] para acessá-los. |
| **Recursos `ApplicationSet`**              | Namespace-scoped        | `argocd` (padrão)     | Funcionam melhor no mesmo namespace do Argo CD.                                         |

---

### **1. CRDs (Cluster-scoped)**
- São instalados **uma vez no cluster** (não pertencem a um namespace).  
- Exemplo de instalação via Helm:  
  ```sh
  helm install argocd argo/argo-cd --namespace argocd --create-namespace
  ```
  (O Helm já cuida da instalação dos CRDs.)

- Se precisar instalá-los manualmente:  
  ```sh
  kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/crds/application-crd.yaml
  kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/crds/applicationset-crd.yaml
  ```

---

### **2. Recursos `Application` e `ApplicationSet` (Namespace-scoped)**
- Podem ser criados no **namespace `argocd`** (recomendado) ou em outros namespaces.  
- Se criados em outros namespaces, o Argo CD precisa de:  
  - **Permissões RBAC** para gerenciá-los (ex: via `ClusterRole`).  
  - A flag `--applications-namespace` no `argocd-server` (se estiverem em namespaces diferentes).  

#### **Exemplo: `Application` no namespace `argocd` (recomendado)**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd  # Namespace do Argo CD
spec:
  project: default
  source:
    repoURL: https://github.com/meu-repo.git
    ...
```

#### **Exemplo: `ApplicationSet` no namespace `argocd` (padrão)**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: my-appset
  namespace: argocd  # Namespace do Argo CD
spec:
  generators:
    ...
```

---

### **3. Caso Específico: `Applications` em Outros Namespaces**
Se você quiser gerenciar `Applications` em namespaces como `default` ou `dev`:  

#### **Passo 1: Garanta as permissões RBAC**
Atualize o `argocd-manager` ClusterRole (ou crie um novo):  
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: argocd-manager
rules:
- apiGroups: ["argoproj.io"]
  resources: ["applications"]
  verbs: ["*"]
```

#### **Passo 2: Aplique o `Application` no namespace desejado**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: default  # Namespace customizado
spec:
  ...
```

#### **Passo 3 (Opcional): Configure o Argo CD para monitorar múltiplos namespaces**
Adicione ao `argocd-server` (no Helm values ou Deployment):  
```yaml
server:
  extraArgs:
    - --applications-namespace=default
    - --applications-namespace=dev
```

---

### **⚠️ Problemas Comuns**
1. **Argo CD não enxerga `Applications` em outros namespaces**:  
   - Verifique RBAC e a flag `--applications-namespace`.  
2. **Erros de permissão ao criar `Applications`**:  
   - O ServiceAccount do Argo CD precisa de permissões para criar/ler recursos nos namespaces alvo.  

---

### **✅ Recomendação Final**
- **Para simplicidade**: Crie `Applications` e `ApplicationSets` no namespace `argocd`.  
- **Para multi-tenant**: Use namespaces separados com RBAC adequado.  
- **CRDs**: Sempre cluster-scoped (não requerem namespace).  

Se precisar de um exemplo completo de RBAC ou configuração customizada, posso elaborar! 😊