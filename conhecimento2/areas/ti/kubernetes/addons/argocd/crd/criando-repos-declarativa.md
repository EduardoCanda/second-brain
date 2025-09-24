---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Para criar configurações **declarativas** de repositórios e templates de secrets para usuários específicos no [[introducao-argocd|Argo CD]], você pode usar uma combinação de **[[kubernetes]] [[secret|Secrets]]**, **[[helm-charts]]** e **Argo CD [[applicationset|ApplicationSets]]** ou **[[custom-resources]]**.  

Aqui está uma abordagem robusta e automatizada:

---

## **📌 1. Estrutura Recomendada**  
Organize seu projeto assim:  
```
argocd-config/  
├── apps/                  # Aplicações gerenciadas pelo Argo CD  
├── repositories/          # Configurações de repositórios  
│   ├── repo-helm.yaml     # Helm repo  
│   ├── repo-git-ssh.yaml  # Git via SSH  
│   └── repo-git-https.yaml # Git via HTTPS (usuário/senha)  
├── secrets/               # Templates de Secrets (SealedSecret/ExternalSecret)  
│   ├── repo-credentials.yaml  
│   └── user-credentials.yaml  
└── argocd-config-helm/    # Helm Chart para configurar o Argo CD  
```

---

## **📌 2. Configuração Declarativa de Repositórios**  
### **Opção A: Usando Secrets + [[helm]] (Referência Existente)**  
Crie um **Secret** para cada repositório e referencie-o no Helm:  

#### **a) Secret para Repositório Git (SSH)**  
```yaml
# repositories/repo-git-ssh.yaml  
apiVersion: v1  
kind: Secret  
metadata:  
  name: argocd-repo-github-ssh  
  namespace: argocd  
  labels:  
    argocd.argoproj.io/secret-type: repository  
type: Opaque  
stringData:  
  url: git@github.com:meu-org/meu-repo.git  
  sshPrivateKey: |  
    -----BEGIN RSA PRIVATE KEY-----  
    [SUA_CHAVE_SSH_PRIVADA]  
    -----END RSA PRIVATE KEY-----  
```

#### **b) Secret para Repositório [[Git]] ([[protocolo-https|HTTPS]] + Token)**  
```yaml
# repositories/repo-git-https.yaml  
apiVersion: v1  
kind: Secret  
metadata:  
  name: argocd-repo-github-https  
  namespace: argocd  
  labels:  
    argocd.argoproj.io/secret-type: repository  
type: Opaque  
stringData:  
  url: https://github.com/meu-org/meu-repo.git  
  username: meu-usuario  
  password: meu-token-github  
```

#### **c) Helm Chart (Referenciando os Secrets)**  
```yaml
# argocd-config-helm/templates/argocd-repos.yaml  
apiVersion: argoproj.io/v1alpha1  
kind: Application  
metadata:  
  name: argocd-repos  
spec:  
  destination:  
    namespace: argocd  
    server: https://kubernetes.default.svc  
  source:  
    repoURL: https://github.com/meu-org/argocd-config.git  
    targetRevision: main  
    path: repositories  
    directory:  
      recurse: true  
```

---

### **Opção B: Usando ApplicationSet (Dinâmico)**  
Se você quer que o Argo CD **gerencie automaticamente** os repositórios baseados em um template:  

```yaml
# argocd-config-helm/templates/applicationset-repos.yaml  
apiVersion: argoproj.io/v1alpha1  
kind: ApplicationSet  
metadata:  
  name: argocd-repositories  
spec:  
  generators:  
    - git:  
        repoURL: https://github.com/meu-org/argocd-config.git  
        revision: main  
        files:  
          - path: "repositories/**/*.yaml"  
  template:  
    metadata:  
      name: '{{path.basename}}'  
    spec:  
      project: default  
      source:  
        repoURL: '{{repo.url}}'  
        targetRevision: main  
      destination:  
        server: https://kubernetes.default.svc  
        namespace: argocd  
```

---

## **📌 3. Templates de Secrets para Usuários**  
Se você precisa criar **Secrets específicos para usuários** (ex: credenciais de registry, tokens):  

### **a) Secret para Usuário (Docker Registry)**  
```yaml
# secrets/user-docker-config.yaml  
apiVersion: v1  
kind: Secret  
metadata:  
  name: docker-creds-user1  
  namespace: argocd  
type: kubernetes.io/dockerconfigjson  
stringData:  
  .dockerconfigjson: |  
    {  
      "auths": {  
        "https://registry.example.com": {  
          "username": "user1",  
          "password": "senha-segura",  
          "auth": "dXNlcjE6c2VuaGEtc2VndXJh"  
        }  
      }  
    }  
```

### **b) Helm Chart para Associar Secrets ao Usuário**  
```yaml
# argocd-config-helm/templates/user-secrets.yaml  
apiVersion: argoproj.io/v1alpha1  
kind: AppProject  
metadata:  
  name: user-projects  
spec:  
  roles:  
    - name: user1  
      policies:  
        - p, proj:user1:read, applications, get, user-projects/*, allow  
  destinations:  
    - namespace: user1-ns  
  sourceRepos:  
    - https://github.com/meu-org/user1-repo.git  
```

---

## **📌 4. Fluxo de Deploy Automatizado**  
1. **Secrets são criados via CI/CD ou ferramentas externas** (Vault, SealedSecrets).  
2. **Helm Chart aplica as configurações no Argo CD**.  
3. **Argo CD gerencia os repositórios e aplicações de forma declarativa**.  

---

### **🔹 Conclusão**  
| Objetivo | Método Recomendado |  
|----------|-------------------|  
| **Repositórios Git** | Secrets + Helm ou ApplicationSet |  
| **Templates de Secrets** | SealedSecrets / ExternalSecrets |  
| **Usuários Específicos** | AppProject + RBAC |  

Isso garante:  
✅ **Declaratividade** (tudo no Git).  
✅ **Segurança** (Secrets não expostos).  
✅ **Automatização** (CI/CD + Argo CD).  