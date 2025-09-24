---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Para ignorar a annotation **`checksum/config`** (que contém uma barra `/` no nome) em um **[[deployment]]** usando a abordagem de `ignoreDifferences` no nível do **`Application`** do [[introducao-argocd|ArgoCD]], você precisa escapar a barra no caminho JSON Pointer. Veja como fazer:

---

### 🛠 **Solução: Configurar `ignoreDifferences` no `Application`**
Edite o manifesto do seu `Application` do ArgoCD e adicione o seguinte bloco:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: seu-app
spec:
  ignoreDifferences:
    # Ignora a annotation 'checksum/config' no Deployment
    - group: apps
      kind: Deployment
      name: nome-do-seu-deployment  # Substitua pelo nome real
      jsonPointers:
        - /spec/template/metadata/annotations/checksum~1config  # Barra é escapada como ~1
```

#### **Detalhes Importantes**:
1. **Escaping da barra (`/`)**:  
   Em **JSON Pointers**, barras em nomes de campos devem ser escapadas como **`~1`**.  
   - Annotation original: `checksum/config` → Caminho no JSON Pointer: **`checksum~1config`**.

2. **Nome do Deployment**:  
   Substitua `nome-do-seu-deployment` pelo nome real do seu Deployment (obtenha com `kubectl get deployments`).

3. **Grupo API**:  
   Deployments estão no grupo `apps`, não esqueça de especificar.

---

### 🔍 **Como Verificar se Funcionou?**
1. **Sincronize o aplicativo** no ArgoCD (se necessário).
2. **Verifique o diff** na UI do ArgoCD:  
   - A annotation `checksum/config` não deve mais aparecer como modificada.

---

### 📌 **Exemplo Completo com Outros Ignorados (Se Necessário)**
Se você já está ignorando outros recursos (como [[secret]] ou Webhooks), mantenha tudo no mesmo bloco:

```yaml
spec:
  ignoreDifferences:
    # Annotation 'checksum/config' no Deployment
    - group: apps
      kind: Deployment
      name: nome-do-deployment
      jsonPointers:
        - /spec/template/metadata/annotations/checksum~1config

    # Secret do Linkerd (exemplo anterior)
    - group: ""
      kind: Secret
      name: linkerd-policy-validator-k8s-tls
      jsonPointers:
        - /data/tls.key
        - /data/tls.crt

    # MutatingWebhookConfiguration (exemplo anterior)
    - group: admissionregistration.k8s.io
      kind: MutatingWebhookConfiguration
      name: linkerd-proxy-injector-webhook-config
      jsonPointers:
        - /webhooks/0/clientConfig/caBundle
```

---

### ⚠️ **Problemas Comuns e Correções**
| Cenário                          | Solução                                                                 |
|----------------------------------|-------------------------------------------------------------------------|
| O drift persiste                 | Verifique se o nome do Deployment está correto e se o escaping (`~1`) foi aplicado. |
| Erro de sintaxe no YAML          | Use um validador (ex.: [YAML Lint](https://yamllint.com/)) para checar. |
| Múltiplas annotations com `/`    | Repita o bloco para cada annotation (ex.: `checksum~1cert`, `checksum~1config-2`). |

---

### ✅ **Por Que Usar Essa Abordagem?**
- **Escopo Local**: Afeta apenas o `Application` atual, sem impactar outros apps.  
- **Precisão**: Ignora apenas a annotation problemática, mantendo outras comparações ativas.  
- **Manutenção Simplificada**: Toda a configuração fica no mesmo arquivo.  

Se preferir uma solução **global** (para todos os aplicativos), você pode adicionar a mesma regra no `argocd-cm` ConfigMap, mas isso afetaria todos os Deployments no cluster.