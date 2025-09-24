---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **Estratégia para Configurações do [[linkerd]] com [[introducao-argocd|Argo CD]]: Monorepo vs. Múltiplos Repositórios**

A escolha entre **um único repositório** ([[Monorepo]]) ou **múltiplos repositórios** depende da complexidade do seu ambiente e das necessidades de governança. Aqui está uma análise detalhada para o seu caso específico com o **Linkerd**:

---

## **📌 Opção 1: Monorepo (Recomendado para a Maioria dos Casos)**
### **Estrutura Proposta**
```plaintext
repo-linkerd-config/
├── base/                      # Configurações comuns a todos os ambientes
│   ├── control-plane/         # Instalação do Linkerd (Helm/Kustomize)
│   │   ├── Chart.yaml         # Helm chart do Linkerd
│   │   ├── values.yaml        # Valores padrão
│   │   └── crds/              # Custom Resource Definitions (CRDs)
│   └── manifests/             # Recursos adicionais (ex: ServiceProfiles)
│       ├── service-profile.yaml
│       └── traffic-split.yaml
│
├── overlays/                  # Configurações por ambiente
│   ├── dev/
│   │   └── values-dev.yaml    # Overrides para dev (ex: menos réplicas)
│   └── prod/
│       └── values-prod.yaml   # Overrides para produção
│
└── argocd/                    # Applications do Argo CD
    ├── linkerd-control-plane.yaml
    └── linkerd-resources.yaml
```

### **Vantagens**
1. **Simplicidade**: Tudo relacionado ao Linkerd em um único lugar.  
2. **Sincronização atômica**: Mudanças no control plane e recursos são implantadas juntas.  
3. **Facilidade de rollback**: Todo o histórico está em um único repositório.  
4. **Melhor para pequenas/médias equipes**.  

### **Quando Usar?**
- Se você tem **um ou poucos clusters**.  
- Se as configurações do Linkerd são gerenciadas por uma única equipe.  

---

## **📌 Opção 2: Múltiplos Repositórios (Para Casos Complexos)**
### **Estrutura Proposta**
```plaintext
# Repositório 1: Configurações do Linkerd Control Plane
repo-linkerd-control-plane/
├── Chart.yaml          # Helm chart do Linkerd
├── values.yaml         # Valores base
└── environments/       # Overrides por cluster/ambiente
    ├── cluster-a.yaml
    └── cluster-b.yaml

# Repositório 2: Recursos do Linkerd (ServiceProfiles, etc.)
repo-linkerd-resources/
├── service-profiles/
│   └── app1.yaml
└── traffic-splits/
    └── canary.yaml

# Repositório 3: Configurações do Argo CD
repo-argocd-config/
└── applications/
    ├── linkerd-control-plane.yaml
    └── linkerd-resources.yaml
```

### **Vantagens**
1. **Separação de responsabilidades**:  
   - Equipe de plataforma gerencia o control plane.  
   - Equipes de aplicação gerencia `ServiceProfiles`.  
2. **Escalabilidade**: Ideal para **multi-cluster** ou muitas equipes.  
3. **Controle de acesso granular**: Permissões por repositório.  

### **Quando Usar?**
- Se você tem **múltiplos clusters** (ex: dev, staging, prod).  
- Se diferentes equipes precisam gerenciar partes do Linkerd.  

---

## **🔍 Comparação Detalhada**
| **Critério**               | **Monorepo**                          | **Múltiplos Repositórios**            |
|----------------------------|---------------------------------------|----------------------------------------|
| **Simplicidade**           | ✅ Mais fácil de gerenciar           | ⚠️ Mais complexo                      |
| **Governança**             | ⚠️ Acesso compartilhado             | ✅ Controle granular por equipe        |
| **Rollback**               | ✅ Único commit para tudo            | ❌ Rollback precisa ser coordenado     |
| **Multi-cluster**          | ❌ Menos flexível                    | ✅ Ideal                              |

---

## **🎯 Recomendação Final**
### **Use Monorepo se:**
- Sua infraestrutura é pequena/média.  
- Você quer **simplicidade** e **visibilidade total** das configurações.  

### **Use Múltiplos Repositórios se:**
- Você tem **múltiplos clusters/equipes**.  
- Precisa de **controle de acesso refinado** (ex: equipes diferentes gerenciam `ServiceProfiles`).  

---

## **🛠️ Implementação Prática (Exemplo com Monorepo)**
### **1. Estrutura do `Application` do Argo CD**
#### **`argocd/linkerd-control-plane.yaml`**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: linkerd-control-plane
spec:
  source:
    repoURL: https://github.com/seu-org/repo-linkerd-config.git
    path: base/control-plane
    helm:
      valueFiles:
        - ../../overlays/prod/values-prod.yaml  # Override para produção
  destination:
    server: https://kubernetes.default.svc
    namespace: linkerd
```

#### **`argocd/linkerd-resources.yaml`**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: linkerd-resources
spec:
  source:
    repoURL: https://github.com/seu-org/repo-linkerd-config.git
    path: base/manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: linkerd
  syncPolicy:
    automated:
      prune: true
```

### **2. Fluxo de Atualização**
1. **Atualize** os arquivos no `repo-linkerd-config`.  
2. **Argo CD sincroniza** automaticamente (se `auto-sync` estiver ativado).  

---

## **💡 Dica Bônus**
- **Para multi-cluster**, use `ApplicationSet` no repositório `repo-argocd-config`:  
  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: ApplicationSet
  metadata:
    name: linkerd-clusters
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
        name: 'linkerd-{{cluster}}'
      spec:
        source:
          repoURL: https://github.com/seu-org/repo-linkerd-config.git
          path: base/control-plane
          helm:
            valueFiles:
              - ../../overlays/{{cluster}}/values.yaml
        destination:
          server: '{{url}}'
          namespace: linkerd
  ```

---

### **✅ Resumo**
- **Monorepo**: Melhor para **simplicidade** e ambientes menores.  
- **Múltiplos repositórios**: Melhor para **escalabilidade** e multi-cluster.  

Se precisar de ajuda para estruturar seu repositório, posso enviar um template pronto! 😊