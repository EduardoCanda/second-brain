---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **Argo CD e Helm: Renderização vs. Gerenciamento**  

O **[[introducao-argocd|Argo CD]]** usa o [[helm]] **principalmente como um renderizador de templates**, mas não executa comandos tradicionais do Helm (como `helm upgrade` ou `helm rollback`) após o *sync*. Vamos entender as implicações e alternativas:

---

## 🔹 **1. Helm como Renderizador no Argo CD**  
Quando você define um `Application` do Argo CD com um Helm Chart, o fluxo é:  
1. **O Repo Server do Argo CD** baixa o Chart e renderiza os manifests usando `helm template`.  
2. Os recursos resultantes são aplicados no cluster via **[[kubernetes]] API** (como YAML puro, sem rastreamento do Helm).  
3. **O Argo CD gerencia esses recursos diretamente**, ignorando o Helm Client (`helm` CLI).  

### 📌 **Consequências:**  
- **Não há `helm list` ou `helm history`**: O Argo CD não mantém um "release" do Helm no cluster.  
- **Sem operações Helm nativas**: Comandos como `helm rollback` ou `helm upgrade --force` não funcionam.  
- **O estado é controlado pelo Git**: A única fonte da verdade é o repositório (não o Helm).  

---

## 🔹 **2. Por Que o Argo CD Não Usa o Helm Client?**  
O Argo CD segue o **princípio do [[GitOps]]**:  
- **Cluster deve espelhar o Git**: O Helm Client mantém estado no cluster (em Secrets, como `sh.helm.release.v1.*`), o que conflita com a filosofia declarativa do GitOps.  
- **Independência de ferramentas**: O Argo CD suporta Kustomize, Ksonnet, etc., e não quer depender do Helm Client.  

---

## 🔹 **3. Como Contornar Limitações (Se Precisa do Helm Client)**  

### ✅ **Opção 1: Usar `helm upgrade` Manualmente (Fora do Argo CD)**  
- Se você **precisa** de comandos do Helm (ex: `helm rollback`), pode executá-los via CLI, mas:  
  - **Perde os benefícios do GitOps** (mudanças fora do [[Git]]).  
  - O Argo CD **sobrescreverá** as alterações na próxima sincronização (a menos que use `ignoreDifferences`).  

### ✅ **Opção 2: Helm + Argo CD com `helm.sh/resource-policy: keep`**  
- Adicione uma anotação para evitar que o Argo CD gerence recursos do Helm:  
  ```yaml
  metadata:
    annotations:
      helm.sh/resource-policy: keep  # Impede que o Argo CD exclua/atualize o recurso
  ```  
- **Uso**: Útil para recursos como [[secret|Secrets]] de release do Helm.  

### ✅ **Opção 3: Usar o Plugin `argocd-vault-plugin` para Secrets Dinâmicos**  
- Se o problema é gerar valores dinâmicos (ex: Secrets), use plugins externos.  

### ✅ **Opção 4: Helm Hooks para Tarefas Específicas**  
- Defina **hooks** no Chart para executar Jobs (ex: migrações) durante o sync:  
  ```yaml
  annotations:
    argocd.argoproj.io/hook: PostSync  # Executa após o deploy
  ```  

---

## 🔹 **4. Quando Usar Helm Client vs. Argo CD?**  
| **Caso de Uso**               | **Helm Client** | **Argo CD + Helm** |  
|-------------------------------|----------------|--------------------|  
| Rollback rápido               | ✅ Sim (`helm rollback`) | ❌ Não (use Git revert) |  
| Valores dinâmicos (ex: Secrets)| ✅ Sim (`--set`) | ⚠️ Limitado (use plugins) |  
| Histórico de releases         | ✅ Sim (`helm history`) | ❌ Não |  
| GitOps (rastreabilidade)      | ❌ Não | ✅ Sim |  

---

## 🔹 **5. Exemplo: Deploy com Helm no Argo CD**  
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-helm-app
spec:
  source:
    repoURL: https://charts.bitnami.com/bitnami
    chart: redis
    targetRevision: 16.0.0
    helm:
      values: |
        auth:
          password: "senha-segura"
  destination:
    server: https://kubernetes.default.svc
    namespace: redis
```

---

## 📌 **Conclusão**  
- O Argo CD **não usa o Helm Client** – apenas renderiza Charts como YAML.  
- Para operações avançadas do Helm, você precisará:  
  - **Aceitar as limitações do [[GitOps]]** (e gerenciar tudo via Git).  
  - **Usar workarounds** (hooks, plugins ou comandos manuais).  

Se você **depende muito de `helm upgrade` ou `rollback`**, considere se o GitOps puro é a melhor abordagem para seu caso. Caso contrário, o Argo CD + Helm é uma combinação poderosa para deploys declarativos.  