---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
# **Entendendo o ApplicationSet no Argo CD**  

O **ApplicationSet** é um recurso do [[introducao-argocd|Argo CD]] que permite **gerar múltiplos Applications dinamicamente** a partir de fontes como repositórios [[Git]], clusters [[kubernetes]] ou listas personalizadas. Ele elimina a necessidade de criar cada `Application` manualmente, tornando o gerenciamento de múltiplos microsserviços, ambientes ou clusters muito mais eficiente.

---

## **📌 Por que usar o ApplicationSet?**
1. **Evita repetição**: Gera automaticamente [[application|Applications]] com base em templates.  
2. **Escalabilidade**: Útil para ambientes com **muitos microsserviços, [[namespace|namespaces]] ou clusters**.  
3. **Flexibilidade**: Pode ser alimentado por **diferentes fontes de dados** (Git, Cluster, [[S3]], etc.).  
4. **[[GitOps]] puro**: Mantém tudo declarativo e versionado no Git.  

---

## **🔧 Como o ApplicationSet Funciona?**
O ApplicationSet usa **generators** (geradores) para criar `Applications` dinamicamente. Os principais tipos são:

| **Tipo de Generator** | **Descrição**                                                            | **Exemplo de Uso**                    |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| **Git Generator**     | Gera Applications com base em arquivos/diretórios em um repositório Git. | Microsserviços em pastas diferentes.  |
| **Cluster Generator** | Gera Applications para múltiplos clusters Kubernetes.                    | Deploy em `dev`, `staging` e `prod`.  |
| **List Generator**    | Gera Applications a partir de uma lista estática.                        | Ambientes fixos (ex: `east`, `west`). |
| **Matrix Generator**  | Combina múltiplos generators (Git + Cluster).                            | Microsserviços em múltiplos clusters. |

---

## **🚀 Exemplo Prático: Git Generator**
Suponha que você tenha um repositório com vários microsserviços, cada um em uma pasta:

```
repo-manifests/
├── microservice-A/
│   ├── deployment.yaml
│   └── service.yaml
├── microservice-B/
│   ├── deployment.yaml
│   └── service.yaml
└── microservice-C/
    ├── deployment.yaml
    └── service.yaml
```

### **1. Criando um ApplicationSet para esses microsserviços**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: microservices
  namespace: argocd
spec:
  generators:
    - git:
        repoURL: https://github.com/sua-org/repo-manifests.git
        revision: HEAD
        directories:
          - path: "*/"  # Procura todas as pastas no repositório
  template:
    metadata:
      name: '{{path.basename}}'  # Nome do Application = nome da pasta
    spec:
      project: default
      source:
        repoURL: https://github.com/sua-org/repo-manifests.git
        targetRevision: HEAD
        path: '{{path}}'  # Caminho relativo (ex: "microservice-A/")
      destination:
        server: https://kubernetes.default.svc
        namespace: default
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

### **O que acontece?**
1. O **Git Generator** escaneia o repositório e encontra `microservice-A/`, `microservice-B/`, `microservice-C/`.
2. O **Template** gera um [[application|application]] para cada pasta:
   - `microservice-A` → Application apontando para `microservice-A/`.
   - `microservice-B` → Application apontando para `microservice-B/`.
   - `microservice-C` → Application apontando para `microservice-C/`.

✅ **Resultado**: Sem precisar declarar cada `Application` manualmente!

---

## **🔄 Outros Exemplos Úteis**
### **1. Cluster Generator (Multi-cluster)**
```yaml
generators:
  - clusters:
      selector:
        matchLabels:
          argocd.argoproj.io/secret-type: cluster
template:
  spec:
    destination:
      server: '{{server}}'
      namespace: default
```
- Gera `Applications` para cada cluster registrado no Argo CD.

### **2. List Generator (Lista Fixa)**
```yaml
generators:
  - list:
      elements:
        - cluster: dev
          url: https://dev-cluster.example.com
        - cluster: prod
          url: https://prod-cluster.example.com
template:
  spec:
    destination:
      server: '{{url}}'
      namespace: '{{cluster}}'
```
- Útil para deploys em ambientes pré-definidos.

### **3. Matrix Generator ([[Git]] + Cluster)**
```yaml
generators:
  - git:
      repoURL: https://github.com/sua-org/repo-manifests.git
      revision: HEAD
      directories:
        - path: "*/"
  - clusters:
      selector:
        matchLabels:
          env: prod
template:
  spec:
    source:
      path: '{{path}}'
    destination:
      server: '{{server}}'
      namespace: '{{path.basename}}'
```
- Combina microsserviços em pastas Git + clusters diferentes.

---

## **⚙️ Configurações Avançadas**
### **Filtros (Exclude/Include)**
```yaml
directories:
  - path: "*"
    exclude: true  # Ignora todas as pastas, exceto as listadas abaixo
  - path: "microservice-A"
  - path: "microservice-B"
```

### **Overrides com Patch (Kustomize)**
```yaml
template:
  spec:
    source:
      kustomize:
        images:
          - name: nginx
            newTag: latest
```

### **Sync Policies Customizadas**
```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
  syncOptions:
    - CreateNamespace=true
```

---

## **📌 Quando NÃO Usar ApplicationSet?**
- Se você tem **apenas 1-2 Applications**, pode ser overkill.  
- Se os `Applications` precisam de configurações **muito específicas** (não padronizáveis).  

---

## **✅ Conclusão**
O **ApplicationSet** é ideal para:
- **Gerenciar muitos microsserviços** de forma automatizada.  
- **Multi-cluster [[deployment|deployments]]** (ex: dev, staging, prod).  
- **Evitar repetição** de configurações manuais.  

Se precisar de um exemplo **passo a passo** ou ajuda para debugar um caso específico, posso ajudar! 😊