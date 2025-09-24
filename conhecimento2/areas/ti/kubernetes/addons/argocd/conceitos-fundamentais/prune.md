---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **Estratégias de Prune no Argo CD**  

O `prune` é um mecanismo do [[introducao-argocd|Argo CD]] que **remove recursos do cluster quando eles são excluídos do [[Git]]**, mantendo o alinhamento com o [[GitOps]]. Abaixo estão as principais estratégias para usá-lo de forma eficiente e segura:

---

## **📌 1. Prune Automático (`automated.prune: true`)**  
**Funcionamento**:  
- O Argo CD **exclui automaticamente** recursos do cluster se eles forem removidos do repositório Git.  
- Ideal para ambientes **não críticos** (ex: dev, staging).  

**Exemplo**:  
```yaml
syncPolicy:
  automated:
    prune: true  # Ativa prune automático
    selfHeal: true  # Corrige drift
```

**Vantagens**:  
✅ Mantém o cluster limpo e alinhado com o Git.  
✅ Elimina recursos órfãos sem intervenção manual.  

**Riscos**:  
❌ Pode excluir recursos acidentalmente se o Git não for atualizado corretamente.  

---

## **📌 2. Prune Manual (`argocd app sync --prune`)**  
**Funcionamento**:  
- O prune só é executado quando **acionado manualmente** via CLI ou UI.  
- Útil para **produção**, onde exclusões requerem revisão.  

**Exemplo**:  
```sh
argocd app sync minha-app --prune
```

**Vantagens**:  
✅ Controle granular sobre exclusões.  
✅ Evita remoção acidental de recursos críticos.  

**Quando usar**:  
- Para recursos persistentes (ex: [[persistent-volume|PVs]], bancos de dados).  
- Em ambientes com múltiplas equipes.  

---

## **📌 3. Prune Seletivo (Anotações)**  
**Funcionamento**:  
- Use anotações para **impedir o prune** em recursos específicos.  

**Exemplo**:  
```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-options: Prune=false  # Nunca exclui este recurso
```

**Cenários de uso**:  
- Recursos compartilhados entre aplicações.  
- PVs/[[persistent-volume-claim]]s que devem persistir mesmo se removidos do Git.  

---

## **📌 4. Prune com [[sync-waves]] (Ordem Controlada)**  
**Funcionamento**:  
- Define uma **ordem de exclusão** para evitar problemas com dependências.  

**Exemplo**:  
```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "-5"  # Recursos com wave menor são excluídos primeiro
```

**Caso típico**:  
- Excluir [[Pods]] antes de `PVCs`.  
- Remover [[service]] antes de [[Deployments]].  

---

## **📌 5. Ignorar Recursos no Prune (`ignoreDifferences`)**  
**Funcionamento**:  
- Lista recursos que **nunca devem ser prunados**, mesmo se ausentes no Git.  

**Exemplo**:  
```yaml
spec:
  ignoreDifferences:
    - group: ""
      kind: PersistentVolume
      jsonPointers:
        - /spec/storageClassName
```

**Quando usar**:  
- Para recursos gerenciados fora do [[GitOps]] (ex: operadores de banco de dados).  

---

## **📌 6. Prune com Confirmação (Dry Run + Aprovação)**  
**Funcionamento**:  
- Simula o prune antes de executar (`--dry-run`).  

**Exemplo**:  
```sh
argocd app diff minha-app --prune --dry-run  # Mostra o que será excluído
argocd app sync minha-app --prune  # Executa após validação
```

**Vantagem**:  
✅ Evita exclusões acidentais.  

---

## **📊 Comparação das Estratégias**  
| **Estratégia**            | **Automático?** | **Requer Confirmação?** | **Uso Recomendado**          |  
|---------------------------|----------------|------------------------|-----------------------------|  
| `automated.prune: true`   | ✅ Sim         | ❌ Não                 | Dev/Staging                 |  
| `sync --prune`            | ❌ Não         | ✅ Sim                 | Produção                    |  
| Anotações (`Prune=false`) | ❌ Não         | ❌ Não                 | Recursos persistentes       |  
| `ignoreDifferences`       | ❌ Não         | ❌ Não                 | Recursos gerenciados externamente |  

---

## **⚠️ Cuidados ao Usar Prune**  
1. **Backup de dados**:  
   - Certifique-se de que PVs com dados críticos tenham `persistentVolumeReclaimPolicy: Retain`.  
2. **Dependências entre recursos**:  
   - Use `sync waves` para evitar exclusão prematura (ex: deletar um `Namespace` antes dos recursos dentro dele).  
3. **Validação prévia**:  
   - Sempre revise o diff (`argocd app diff`) antes de ativar prune em produção.  

---

## **🎯 Exemplo Completo**  
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: minha-app
spec:
  source:
    repoURL: https://github.com/meu-org/repo.git
    path: kustomize/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: minha-app
  syncPolicy:
    automated:
      prune: true  # Prune automático (cuidado em produção!)
      selfHeal: true
    syncOptions:
      - PruneLast=true  # Exclui recursos por último
    ignoreDifferences:
      - group: ""
        kind: Secret  # Nunca prune Secrets
```

---

### **Conclusão**  
Escolha a estratégia de prune com base no **ambiente** e **criticidade dos recursos**:  
- **Dev/Staging**: `automated.prune: true`.  
- **Produção**: `sync --prune` com confirmação manual.  
- **Recursos persistentes**: `Prune=false` ou `ignoreDifferences`.  

Precisa de ajuda para configurar em um cenário específico? Posso elaborar! 😊
