---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Aqui está um **detalhamento das melhores práticas do [[introducao-argocd|Argo CD]]**, baseado na [documentação oficial](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/) e em experiências de produção, organizado por tópicos-chave:

---

## **1. Estrutura de Repositórios Git**
### ✅ **Práticas Recomendadas**
- **Separação por ambiente**:  
  ```plaintext
  repo/
  ├── base/          # Configurações comuns a todos os ambientes
  ├── overlays/
  │   ├── dev/       # Configurações específicas para dev
  │   ├── staging/   # Configurações para staging
  │   └── prod/      # Configurações para produção
  ```
- **Evitar [[areas/ti/git/Branch]] para ambientes**: Prefira diretórios (ex: `overlays/prod`) em vez de branches (`main`, `prod`).  
- **Kustomize ou [[helm]]**: Use para gerenciar variações entre ambientes.

### ❌ **Anti-padrões**
- Hardcoding de valores sensíveis (use **Sealed Secrets** ou **Vault**).  
- Misturar manifests de múltiplas aplicações no mesmo diretório sem organização.

---

## **2. Gerenciamento de Aplicações**
### ✅ **Práticas**
- **Uma `Application` por microsserviço**:  
  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: payment-service
  spec:
    project: default
    source:
      repoURL: https://github.com/company/repo.git
      path: apps/payment-service/overlays/prod  # Usando Kustomize
    destination:
      server: https://kubernetes.default.svc
      namespace: payments
  ```
- **Sync Policies explícitas**:  
  ```yaml
  syncPolicy:
    automated:
      prune: true      # Remove recursos deletados no Git
      selfHeal: true   # Corrige drift automaticamente
    syncOptions:
      - CreateNamespace=true
  ```

### ❌ **Anti-padrões**
- Usar `auto-sync` em produção sem aprovação manual (prefira **sync semiautomático**).  
- Aplicações com escopo muito amplo (ex: `Application` que gerencia 50 Deployments).

---

## **3. Segurança e [[rbac]]**
### ✅ **Práticas**
- **[[Namespaces]] dedicados**:  
  ```sh
  kubectl create namespace argocd
  kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
  ```
- **RBAC granular**:  
  ```yaml
  # Exemplo de política (argocd-rbac-cm ConfigMap)
  policy.csv: |
    p, role:prod-admin, applications, *, prod/*, allow
    p, role:dev-reader, applications, get, dev/*, allow
  ```
- **Integração com SSO**: Use **Dex** ou **[[Resumo OAUTH 2.0|OAuth2]]** (ex: GitHub, GitLab).

### ❌ **Anti-padrões**
- Usar a conta `admin` do Argo CD para operações diárias.  
- Permitir acesso de escrita a todos os usuários.

---

## **4. Gerenciamento de Secrets**
### ✅ **Práticas**
- **Externalize secrets**:  
  - Use **Sealed Secrets** (Kubernetes-native):  
    ```sh
    kubeseal --format=yaml < secret.yaml > sealed-secret.yaml
    ```
  - Ou **HashiCorp Vault** com **argocd-vault-plugin**.  
- **Evitar secrets no Git**: Sempre use ferramentas de criptografia.

---

## **5. Monitoramento e Saúde**
### ✅ **Práticas**
- **Health Checks customizados**:  
  ```yaml
  # Adicione em seu Deployment
  annotations:
    argocd.argoproj.io/healthcheck: |
      {
        "kubernetes.io/deployment": {
          "check": "availableReplicas",
          "match": ">= 1"
        }
      }
  ```
- **Alertas para drift**:  
  - Integre com **Prometheus** + **Alertmanager**.  
  - Use o **Argo CD Exporter** para métricas.  

---

## **6. Multi-cluster e High Availability**
### ✅ **Práticas**
- **Gerenciamento centralizado**:  
  ```yaml
  # Application para outro cluster
  destination:
    server: https://outro-cluster.example.com
    namespace: apps
  ```
- **HA para Argo CD**:  
  - Escalone o `argocd-application-controller` e `argocd-repo-server`.  
  - Use **Redis HA**.  

---

## **7. Rollbacks e Histórico**
### ✅ **Práticas**
- **Git como fonte de verdade**:  
  - Rollback = `git revert` + sync.  
- **Auditoria**:  
  - Todos os changesets estão no histórico do Git.  

### ❌ **Anti-padrões**
- Rollback via `kubectl` (quebra o GitOps).  

---

## **8. Performance em Larga Escala**
### ✅ **Práticas**
- **ApplicationSets**: Para gerenciar múltiplas aplicações:  
  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: ApplicationSet
  metadata:
    name: frontend-apps
  spec:
    generators:
      - list:
          elements:
            - cluster: dev
              url: https://dev-cluster.example.com
            - cluster: prod
              url: https://prod-cluster.example.com
    template:
      metadata:
        name: '{{cluster}}-frontend'
      spec:
        source:
          repoURL: https://github.com/company/repo.git
          path: frontend/overlays/{{cluster}}
        destination:
          server: '{{url}}'
          namespace: frontend
  ```
- **Cache de repositórios**: Ajuste `argocd-repo-server` para evitar throttling do Git.

---

## **📌 Checklist de Implementação**
1. [ ] Organize repositórios por ambiente (Kustomize/Helm).  
2. [ ] Defina `syncPolicy` clara (auto-sync apenas em dev).  
3. [ ] Configure RBAC e SSO.  
4. [ ] Use Sealed Secrets ou Vault.  
5. [ ] Monitore drift e saúde das apps.  
6. [ ] Documente rollback via Git.  

---

### **🔗 Referências Adicionais**
- [Argo CD Best Practices Oficial](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)  
- [Artigos sobre GitOps](https://www.weave.works/blog/gitops-best-practices)  

Quer um exemplo completo de um repositório estruturado? Posso fornecer um template! 😊