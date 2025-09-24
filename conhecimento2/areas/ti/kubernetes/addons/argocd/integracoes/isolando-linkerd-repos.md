---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
**Sim**, incluir **manifests do [[linkerd]] (como `HTTPRoutes`, `ServiceProfiles`) no mesmo repositório dos manifests da aplicação** cria problemas críticos, exceto para a annotation `linkerd.io/inject`.  

---

### **📌 Por Que é Problemático?**  
1. **Conflito de Gerenciamento**:  
   - O Linkerd **modifica dinamicamente** recursos (ex: injeta sidecars, atualiza rotas), gerando *drift* entre o Git e o cluster.  
   - O [[introducao-argocd|Argo CD ]]tentará reverter essas mudanças (se `auto-sync` estiver ativado).  

2. **Acoplamento Indesejado**:  
   - Aplicações carregam configurações de infraestrutura (políticas de rede), violando a separação de responsabilidades.  

3. **Dificuldade de Governança**:  
   - Se múltiplas equipes editam `HTTPRoutes`, políticas podem ficar inconsistentes.  

---

### **✅ O Que Pode Ficar no Repo da Aplicação?**  
Apenas a **annotation de injeção do sidecar** (pois é estática e pré-deploy):  
```yaml
# deployment.yaml (no repo-manifests da app)
metadata:
  annotations:
    linkerd.io/inject: enabled  # Única exceção segura
```

---

### **🚫 O Que Deve Ser Movido para um Repositório Separado?**  
Todos os **[[custom-resources|CRDs]] do Linkerd** (ex: `HTTPRoutes`, `ServiceProfiles`, `TrafficSplits`), pois:  
- São **gerenciados pelo controlador do Linkerd** (não pelo GitOps).  
- Podem ser **modificados dinamicamente** (ex: por ferramentas como `linkerd viz`).  

---

### **🛠️ Solução Definitiva**  
1. **Repo da Aplicação**:  
   - Manifests básicos ([[deployment|Deployments]], [[service]]) **+ annotation de injeção**.  

2. **Repo de Políticas do Linkerd**:  
   - `HTTPRoutes`, `ServiceProfiles`, etc.  
   - Gerenciado pela equipe de plataforma ou via automação (ex: CI com templates).  

3. **Argo CD**:  
   - Use `ignoreDifferences` para ignorar campos gerenciados pelo Linkerd:  
     ```yaml
     spec:
       ignoreDifferences:
         - group: "policy.linkerd.io"
           kind: "HTTPRoute"
           jsonPointers:
             - /spec/rules
     ```

---

### **📌 Conclusão**  
**Única exceção segura**: `linkerd.io/inject`.  
**Todo o resto**: Mova para um repositório dedicado ou use automação para evitar conflitos.  

Quer um exemplo passo a passo para migrar? Posso ajudar! 😊