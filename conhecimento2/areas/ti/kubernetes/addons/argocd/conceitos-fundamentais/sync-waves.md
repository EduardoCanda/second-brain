---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
# **Sync Waves no Argo CD: Controle de Ordem em Sincronizações**

Os **Sync Waves** são um mecanismo do [[introducao-argocd|Argo CD]] para **ordenar a aplicação de recursos** durante uma sincronização, garantindo que dependências sejam resolvidas na sequência correta. Eles são essenciais para:

- Evitar erros como _"[[custom-resources|CRD]] not found"_ (recursos dependentes sendo criados antes dos pré-requisitos).
- Orquestrar operações complexas (ex: migrar um banco antes do deploy da app).

---

## 🎯 **Como Funcionam?**
1. **Cada recurso tem um "wave" (onda)** definido por uma anotação:
   ```yaml
   metadata:
     annotations:
       argocd.argoproj.io/sync-wave: "N"  # N = número inteiro (positivo ou negativo)
   ```
2. **Ordem de execução**:
   - Recursos com `sync-wave` menor são aplicados **primeiro**.
   - Wave padrão (sem anotação) = `0`.
   - Waves negativos são executados **antes do wave 0**.

---

## 📌 **Exemplo Prático**
Suponha que você queira:
1. Criar um **[[namespace]]** (wave `-1`).  
2. Criar um **[[custom-resources|CustomResourceDefinition]] (CRD)** (wave `0`).  
3. Implantar um **Custom Resource** que depende do CRD (wave `1`).  

### **Arquivos no Git**:
#### 1. `namespace.yaml` (Wave -1)
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
  annotations:
    argocd.argoproj.io/sync-wave: "-1"
```

#### 2. `crd.yaml` (Wave 0)
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: myresources.example.com
```

#### 3. `custom-resource.yaml` (Wave 1)
```yaml
apiVersion: example.com/v1
kind: MyResource
metadata:
  name: my-resource
  annotations:
    argocd.argoproj.io/sync-wave: "1"
```

---

## 🔄 **Fluxo de Sincronização**
1. **Wave -1**: Namespace `my-app` é criado.  
2. **Wave 0**: CRD `myresources.example.com` é instalado.  
3. **Wave 1**: O recurso `MyResource` é implantado (após o CRD estar pronto).  

---

## 🛠️ **Casos de Uso Comuns**
| **Wave** | **Recurso**                                   | **Motivo**                                         |
| -------- | --------------------------------------------- | -------------------------------------------------- |
| `-2`     | [[secret\|Secrets]]/[[configmap\|ConfigMaps]] | Configurações devem existir antes dos Deployments. |
| `-1`     | [[Namespaces]]                                | Evitar erros de "namespace not found".             |
| `0`      | CRDs/Operators                                | Pré-requisito para Custom Resources.               |
| `1`      | Banco de Dados                                | Deploy antes da aplicação que depende dele.        |
| `2`      | Aplicação Principal                           | Deploy após todos os pré-requisitos.               |

---

## ⚠️ **Cuidados Importantes**
1. **[[hooks]] também usam sync waves**:  
   - Um hook `PreSync` com wave `-1` roda antes de um recurso wave `0`.  
2. **Dependências entre waves**:  
   - O Argo CD **não espera** recursos de waves anteriores ficarem "Healthy" (a menos que use `Sync Options` como `Prune=false`).  
3. **Valores válidos**:  
   - Waves podem ser de `-1000` a `1000`.

---

## 🔥 **Exemplo Avançado com [[helm]]**
Se usar Helm, adicione anotações via `values.yaml`:
```yaml
annotations:
  argocd.argoproj.io/sync-wave: "-1"
```

Ou force waves para recursos específicos no `Application`:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  syncPolicy:
    syncOptions:
      - RespectSyncWave=true  # Garante que waves sejam respeitados
```

---

## 📊 **Como Verificar Waves no Dashboard?**
1. Acesse a UI do Argo CD.  
2. Na visão da aplicação, clique em **"Sync Details"**.  
3. Os recursos serão agrupados por wave.  

---

## 💡 **Por Que Usar Sync Waves?**
- **Ordem determinística**: Evita corridas entre recursos.  
- **Controle fino**: Substitui soluções como `initContainers` para dependências complexas.  
- **Integração com [[GitOps]]**: Toda a ordem é definida no [[Git]].  

---

### ✅ **Resumo**
1. **Sync Waves ordenam deploys** no Argo CD.  
2. **Números mais baixos = prioridade mais alta**.  
3. **Use para CRDs, namespaces, e dependências críticas**.  