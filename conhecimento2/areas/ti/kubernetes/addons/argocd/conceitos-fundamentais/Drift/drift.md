---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **O que é Drift no Contexto do [[GitOps]] e Kubernetes?**  

**Drift** (ou *config drift*) é a diferença entre o **estado desejado** de uma aplicação ou infraestrutura (definido em um repositório Git) e o **estado real** em execução no cluster Kubernetes.  

Quando ocorre um *drift*, significa que alguém (ou algo) modificou o cluster **manualmente** (ex: `kubectl edit`, `kubectl apply` direto) ou um processo automático alterou recursos sem atualizar o [[Git]], quebrando o princípio do **GitOps** (*"Git como única fonte da verdade"*).

---

## 🔍 **Tipos de Drift**
1. **Manual Drift**  
   - Alguém alterou um recurso no cluster sem atualizar o Git.  
   - Exemplo: Um SRE modifica um `Deployment` via `kubectl scale` sem atualizar o YAML no repositório.

2. **Automated Drift**  
   - Um operador ou ferramenta (ex: [[hpa]], Cluster Autoscaler) modifica recursos dinamicamente.  
   - Exemplo: O Horizontal Pod Autoscaler (HPA) ajusta réplicas, mas o Git ainda reflete o valor antigo.

3. **External Drift**  
   - Mudanças causadas por fatores externos, como:  
     - Um *admission controller* (ex: [[linkerd]] injetando sidecars).  
     - Um *[[custom-resources|CRD]] controller* (ex: Istio, [[cert-manager]] criando recursos derivados).  

---

## ⚠️ **Por que o Drift é um Problema?**
- **Quebra a Reprodutibilidade**: O cluster não pode ser recriado idêntico apenas com o Git.  
- **Dificulta Rollbacks**: Se o estado atual não corresponde ao Git, reverter pode causar inconsistências.  
- **Risco de Configurações Não Testadas**: Mudanças manuais podem não ter passado por CI/CD.  
- **Falhas Silenciosas**: O *drift* pode causar bugs difíceis de rastrear ("funcionava na minha máquina").  

---

## 🛠️ **Como o [[introducao-argocd|Argo CD]] Lida com o Drift?**
O Argo CD monitora continuamente o cluster e compara com o Git. Se detectar *drift*, ele pode:  

1. **Corrigir Automaticamente** (se `auto-sync` estiver habilitado):  
   - Reaplica o estado do Git, sobrescrevendo mudanças manuais.  

2. **Alertar sem Corrigir** (se `auto-sync` estiver desabilitado):  
   - Mostra o *drift* no dashboard e requer intervenção manual.  

3. **Ignorar Mudanças Específicas** (usando `ignoreDifferences`):  
   - Útil para recursos modificados por controladores externos (ex: HPA).  
   - Exemplo no `Application` do Argo CD:
     ```yaml
     spec:
       ignoreDifferences:
       - group: "apps"
         kind: "CustomResourceDefinition"
         jsonPointers:
         - /spec/preserveUnknownFields
         - # Ignora mudanças no número de réplicas (gerado pelo HPA)
     ```

---


## 📌 **Exemplo Prático: Identificando e Corrigindo Drift**
### **Cenário**:  
- O Git define `replicas: 3` para um `Deployment`, mas alguém executou `kubectl scale --replicas=5`.  

### **Passo 1: Verificar o Drift no Argo CD**  
- No dashboard ou via CLI:  
  ```sh
  argocd app diff <nome-da-app>
  ```
  Saída:
  ```
  Deployment/my-app
    spec.replicas: 3 (Git) != 5 (Live)
  ```

### **Passo 2: Decidir a Ação**  
- **Se auto-sync estiver ativado**: O Argo CD redefinirá `replicas: 3`.  
- **Se auto-sync estiver desativado**: Um humano deve aprovar a sincronização.  

### **Passo 3: Prevenir Drift Futuro**  
- **Bloquear mudanças manuais** com políticas de [[rbac]]:  
  ```sh
  kubectl create roleblock manual-edit --verb=update --resource=deployments
  ```
- **Usar Admission Controllers** (ex: OPA Gatekeeper) para validar mudanças.  

---

## 🏆 **Boas Práticas para Evitar Drift**
1. **Sempre modificar via Git** (não usar `kubectl edit`/`apply` direto).  
2. **Desabilitar `auto-sync` em produção** para evitar sobrescritas acidentais.  
3. **Monitorar drift com alertas** (ex: [[Areas/TI/Kubernetes/Prometheus]] + Argo CD metrics).  
4. **Documentar exceções** (ex: [[hpa]], sidecars) no `Application` do Argo CD.  

---

## 🔥 **Conclusão**  
O *drift* é um inimigo silencioso do GitOps, mas o Argo CD ajuda a detectá-lo e corrigi-lo. A chave é:  
- **Minimizar mudanças manuais**.  
- **Automatizar sincronizações com cuidado**.  
- **Monitorar diferenças críticas**.  