---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
O **Argo CD** é uma ferramenta de **[[GitOps]] contínuo** para [[kubernetes]], projetada para automatizar e gerenciar a implantação de aplicações em clusters Kubernetes de forma declarativa. Ele sincroniza o estado desejado (definido em um repositório [[Git]]) com o estado atual do cluster, garantindo consistência e facilitando rollbacks.

---

## 🔧 **Como o Argo CD funciona?**
1. **Repositório Git como Fonte da Verdade**  
   - O estado desejado da aplicação (manifests Kubernetes como YAML/[[helm]]/Kustomize) é armazenado em um repositório Git.
   - O Argo CD monitora esse repositório e compara com o estado atual do cluster.

2. **Sincronização Automática ou Manual**  
   - Quando há uma mudança no Git, o Argo CD pode:
     - **Sincronizar automaticamente** (se configurado) ou  
     - **Exigir aprovação manual** para aplicar as alterações.

3. **Reconciliação Contínua**  
   - O Argo CD verifica periodicamente se o cluster está em conformidade com o Git.  
   - Se houver *[[drift]]* (diferença entre o Git e o cluster), ele corrige automaticamente ou alerta.

4. **Interface Visual e CLI**  
   - Oferece um **dashboard web** e uma CLI (`argocd`) para gerenciar aplicações.

---

## 🚀 **Principais Recursos do Argo CD**
1. **GitOps Nativo**  
   - Usa Git como única fonte de verdade para deployments, permitindo rastreamento de mudanças e auditoria.

2. **Multi-cluster e Multi-ambiente**  
   - Gerencia implantações em vários clusters Kubernetes simultaneamente (dev, staging, prod).

3. **Suporte a Helm, Kustomize e Raw YAML**  
   - Pode implantar aplicações definidas em Helm Charts, Kustomize ou manifests Kubernetes puros.

4. **Rollback Automático**  
   - Se uma implantação falhar, o Argo CD pode reverter para a última versão estável.

1. **[[sync-waves]] e [[hooks]]**  
   - Permite ordenar a implantação de recursos (ex: criar um CRD antes de um Custom Resource).  
   - Hooks para executar scripts antes/depois da sincronização.

1. **[[rbac]] Integrado**  
   - Controle de acesso baseado em roles (RBAC) para definir quem pode aprovar ou modificar implantações.

7. **Health Checks**  
   - Verifica a saúde das aplicações usando verificações do Kubernetes (Readiness/Liveness) e custom checks.

8. **SSO e Integração com CI/CD**  
   - Suporte a autenticação via [[Resumo OAUTH 2.0|OAuth2]], LDAP, GitHub, GitLab, etc.  
   - Pode ser integrado com ferramentas como Jenkins, GitHub Actions, etc.

9. **ApplicationSets**  
   - Permite gerenciar múltiplas aplicações de forma declarativa (útil para ambientes multi-tenant).

---

## 📌 **Exemplo de Fluxo com Argo CD**
1. Um desenvolvedor faz um **commit** no repositório Git (ex: altera um Deployment).
2. O Argo CD **detecta a mudança** (ou é acionado via webhook).
3. O Argo CD **aplica as alterações** no cluster Kubernetes.
4. Se algo der errado, ele **notifica** a equipe ou **reverte** automaticamente.

---

## 🔗 **Quando Usar?**
- Para **automatizar implantações** em Kubernetes de forma segura e auditável.  
- Para **evitar configuração manual** (`kubectl apply`).  
- Para **gerenciar múltiplos ambientes** com consistência.  

O Argo CD é amplamente usado em ambientes de produção por empresas como Google, IBM, Red Hat e startups que adotam GitOps.

[[areas/ti/kubernetes/addons/argocd/links-externos]]