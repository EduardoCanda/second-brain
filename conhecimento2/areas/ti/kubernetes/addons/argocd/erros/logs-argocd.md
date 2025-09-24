---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **Como Verificar Logs do Argo CD para Diagnosticar Erros**

Para identificar problemas no [[introducao-argocd|Argo CD]] (como falhas de sync, reconciliação ou autenticação), você pode analisar os logs dos principais componentes. Aqui estão os métodos mais eficazes:

---

## **1. Logs dos [[pod|Pods]] do Argo CD**
### **a) Listar Pods do Argo CD**
```sh
kubectl get pods -n argocd
```
Saída esperada:
```
NAME                                      READY   STATUS
argocd-application-controller-abcde       1/1     Running
argocd-repo-server-xyz123                 1/1     Running
argocd-server-123ab                       1/1     Running
```

### **b) Verificar Logs por Componente**
#### **Application Controller** (Responsável pela [[processo-reconciliacao|reconciliação]])
```sh
kubectl logs -n argocd deploy/argocd-applicationset-controller --tail=100
```
- **Foque em**:  
  - Erros de permissão (`forbidden`).  
  - Falhas na renderização (Helm/Kustomize).  
  - CRDs ausentes.  

#### **Repo Server** (Renderização de manifests)
```sh
kubectl logs -n argocd deploy/argocd-repo-server --tail=100
```
- **Foque em**:  
  - Erros ao baixar repositórios Git (`git fetch failed`).  
  - Problemas com Helm/Kustomize (`template error`).  

#### **API Server** (Autenticação/UI)
```sh
kubectl logs -n argocd deploy/argocd-server --tail=100
```
- **Foque em**:  
  - Falhas de login (`failed to authenticate`).  
  - Erros de RBAC.  

---

## **2. Logs Detalhados (Debug)**
Para aumentar a verbosidade (útil para troubleshooting):
```sh
kubectl exec -n argocd deploy/argocd-application-controller -- argocd app get <app-name> --log-level debug
```
ou modifique o deployment para logar em `debug`:
```sh
kubectl edit deploy -n argocd argocd-application-controller
```
Adicione:
```yaml
args:
  - --loglevel
  - debug
```

---

## **3. Filtrar Logs por Aplicação**
Use `grep` para buscar erros específicos:
```sh
kubectl logs -n argocd deploy/argocd-application-controller | grep -i "error\|failed\|warning"
```
Exemplo de saída:
```
ERROR   Failed to sync app my-app: rpc error: code = Unknown desc = `kustomize build` failed exit status 1
```

---

## **4. Logs de Sync Específicos**
### **a) Verificar Últimas Operações de Sync**
```sh
argocd app get <app-name> --show-operation
```
### **b) Logs de uma Sincronização Específica**
1. Obtenha o `ID` da operação:
   ```sh
   argocd app get <app-name> -o json | jq '.status.operationState.operation.id'
   ```
2. Consulte os logs:
   ```sh
   argocd app logs <app-name> --operation-id <ID>
   ```

---

## **5. Logs de Webhooks (Se Aplicável)**
Se usar webhooks para notificar o Argo CD sobre mudanças no Git:
```sh
kubectl logs -n argocd deploy/argocd-repo-server | grep -i "webhook"
```

---

## **6. Logs de Eventos do Kubernetes**
Para erros não capturados pelos logs do Argo CD:
```sh
kubectl get events -n argocd --sort-by='.lastTimestamp'
```
Exemplo de erro:
```
Warning  SyncError  5m  argocd-application-controller  Error syncing app my-app: secrets "my-secret" not found
```

---

## **🔍 Troubleshooting Comum**
| **Erro**                                | **Causa Provável**                          | **Solução**                          |
|-----------------------------------------|--------------------------------------------|--------------------------------------|
| `git fetch failed`                      | Problemas de acesso ao repositório Git.    | Verifique credenciais/SSH no `argocd-cm`. |
| `CustomResourceDefinition not found`    | CRDs não instaladas antes do Argo CD.      | Instale CRDs manualmente.            |
| `forbidden: User cannot get resource`   | RBAC insuficiente.                         | Atualize `ClusterRole` do Argo CD.   |
| `helm template error`                   | Valores inválidos no Helm.                 | Execute `helm template --debug`.     |

---

## **📌 Dica Bônus: Monitoramento com Prometheus**
Se o Argo CD estiver integrado ao Prometheus, consulte métricas como:
- `argocd_app_sync_total{phase="failed"}`  
- `argocd_app_reconcile_count{phase="error"}`  

---

## **✅ Exemplo Prático**
1. **Erro de Sync**:  
   ```sh
   kubectl logs -n argocd deploy/argocd-application-controller | grep -A 10 "failed to sync"
   ```
2. **Solução**: Corrija o erro no manifesto Git e force um novo sync:
   ```sh
   argocd app sync my-app
   ```

Se precisar de ajuda para interpretar uma mensagem de erro específica, compartilhe o log e posso ajudar a decifrar! 😊