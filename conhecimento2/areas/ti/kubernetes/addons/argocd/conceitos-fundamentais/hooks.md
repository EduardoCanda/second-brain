---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
# **Hooks no Argo CD: Exemplos Práticos e Diferença para Auto Sync**

Os **hooks** no [[introducao-argocd|Argo CD]] são scripts ou operações executados **antes, durante ou após** uma sincronização (sync) para realizar ações adicionais, como:
- **Preparar o ambiente** (ex: criar um banco de dados antes do deploy).
- **Validar configurações** (ex: checar se um [[configmap]] existe).
- **Executar pós-processamento** (ex: enviar notificação após deploy).

Eles são úteis para **orquestrar tarefas complexas** que vão além do simples `kubectl apply`.

---

## 🔹 **Tipos de Hooks no Argo CD**
| Tipo | Quando Executa | Exemplo de Uso |
|------|---------------|----------------|
| **PreSync** | Antes da sincronização | Criar namespaces, secrets, CRDs. |
| **Sync** | Durante a sincronização (substitui o apply padrão) | Migração de banco de dados. |
| **PostSync** | Após a sincronização | Testes de smoke, notificações no Slack. |
| **SyncFail** | Se a sincronização falhar | Rollback automático, alerta. |

---

## 📌 **Exemplo Prático: Hooks em um [[application|application]]**
Suponha que você queira:
1. **Criar um [[namespace]]** antes do deploy (PreSync).  
2. **Executar um Job de migração** após o deploy (PostSync).  

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: "https://github.com/meu-repo.git"
    path: "k8s-manifests"
  destination:
    namespace: my-app
    server: "https://kubernetes.default.svc"
  syncPolicy:
    syncOptions:
      - CreateNamespace=true  # Cria o namespace se não existir
    automated:  # Auto-sync habilitado
      selfHeal: true  # Corrige drift automaticamente
    hooks:
      # --- Pré-sync: Cria um Secret antes do deploy ---
      - name: pre-create-secret
        kind: Secret
        apiVersion: v1
        metadata:
          name: my-secret
        data:
          password: $(echo -n "senha-secreta" | base64)
        hook:
          phase: PreSync

      # --- Pós-sync: Roda um Job de migração ---
      - name: db-migration
        kind: Job
        apiVersion: batch/v1
        metadata:
          name: db-migration-job
        spec:
          template:
            spec:
              containers:
              - name: migrator
                image: alpine:latest
                command: ["sh", "-c", "echo 'Rodando migração...' && sleep 5"]
              restartPolicy: Never
          backoffLimit: 1
        hook:
          phase: PostSync
          deletePolicy: HookSucceeded  # Apaga o Job se der sucesso
```

---

## 🔄 **Diferença Entre Hooks e Auto Sync**
| **Recurso**     | **Auto Sync**                                      | **Hooks**                                     |
| --------------- | -------------------------------------------------- | --------------------------------------------- |
| **Objetivo**    | Sincroniza automaticamente o cluster com o [[Git]] | Executa ações adicionais antes/depois do sync |
| **Quando Roda** | Sempre que há mudança no Git                       | Definido manualmente nos manifests            |
| **Exemplo**     | Atualiza um Deployment quando o YAML muda          | Roda um Job de migração após o deploy         |
| **Controle**    | Pode ser desligado (`automated: false`)            | Sempre executado se definido no manifest      |

### **Quando Usar Cada Um?**
- **Auto Sync**: Para implantações contínuas ([[GitOps]] puro).  
- **Hooks**: Para tarefas extras (migrações, notificações, pré-requisitos).  

---

## 🚨 **Cuidados com Hooks**
1. **Hooks bloqueantes**: Se um PreSync falhar, a sincronização **não ocorre**.  
2. **Recursos não gerenciados**: Hooks são **excluídos após a execução** (a menos que use `deletePolicy: HookFailed`).  
3. **Ordem de execução**: Use `syncWave` para controlar a ordem dos hooks.  

Exemplo de `syncWave` em um hook:
```yaml
hook:
  phase: PreSync
  syncWave: -1  # Executa ANTES dos recursos padrão (wave 0)
```

---

## 🔥 **Exemplo Avançado: Notificação no Slack**
```yaml
hooks:
- name: notify-slack
  kind: Pod
  apiVersion: v1
  metadata:
    name: slack-notifier
  spec:
    containers:
    - name: curl
      image: curlimages/curl
      command: ["sh", "-c", "curl -X POST -H 'Content-type: application/json' --data '{\"text\":\"Deploy da app my-app concluído!\"}' $SLACK_WEBHOOK"]
    restartPolicy: Never
  hook:
    phase: PostSync
```

---

## ✅ **Conclusão**
- **Hooks** estendem o Argo CD para tarefas customizadas.  
- **Auto Sync** mantém o cluster alinhado ao Git automaticamente.  
- **Use os dois juntos** para um fluxo GitOps completo!  

Quer um exemplo com Helm + Hooks? Posso mostrar! 😊