---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
No [[introducao-argocd|Argo CD]], **Projetos** são uma forma de organizar e gerenciar aplicações com políticas de acesso, restrições de recursos e configurações compartilhadas. Eles funcionam como um "[[namespace]] lógico" para agrupar aplicações com regras comuns. Vamos explorar em detalhes:

---

## **1. O que são Projetos no Argo CD?**
- **Objetivo**: Isolar e gerenciar aplicações com políticas específicas (ex.: time "A" só pode implantar no namespace "X").
- **Não é um recurso nativo do [[kubernetes]]**: É um conceito do Argo CD para controle de acesso e governança.
- **Hierarquia**:
```
  Argo CD Instance → Projetos → Aplicações (Applications)
  ```

---

## **2. Principais Funcionalidades dos Projetos**
### **(a) Restrições de Recursos**
Define onde e como as aplicações podem ser implantadas:
- **Namespaces permitidos**: Quais namespaces no cluster Kubernetes podem receber recursos.
  ```yaml
  spec:
    destinations:
      - namespace: dev-*
        server: https://kubernetes.default.svc
  ```
- **Clusters permitidos**: Quais clusters Kubernetes podem ser alvos.
- **Tipos de recursos bloqueados**: Ex.: proibir a criação de [[ingress]] ou [[clusterrole]].
  ```yaml
  spec:
    sourceNamespaces: ["default"]
    blacklistedResources:
      - group: "networking.k8s.io"
        kind: "Ingress"
  ```

### **(b) Controle de Acesso ([[rbac]])**
- Define **quem** pode fazer **o quê** dentro do projeto.
- Exemplo: Permitir que o time "dev" só sincronize aplicações, mas não as exclua.
  ```yaml
  spec:
    roles:
      - name: dev-team
        description: Time de Desenvolvimento
        policies:
          - p, proj:my-project:dev-team, applications, sync, my-project/*, allow
          - p, proj:my-project:dev-team, applications, get, my-project/*, allow
  ```

### **(c) Origens de Repositórios [[Git]]**
- Restringe quais repositórios Git podem ser usados para deploy.
  ```yaml
  spec:
    sourceRepos:
      - "https://github.com/my-org/dev-manifests.git"
      - "https://gitlab.com/my-org/prod-configs.git"
  ```

---

## **3. Estrutura de um Projeto (Argo CD CRD)**
Projetos são definidos via um [[custom-resources]] (CRD) do tipo `AppProject`:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: my-project
  namespace: argocd
spec:
  description: "Projeto do Time de Desenvolvimento"
  sourceRepos:
    - "*" # Permite qualquer repositório (não recomendado para produção)
  destinations:
    - namespace: "dev-*" # Permite qualquer namespace começando com "dev-"
      server: "https://kubernetes.default.svc" # Cluster local
  clusterResourceWhitelist:
    - group: "*"
      kind: "*"
  roles:
    - name: admin
      policies:
        - p, proj:my-project:admin, applications, *, my-project/*, allow
```

---

## **4. Casos de Uso Comuns**
### **(a) Multi-Tenancy (Times Diferentes)**
- Criar projetos separados para `dev`, `staging` e `prod`, cada um com:
  - Seus próprios namespaces.
  - Acesso restrito a repositórios Git específicos.

### **(b) Segurança em Clusters Compartilhados**
- Evitar que uma aplicação em `dev` implante recursos em `prod`.
- Bloquear a criação de recursos perigosos (ex.: `PodSecurityPolicy`).

### **(c) Governança de Deploy**
- Garantir que apenas imagens de um registry confiável sejam implantadas.

---

## **5. Como Criar/Configurar um Projeto?**
### **(a) Via CLI**
```sh
argocd proj create my-project \
  --description "Projeto de Exemplo" \
  --src "https://github.com/my-org/repo.git" \
  --dest https://kubernetes.default.svc,dev-*
```

### **(b) Via Manifesto YAML**
1. Aplique um `AppProject`:
   ```sh
   kubectl apply -f project.yaml -n argocd
   ```
2. Associe aplicações ao projeto:
   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata:
     name: my-app
   spec:
     project: my-project # <- Associação ao projeto
   ```

---

## **6. Projeto Default**
- Todo Argo CD vem com um projeto padrão chamado `default`.
  - Permite qualquer repositório Git e qualquer destino.
  - **Não recomendado para produção!**

---

## **7. Dicas Importantes**
1. **Use projetos para evitar "desastres"**:
   - Ex.: Bloquear deploys em `kube-system`.
2. **Integre com SSO**:
   - Projetos podem ser associados a grupos do LDAP/OIDC.
3. **Monitore violações**:
   - O Argo CD nega operações fora das regras do projeto.

---

## **8. Limitações**
- Projetos **não** substituem `NetworkPolicies` ou `RBAC` do Kubernetes.
- Não há herança entre projetos (cada um é independente).

---

### **Resumo Visual**
```
Projeto no Argo CD
├── Aplicações
├── Destinos (namespaces + clusters)
├── Origens Git permitidas
├── Tipos de recursos bloqueados
└── RBAC (time-dev pode só sincronizar)
```

Se precisar de um exemplo mais concreto ou ajuda para debuggar um projeto, posso ajudar![]()