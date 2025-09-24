---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Sim, esse é um problema comum quando se usa **[[helm]] + [[introducao-argocd|Argo CD]]** para gerenciar Secrets de repositórios. A sincronização (sync) pode substituir os Secrets, especialmente se eles não estiverem versionados ou se o Helm [[helm-charts|Chart]] não estiver lidando corretamente com os dados sensíveis.  

---

### **📌 Por que isso acontece?**  
1. **[[secret|Secrets]] não estão no [[Git]]** (ou estão em formato não gerenciável).  
2. **O Helm sobrescreve os Secrets** durante o `helm upgrade` ou `argocd sync`.  
3. **O Argo CD não mantém estado** dos Secrets criados manualmente.  

---

### **✅ Solução Recomendada: Separar a Geração de Secrets**  

#### **1. Usar um Fluxo em 2 Etapas (Melhor Prática)**  
| Passo | O que faz? | Ferramenta | Armazenamento |
|-------|------------|------------|---------------|
| **1. Geração dos Secrets** | Cria os Secrets **antes** do Argo CD | `kubectl`, `SealedSecret`, `Vault` | Fora do Helm (ex: Secrets Manager) |  
| **2. Deploy do Helm Chart** | Aplica configurações que **referenciam** os Secrets existentes | Helm + Argo CD | Git (IaC) |  

#### **Exemplo Prático:**  
**a) Crie os Secrets manualmente (ou via CI/CD) ANTES de instalar o Argo CD:**  
```bash
# Exemplo: Secret para repositório SSH
kubectl create secret generic argocd-repo-github -n argocd \
  --from-file=sshPrivateKey=~/.ssh/id_rsa \
  --type=Opaque \
  --dry-run=client -o yaml | kubectl apply -f -
```

**b) No Helm Chart, referencie o Secret existente (sem recriá-lo):**  
```yaml
# values.yaml
repositories:
  - name: github-repo
    url: git@github.com:user/repo.git
    secretRef:
      name: argocd-repo-github  # Já existe no cluster
```

**c) Template do Helm (apenas referência, não gera o Secret):**  
```yaml
# templates/argocd-repo.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: git@github.com:user/repo.git
    targetRevision: main
    sshPrivateKeySecret:
      name: argocd-repo-github  # Secret pré-existente
      key: sshPrivateKey
```

---

### **2. Alternativa: Usar Sealed Secrets (Se for obrigatório versionar no Git)**  
Se você **precisa** versionar os Secrets no Git:  
1. **Instale o Sealed Secrets no cluster:**  
   ```bash
   kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.22.0/controller.yaml
   ```
2. **Crie um SealedSecret (encriptado):**  
   ```bash
   kubectl create secret generic argocd-repo-github -n argocd --dry-run=client --from-file=sshPrivateKey=id_rsa -o yaml | kubeseal -o yaml > sealed-secret.yaml
   ```
3. **Adicione o `sealed-secret.yaml` ao Helm Chart.**  
   → O operador do Sealed Secrets **decrypta** automaticamente no cluster.  

---

### **3. Usar External Secrets Operator (AWS Secrets Manager / HashiCorp Vault)**  
Para ambientes profissionais, onde os Secrets são centralizados:  
1. **Configure o External Secrets Operator:**  
   ```bash
   helm install external-secrets external-secrets/external-secrets -n external-secrets
   ```
2. **Crie um `ExternalSecret` que referencia seu repositório:**  
   ```yaml
   # templates/external-secret.yaml
   apiVersion: external-secrets.io/v1beta1
   kind: ExternalSecret
   metadata:
     name: argocd-repo-github
   spec:
     refreshInterval: 1h
     secretStoreRef:
       name: vault-backend
       kind: ClusterSecretStore
     target:
       name: argocd-repo-github
     data:
     - secretKey: sshPrivateKey
       remoteRef:
         key: /argocd/repos/github
   ```

---

### **📌 Conclusão: Qual abordagem escolher?**  
| Cenário                                               | Solução                                                            |     |
| ----------------------------------------------------- | ------------------------------------------------------------------ | --- |
| **Secrets sensíveis ([[protocolo-ssh\|SSH]]/Tokens)** | ✅ **Secret pré-criado** (via CI/CD ou manual) + Helm só referencia |     |
| **Versionar Secrets no Git**                          | ✅ **Sealed Secrets**                                               |     |
| **Ambiente corporativo ([[AWS]]/GCP/Vault)**          | ✅ **External Secrets Operator**                                    |     |

Se você **não quer depender de processos manuais**, o **Sealed Secrets** é a melhor opção, pois mantém os Secrets versionados **sem expor dados sensíveis**.  
