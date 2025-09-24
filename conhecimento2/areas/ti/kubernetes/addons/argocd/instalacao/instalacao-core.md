---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
**Argo CD Core** é um tipo de instalação simplificada do **[[introducao-argocd|Argo CD]]**, que inclui apenas os componentes essenciais para o funcionamento básico da ferramenta, sem recursos avançados ou integrações opcionais.

### 🔹 **O que é incluído no Argo CD Core?**
- **Componentes principais**:
  - **[[api-server]]** (Servidor da API)
  - **[[repo-server]]** (Servidor de repositórios)
  - **[[application-controller]]** (Controlador de aplicações)
- **Funcionalidades básicas**:
  - Sincronização de aplicações [[GitOps]].
  - Gerenciamento de estados desejados vs. estados atuais.
  - Interface web e CLI básicas.

### 🔹 **Diferença entre Argo CD Core e Argo CD Full**
| **Recurso**                                        | **Argo CD Core** | **Argo CD Full** |
| -------------------------------------------------- | ---------------- | ---------------- |
| **SSO ([[Resumo OAUTH 2.0\|OAuth2]], LDAP, etc.)** | ❌ Não incluído   | ✅ Suportado      |
| **[[rbac]] Avançado**                              | ❌ Básico         | ✅ Completo       |
| **Integração com [[Areas/TI/Kubernetes/Prometheus]]**                  | ❌ Não incluído   | ✅ Suportado      |
| **Notificações (Webhooks)**                        | ❌ Não incluído   | ✅ Suportado      |
| **Multi-cluster Management**                       | ❌ Limitado       | ✅ Melhor suporte |

### 🔹 **Quando usar o Argo CD Core?**
- Para **ambientes simples** onde não são necessários SSO, RBAC avançado ou monitoramento.
- Em **testes ou ambientes de desenvolvimento** que não exigem todos os recursos.
- Quando se deseja uma instalação **leve e mínima**.

### 🔹 **Como instalar o Argo CD Core?**
Geralmente, a instalação mínima pode ser feita via **Helm** ou **kubectl** com um manifesto reduzido. Exemplo com Helm:

```sh
helm install argocd argo/argo-cd \
  --namespace argocd \
  --set "server.fullnameOverride=argocd-server" \
  --set "controller.enabled=true" \
  --set "repoServer.enabled=true" \
  --set "redis.enabled=false" \
  --set "dex.enabled=false" \
  --set "notifications.enabled=false"
```

### 🔹 **Conclusão**
O **Argo CD Core** é ideal para quem busca uma instalação enxuta do Argo CD, enquanto a versão completa (**Full**) é recomendada para ambientes de produção com necessidades avançadas de segurança e integração.

Quer mais detalhes sobre configurações específicas? Posso ajudar! 🚀