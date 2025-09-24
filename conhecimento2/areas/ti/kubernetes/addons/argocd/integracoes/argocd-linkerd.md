---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
O **Argo CD** pode ser usado tanto para gerenciar **aplicações de produto** quanto **ferramentas de infraestrutura como o Linkerd**, mas existem considerações importantes sobre quando e como usá-lo para cada caso. Vamos analisar:

---

## 🛠️ **Argo CD para Gerenciar Linkerd (Service Mesh)**
### ✅ **Vantagens**
1. **GitOps para Configurações do [[linkerd]]**  
   - Você pode armazenar os manifests do Linkerd ([[custom-resources]], `ServiceProfile`, `TrafficSplit`, etc.) em um repositório Git e sincronizá-los via [[introducao-argocd|Argo CD]].  
   - Isso permite **versionamento e auditoria** das mudanças na malha de serviço.

2. **Atualizações Controladas**  
   - Atualizar o Linkerd (ou seus CRDs) pode ser feito via [[Git]], com revisão de código e rollback seguro se algo der errado.

3. **Multi-cluster Management**  
   - Se você usa Linkerd em vários clusters, o Argo CD ajuda a manter a configuração consistente.

### ⚠️ **Desafios e Cuidados**
1. **Ordem de Deployments**  
   - O Linkerd tem dependências críticas (ex: CRDs devem ser aplicados **antes** dos recursos que os usam).  
   - O Argo CD pode lidar com isso usando **sync waves** (`argocd.argoproj.io/sync-wave` annotation).

2. **Pré-requisitos do Cluster**  
   - O Linkerd requer componentes como `kube-proxy` e CNI funcionando corretamente, que estão fora do escopo do Argo CD.

3. **Auto-injeção de Sidecars**  
   - O Argo CD não gerencia a injeção automática de sidecars do [[linkerd]] (isso é feito pelo **admission controller** do Linkerd).

4. **Atualizações do Control Plane**  
   - Atualizar o **Linkerd control plane** (ex: `linkerd upgrade`) pode exigir comandos CLI, que não são facilmente gerenciáveis via GitOps puro.  
   - Solução: Usar **[[helm]]** ou **manifests estáticos** no Git para o control plane.

---

## 📦 **Argo CD para Aplicações de Produto**
### ✅ **Vantagens**
1. **Deployments Automatizados**  
   - Ideal para aplicações que mudam frequentemente (ex: microsserviços com CI/CD).

1. **Rollback e [[drift|Drift Detection]]**  
   - Se alguém alterar um recurso manualmente (`kubectl edit`), o Argo CD corrige ou alerta.

3. **Multi-ambiente (Dev/Staging/Prod)**  
   - Facilita a promoção de versões entre ambientes usando Git (tags, [[areas/ti/git/Branch]]).

### ⚠️ **Desafios**
   - Para aplicações com **muitos recursos**, pode ser necessário organizar projetos com **ApplicationSets**.

---

## 📌 **Recomendação: Quando Usar Argo CD para Linkerd?**
| Cenário | Recomendação |
|---------|--------------|
| **Configurações do Linkerd (CRDs, políticas de tráfego)** | ✅ **Ótimo** (usar GitOps para `ServiceProfile`, `TrafficSplit`, etc.) |
| **Instalação/Upgrade do Control Plane** | ⚠️ **Possível, mas com cuidado** (melhor usar Helm + sync waves) |
| **Gerenciamento de Extensões (Viz, Multicluster)** | ✅ **Funciona bem** (se versionado no Git) |
| **Injeção de Sidecars** | ❌ **Não aplicável** (gerido pelo Linkerd automaticamente) |

---

### 🔥 **Melhor Abordagem para Linkerd + Argo CD**
1. **Use Helm para o Control Plane**  
   - Armazene o `values.yaml` no Git e sincronize via Argo CD.
   - Exemplo:
     ```yaml
     apiVersion: argoproj.io/v1alpha1
     kind: Application
     metadata:
       name: linkerd-control-plane
     spec:
       destination:
         namespace: linkerd
         server: https://kubernetes.default.svc
       project: default
       source:
         repoURL: https://helm.linkerd.io/stable
         chart: linkerd-control-plane
         targetRevision: 1.14.0
         helm:
           values: |
             identityTrustAnchorsPEM: |
               -----BEGIN CERTIFICATE-----
               ...
     ```

2. **Sync Waves para Dependências**  
   - Garanta que CRDs sejam aplicados primeiro:
     ```yaml
     metadata:
       annotations:
         argocd.argoproj.io/sync-wave: "0"  # CRDs são onda 0
     ```

3. **Aplicações Separadas para Configurações**  
   - Gerencie `TrafficSplit` e políticas em um `Application` separado.

---

## 🏆 **Conclusão**
- **Para aplicações de produto**: Argo CD é **altamente recomendado** (GitOps puro).  
- **Para Linkerd**: É **útil para configurações**, mas requer cuidado com upgrades do control plane.  
- **Combine com Helm** para melhor flexibilidade.  

Se você quer um exemplo passo a passo de como configurar Linkerd com Argo CD, posso fornecer um tutorial detalhado! 😊