---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
# **O que é um `Application` no Argo CD?**  
Um **`Application`** no Argo CD é um **recurso customizado ([[custom-resources| CRD- Custom Resource Definition)]]** que define a relação entre:  
1. **O código-fonte** ([[Git]], [[helm]], Kustomize, etc.)  
2. **O destino** (cluster [[kubernetes]] e [[namespace]])  
3. **As políticas de sincronização** ([[hooks|automático, manual, hooks]])  

Ele é o **bloco fundamental** do [[introducao-argocd|Argo CD]], atuando como um "contrato" entre seu repositório Git e o cluster Kubernetes.

---

## 🔗 **Como um `Application` se Relaciona com Outros Recursos?**
### 1. **[[deployment]], [[service]], [[configmap]] (Manifests Kubernetes)**  
- O `Application` **não substitui** esses recursos, mas **gerencia seu ciclo de vida**.  
- Exemplo: Se você tem um `Deployment` no Git, o Argo CD:  
  - Monitora o arquivo YAML no repositório.  
  - Aplica as mudanças no cluster quando o Git é atualizado.  

```yaml
# Exemplo: Application apontando para um Deployment no Git
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: https://github.com/meu-repo.git
    path: kubernetes/deployment.yaml  # Arquivo com o Deployment
  destination:
    server: https://kubernetes.default.svc
    namespace: my-namespace
```

### 2. **Helm Charts**  
- O `Application` pode implantar um **Helm Chart diretamente** (sem precisar do `helm install`).  
- Exemplo:  
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
        redis:
          password: "senha-secreta"
  destination:
    server: https://kubernetes.default.svc
    namespace: redis
```

### 3. **Kustomize**  
- Pode referenciar um diretório com `kustomization.yaml`:  
```yaml
source:
  repoURL: https://github.com/meu-repo.git
  path: kustomize/overlays/prod  # Pasta com kustomization.yaml
```

### 4. **Outros Recursos Customizados (CRDs)**  
- Gerencia CRDs como `TraefikIngressRoute`, `CertManager Certificate`, etc., desde que:  
  - Estejam definidos no Git.  
  - O CRD já esteja instalado no cluster.  

---

## 🔄 **Fluxo de Trabalho de um `Application`**  
1. **Definição**: Você cria um recurso `Application` (via YAML ou UI).  
2. **Monitoramento**: O Argo CD observa o repositório Git.  
3. **Sincronização**:  
   - Se `auto-sync: true`, aplica mudanças automaticamente.  
   - Se não, requer aprovação manual.  
4. **Health Check**: Verifica se os recursos implantados estão saudáveis.  

---

## 📌 **Diferença Entre `Application` e Recursos Tradicionais**  
| **Recurso**          | **Application** vs **Deployment/Helm**                                         |     |     |
| -------------------- | ------------------------------------------------------------------------------ | --- | --- |
| **Onde é definido?** | `Application` é um CRD do Argo CD.                                             |     |     |
| **Quem gerencia?**   | Argo CD controla o ciclo de vida.                                              |     |     |
| **Dependências**     | Pode orquestrar múltiplos recursos (ex: um Helm Chart com vários Deployments). |     |     |
| **Estado**           | Sempre reflete o Git (se não houver *drift*).                                  |     |     |

---

## 🛠️ **Exemplo Prático: Aplicação com Helm + Hooks**  
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-complex-app
spec:
  project: default
  source:
    repoURL: https://github.com/meu-repo.git
    path: helm-charts/my-app
    helm:
      valuesFiles:
        - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated: 
      prune: true  # Apaga recursos removidos do Git
      selfHeal: true  # Corrige drift automático
    syncOptions:
      - Validate=true  # Valida esquemas Kubernetes
    hooks:
      - name: pre-deploy-check
        kind: Pod
        apiVersion: v1
        metadata:
          name: pre-check
        spec:
          containers:
            - name: checker
              image: alpine
              command: ["sh", "-c", "echo 'Validando configurações...'"]
          restartPolicy: Never
        hook:
          phase: PreSync
```

---

## 🔥 **Por Que Usar `Application`?**  
1. **Única Fonte da Verdade**: Tudo é rastreado no [[Git]].  
2. **Multi-cluster**: Gerencia apps em vários clusters.  
3. **Auditoria**: Histórico de mudanças via Git log.  
4. **Segurança**: Nada é modificado fora do Git.  

---

## 💡 **Conclusão**  
O `Application` é o **coração do Argo CD**, abstraindo [[deployment]], [[helm-charts]]  e outros recursos em uma entidade gerenciável via [[GitOps]]. Ele:  
- **Padroniza** a implantação.  
- **Automatiza** sincronizações.  
- **Integra-se** com ferramentas existentes (Helm, Kustomize).  

Quer um exemplo de `ApplicationSet` (para gerenciar múltiplas apps)? Posso mostrar! 😊