---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
 No [[introducao-argocd|Argo CD]], o **[[applicationset]]** **não aparece como um item separado na interface principal** (home). Em vez disso, ele **cria automaticamente os [[application|Applications]] individuais**, que são listados diretamente na página inicial do Argo CD.  

---

### **📌 Como o ApplicationSet é exibido na IU do Argo CD?**
1. **ApplicationSet (Recurso Pai)**:  
   - Aparece apenas na aba **"Application Sets"** (disponível a partir da versão 2.4+ do Argo CD).  
   - Se você clicar nele, verá **metadados e status** (mas não as aplicações filhas diretamente).  

2. **Applications (Recursos Filhos)**:  
   - Cada `Application` gerado pelo ApplicationSet é listado **normalmente na home do Argo CD**, como se tivesse sido criado manualmente.  
   - Eles podem ser filtrados por:  
     - *Project*  
     - *Cluster*  
     - *Sync Status*  

---

### **🎯 Visualização Prática na IU**  
#### **1. Home do Argo CD (Página Inicial)**  
- Mostra **todos os `Applications`** (incluindo os gerados pelo ApplicationSet).  
- Exemplo:  
  ```
  NOME               STATUS      PROJETO    CLUSTER  
  microservice-A     Healthy    default    in-cluster  
  microservice-B     Syncing    default    in-cluster  
  ```  
  *(Esses `Applications` foram criados por um ApplicationSet, mas aparecem como normais.)*  

#### **2. Aba "Application Sets"**  
- Disponível no menu lateral (se habilitada).  
- Mostra apenas o **ApplicationSet** que gerou os `Applications`:  
  ```
  NOME               STATUS      IDADE  
  my-appset          Healthy     2d  
  ```  
  - Clicando nele, você vê detalhes **do generator**, mas não das aplicações filhas.  

---

### **🔍 Comparação: ApplicationSet vs. Applications na IU**  
| Feature               | ApplicationSet (Recurso Pai) | Applications (Filhos) |  
|-----------------------|-----------------------------|-----------------------|  
| **Listado na home?**  | ❌ Não                      | ✅ Sim                |  
| **Tem aba própria?**  | ✅ Sim (2.4+)               | ❌ Não                |  
| **Mostra status dos filhos?** | ❌ Apenas status próprio | ✅ Status individual |  
| **Pode sincronizar em massa?** | ✅ Sim (sync all) | ❌ Apenas um por um |  

---

### **💡 Dica: Como Visualizar o Relacionamento?**  
1. **Via UI**:  
   - Abra um `Application` gerado pelo ApplicationSet → Veja a seção **"Owner References"** (mostra qual ApplicationSet o criou).  

2. **Via CLI**:  
   ```sh
   kubectl get application <nome> -n argocd -o yaml | grep ownerReferences -A 5
   ```

---

### **⚠️ Limitações**  
- Se o ApplicationSet for **deletado**, os `Applications` filhos **não são removidos automaticamente** (a menos que `prune: true` esteja habilitado).  
- A aba **"Application Sets"** só está disponível em versões recentes (2.4+).  

---

### **✅ Resumo**  
- **Na home do Argo CD**, você vê **os `Applications` (filhos)** diretamente, não o ApplicationSet.  
- O ApplicationSet é um **recurso administrativo** (gerador), não um item de deploy visível.  
- Para gerenciar múltiplos `Applications` em massa, use a **aba "Application Sets"** ou a **CLI**.  

Se precisar de um print da tela ou exemplo passo a passo, posso ajudar! 😊