---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Você está se referindo ao **mecanismo de rastreamento de recursos (Resource Tracking)** do [[introducao-argocd|Argo CD]], especificamente como ele associa recursos no cluster [[Kubernetes]] aos manifestos no Git, especialmente em cenários onde o recurso não foi criado diretamente pelo Argo CD (como no caso de `kubectl apply` externo). Vou explicar detalhadamente com base na [documentação oficial](https://argo-cd.readthedocs.io/en/stable/user-guide/resource_tracking/).

---

### **1. Problema que o Resource Tracking Resolve**
Quando um recurso é criado/modificado fora do Argo CD (ex.: via `kubectl`, operadores, ou outros CI/CD tools), o Argo CD precisa:
- Identificar se esse recurso **deve ser gerenciado** por ele.
- Evitar conflitos entre mudanças manuais e o estado desejado no Git.

---

### **2. Como o Argo CD Rastreia Recursos**
O Argo CD usa **anotações (annotations)** e **rótulos (labels)** para vincular recursos no cluster aos manifestos no Git. As principais são:

#### **Anotações Padrão (Managed Resources)**
Recursos implantados pelo Argo CD recebem:
```yaml
annotations:
  argocd.argoproj.io/instance: <app-name>
  argocd.argoproj.io/sync-options: Replace=true (opcional)
```
Isso indica que o recurso é gerenciado pelo Argo CD.

#### **Rastreamento de Recursos Não Gerenciados (Non-ArgoCD Resources)**
Se um recurso foi criado fora do Argo CD (ex.: `kubectl apply`), o Argo CD usa um destes métodos para associá-lo a uma aplicação:

1. **`app.kubernetes.io/instance` Label**  
   - Se um recurso no cluster tiver a label `app.kubernetes.io/instance=<app-name>`, o Argo CD o associará à aplicação `app-name`.
   - Exemplo:
     ```yaml
     labels:
       app.kubernetes.io/instance: my-app
     ```

2. **Annotation `argocd.argoproj.io/tracking-id`**  
   - Usado para recursos que **não foram criados pelo Argo CD**, mas devem ser rastreados por ele.
   - O valor é um UUID que referencia a aplicação no Argo CD.

---

### **3. Cenários de Uso**
#### **Caso 1: Recurso Criado pelo Argo CD**
- O recurso tem as anotações padrão do Argo CD.
- Se modificado fora do Argo CD (ex.: `kubectl edit`), o Argo CD detecta o *drift* e o marca como **OutOfSync**.

#### **Caso 2: Recurso Criado Externamente (mas deve ser gerenciado)**
- Adicione a label `app.kubernetes.io/instance: <app-name>` ao recurso.
- O Argo CD passará a rastreá-lo e sincronizá-lo com o Git.

#### **Caso 3: Recurso Existente (não gerenciado pelo Argo CD)**
- Se o recurso **não** tiver labels/annotations do Argo CD, ele será ignorado (a menos que use `allowEmpty: false`).

---

### **4. Regras de Rastreamento**
- **Prioridade**:  
  O Argo CD verifica nesta ordem para vincular um recurso a uma aplicação:
  1. Anotação `argocd.argoproj.io/tracking-id`.
  2. Label `app.kubernetes.io/instance`.
  3. Nome do recurso + namespace (caso padrão).

- **Conflitos**:  
  Se dois recursos diferentes no Git corresponderem ao mesmo recurso no cluster (ex.: mesmo nome/namespace), o Argo CD sinalizará um conflito.

---

### **5. Exemplo Prático**
Suponha que você tenha um `Deployment` criado manualmente:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: default
  labels:
    app.kubernetes.io/instance: my-app  # <- Rastreamento pelo Argo CD
spec:
  replicas: 1
  template:
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
```
Se a aplicação `my-app` no Argo CD declarar esse `Deployment` no Git, o Argo CD passará a gerenciá-lo, mesmo que tenha sido criado inicialmente via `kubectl`.

---

### **6. Gerenciamento de Recursos Órfãos**
- Se um recurso no cluster tiver labels/annotations do Argo CD, mas **não existir no Git**, ele será considerado **órfão**.
- Com `prune: true` habilitado, o Argo CD **removerá** esses recursos durante a sincronização.

---

### **7. Desabilitar Rastreamento**
Para evitar que o Argo CD gerencie um recurso:
- Remova as labels/annotations do Argo CD.
- Ou use a anotação:
  ```yaml
  argocd.argoproj.io/sync-options: SkipDryRunOnMissingResource=true
  ```

---

### **Resumo**
| Cenário                          | Como o Argo CD Rastreia                          |
|----------------------------------|--------------------------------------------------|
| Recurso criado pelo Argo CD      | Usa annotations padrão (`argocd.argoproj.io/*`) |
| Recurso criado externamente      | Usa `app.kubernetes.io/instance` label           |
| Recurso não gerenciado           | Ignorado (a menos que explicitamente associado) |

---

### **Referência Direta da Documentação**
A seção oficial explica isso em:  
[Resource Tracking - Argo CD Docs](https://argo-cd.readthedocs.io/en/stable/user-guide/resource_tracking/).

Se precisar de um exemplo mais específico ou ajuda para debuggar um cenário, posso ajudar!