---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **Processo de Reconciliação no Argo CD: Explicação Detalhada**

O processo de reconciliação é o mecanismo central do [[introducao-argocd|Argo CD]] para garantir que o estado do cluster [[kubernetes]] **sempre reflita o estado desejado declarado no [[Git]]**. Ele funciona como um **loop de controle contínuo**, executando três etapas principais:

---

## **🔍 Fases da Reconciliação**
### **1. Observação (Watch)**
- **O que acontece**:  
  O Argo CD monitora duas fontes de informação:  
  - **Repositório Git**: Verifica mudanças nos manifests (YAML/[[helm]]/Kustomize).  
  - **Cluster [[kubernetes]]**: Observa alterações nos recursos implantados.  

- **Ferramentas envolvidas**:  
  - **[[repo-server]]**: Clona o repositório Git e renderiza os manifests.  
  - **[[kubernetes-api-server]]**: Fornece o estado atual do cluster.  

- **Gatilhos**:  
  - Webhooks do Git (push events).  
  - Polling periódico (padrão: a cada 3 minutos).  

---

### **2. Diferença (Diff)**
- **Comparação**:  
  O Argo CD usa a biblioteca `kubectl diff` para comparar:  
  - **Estado desejado**: Manifests renderizados a partir do Git.  
  - **Estado real**: Recursos existentes no cluster.  

- **Saída**:  
  - Lista de operações necessárias (`create`, `update`, `delete`).  
  - Exemplo de diff:  
```diff
spec.replicas: 3 (Git) != 5 (Live)  # Drift detectado
```

- **Customizações**:  
  - `ignoreDifferences`: Ignora campos específicos (ex: annotations do [[linkerd]]).  
  - [[sync-policies|syncOptions]]: Controla comportamentos como [[prune]] e `Validate`.

---

### **3. Aplicação (Sync)**
- **Ações executadas**:  
  - **Criação**: Recursos declarados no Git, mas ausentes no cluster.  
  - **Atualização**: Recursos com configuração divergente.  
  - **Exclusão** (se `prune: true`): Recursos no cluster que não existem no Git.  

- **Ordem de operação**:  
  - Segue `sync waves` (ordem definida por anotações).  
  - Exemplo:  
    ```yaml
    metadata:
      annotations:
        argocd.argoproj.io/sync-wave: "0"  # Recursos com wave menor são aplicados primeiro
    ```

- **Hooks**:  
  - `PreSync`: Executado antes da sincronização (ex: migração de banco).  
  - `PostSync`: Executado após a sincronização (ex: notificações).  

---

## **⚙️ Componentes Técnicos Envolvidos**
| **Componente**                | **Responsabilidade**                                      |
| ----------------------------- | --------------------------------------------------------- |
| **Application Controller**    | Executa o loop de reconciliação e aplica mudanças.        |
| **Repo Server**               | Renderiza manifests (Helm/Kustomize) e armazena em cache. |
| **Redis**                     | Cacheia resultados de diff para performance.              |
| **[[kubernetes-api-server]]** | Fornece o estado atual do cluster e aplica mudanças.      |

---

## **🔄 Fluxo Completo (Passo a Passo)**
1. **O Application Controller** inicia um ciclo de reconciliação.  
2. **O [[repo-server]]**:  
   - Baixa o repositório Git.  
   - Renderiza os manifests (se necessário).  
3. **Diff**: Compara os manifests com o estado do cluster.  
4. **Planejamento**: Gera uma lista de operações (add/update/delete).  
5. **Execução**:  
   - Aplica mudanças na ordem definida ([[sync-waves]]).  
   - Executa hooks (se configurados).  
6. **Verificação de Saúde**:  
   - Checa se os recursos estão `Healthy` após o sync.  
   - Atualiza o status no dashboard do Argo CD.  

---

## **📌 Exemplo Prático**
### **Application com Reconciliação Automática**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: https://github.com/meu-org/repo.git
    path: kustomize/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated:  # Ativa reconciliação contínua
      prune: true  # Remove recursos órfãos
      selfHeal: true  # Corrige drift automaticamente
    syncOptions:
      - CreateNamespace=true
      - RespectSyncWave=true
```

---

## **⚠️ Casos Especiais**
### **1. Recursos Órfãos**
- **Definição**: Recursos no cluster que não estão no Git.  
- **Solução**: Use `prune: true` para excluí-los automaticamente.  

### **2. Falhas de Sync**
- **Causas**:  
  - [[custom-resources|CRDs]] ausentes.  
  - Erros de permissão ([[rbac]]).  
- **Debug**:  
  ```sh
  argocd app get <app-name> --show-operation
  kubectl logs -n argocd deploy/argocd-application-controller
  ```

### **3. Drift de Cluster**
- **Exemplo**: Alguém altera um `Deployment` manualmente com `kubectl edit`.  
- **Correção**: `selfHeal: true` reverte para o estado do Git.  

---

## **🎯 Por Que Isso Importa?**
- **Consistência**: Garante que o cluster seja uma réplica exata do Git.  
- **Segurança**: Elimina configurações manuais não rastreáveis.  
- **Recuperação de Desastres**: Reconstrua todo o cluster a partir do Git.  

---

## **🔧 Troubleshooting Comum**
| **Problema**                  | **Solução**                                               |
| ----------------------------- | --------------------------------------------------------- |
| Sync travado em "Progressing" | Verifique `kubectl get events -n <namespace>`.            |
| Erros de permissão            | Atualize o [[clusterrole]] do service account do Argo CD. |
| CRDs não encontradas          | Instale-as manualmente antes do sync.                     |
|                               |                                                           |

Se precisar de ajuda para debugar um erro específico, compartilhe os logs e eu ajudo! 😊