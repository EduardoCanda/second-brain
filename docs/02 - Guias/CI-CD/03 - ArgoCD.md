# ArgoCD — teoria + prática (com CLI)

O **ArgoCD** é uma ferramenta de **GitOps para Kubernetes**.
A ideia central é simples:

- o **Git é a fonte da verdade** para os manifests;
- o ArgoCD compara o estado do cluster com o estado do Git;
- se houver diferença (**drift**), ele mostra, alerta e pode sincronizar automaticamente.

---

## 1) Desenho mental do fluxo

```text
                git push
Dev ------------------------------> Repositório Git
                                     (manifests/helm/kustomize)
                                              |
                                              | consulta/observa
                                              v
                                     +------------------+
                                     |      ArgoCD      |
                                     |  (control plane) |
                                     +------------------+
                                       |  compara desired vs live
                                       |  detecta drift
                                       v
                              +---------------------------+
                              | Cluster Kubernetes (live) |
                              +---------------------------+
```

### Interpretação do desenho

- **Desired state**: o que está no Git.
- **Live state**: o que está rodando no cluster.
- **Sync**: operação que aplica o desired state no live state.
- **Health**: avaliação de saúde dos recursos (Deployment, Service, Ingress etc).

---

## 2) Conceitos principais

## Application
No ArgoCD, tudo gira em torno do objeto `Application`.
Ele declara:

- **source**: de onde vem a configuração (repo, path, branch/tag/revision);
- **destination**: para qual cluster/namespace aplicar;
- **syncPolicy**: manual ou automática;
- **prune/selfHeal**: se remove sobras e se corrige drift automaticamente.

## Projeto (AppProject)
Agrupa aplicações com regras de segurança:

- quais repositórios podem ser usados;
- quais destinos (clusters/namespaces) são permitidos;
- quais tipos de recurso são autorizados.

## Estratégias de sync

- **Manual Sync**: alguém aprova e sincroniza.
- **Auto Sync**: sincroniza sozinho após mudança no Git.
- **Prune**: remove recursos que saíram do Git.
- **Self Heal**: corrige alterações manuais feitas direto no cluster.

---

## 3) Arquitetura interna (alto nível)

```text
+-------------------------------------------------------------+
|                         ArgoCD namespace                    |
|                                                             |
|  argocd-server     -> UI + API                              |
|  argocd-repo-server-> lê/manifesta repositórios             |
|  argocd-application-controller -> reconciliação das apps    |
|  argocd-dex-server -> SSO/OIDC (opcional)                   |
|  redis             -> cache/fila interna                    |
+-------------------------------------------------------------+
```

---

## 4) Teoria na prática: ciclo GitOps real

### Passo a passo lógico

1. Você altera manifesto/values no Git.
2. Pipeline valida (lint/test/render).
3. Merge na branch monitorada (ex.: `main`).
4. ArgoCD detecta novo commit.
5. ArgoCD calcula diff entre Git e cluster.
6. Sync manual/automático aplica mudanças.
7. Health status confirma se subiu saudável.

### Exemplo de drift clássico

- Alguém roda `kubectl edit deployment api` em produção.
- O cluster fica diferente do Git.
- ArgoCD marca a app como `OutOfSync`.
- Se `selfHeal` estiver ativo, ele volta para o estado do Git.

---

## 5) CLI do ArgoCD (argocd) — comandos essenciais

> Sim, o ArgoCD tem CLI oficial (`argocd`) e ela é muito útil para automação e troubleshooting.

## Login

```bash
argocd login argocd.seudominio.com \
  --username admin \
  --password 'SENHA' \
  --insecure
```

- `--insecure` é comum em labs sem TLS válido.
- Em produção, prefira TLS válido e SSO.

## Listar apps

```bash
argocd app list
```

Útil para visão rápida de `SYNC STATUS` e `HEALTH STATUS`.

## Ver detalhes de uma app

```bash
argocd app get minha-app
```

Mostra source, destino, health, histórico e condições de erro.

## Ver diferença (diff)

```bash
argocd app diff minha-app
```

Excelente para revisar o que vai mudar antes do sync.

## Sincronizar app

```bash
argocd app sync minha-app
```

Aplica o estado declarado no Git.

## Aguardar ficar saudável

```bash
argocd app wait minha-app --health --sync --timeout 300
```

Muito usado em scripts de deploy para bloquear até estabilizar.

## Forçar refresh

```bash
argocd app get minha-app --refresh
```

Pede nova leitura do estado do cluster/repositório.

## Rollback

```bash
argocd app history minha-app
argocd app rollback minha-app <ID_DO_REVISION>
```

Permite voltar para uma revisão conhecida.

---

## 6) Exemplo de Application (YAML)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: minha-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/minha-org/minha-api-gitops.git'
    targetRevision: main
    path: k8s/overlays/prod
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: minha-api
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

O que esse exemplo faz:

- monitora `main` no caminho `k8s/overlays/prod`;
- aplica no namespace `minha-api`;
- cria namespace se não existir;
- sincroniza automaticamente;
- remove recursos órfãos (`prune`) e corrige drift (`selfHeal`).

---

## 7) Mini laboratório (teoria + prática)

## Pré-requisitos

- cluster Kubernetes (kind, k3d, minikube ou cloud);
- `kubectl` configurado;
- ArgoCD instalado no cluster;
- um repositório Git com manifests.

## Fluxo sugerido de estudo

1. Criar uma aplicação simples (Deployment + Service).
2. Versionar no Git.
3. Criar `Application` no ArgoCD apontando para esse path.
4. Rodar sync e validar pods.
5. Alterar réplicas no Git (`replicas: 1 -> 3`) e observar reconciliação.
6. Simular drift com `kubectl scale` direto no cluster.
7. Observar `OutOfSync` e auto-correção com `selfHeal`.

---

## 8) Boas práticas

- **Um ambiente por pasta/overlay** (`dev`, `stg`, `prod`).
- **Proteja branch principal** e exija PR review.
- **Não usar `latest` em imagens**; prefira tag imutável.
- **Use projetos (`AppProject`)** para limitar blast radius.
- **Habilite auditoria** (logs + trilha de mudanças no Git).
- **Comece com sync manual em produção** até maturidade do time.

---

## 9) Limites e cuidados

- ArgoCD **não substitui** testes de aplicação.
- GitOps ruim = automação rápida de erro.
- Sem governança de repositório, vira caos de manifests.
- Evite segredos em texto puro; combine com Vault/Sealed Secrets/External Secrets.

---

## 10) Resumo rápido

ArgoCD é o motor de reconciliação GitOps no Kubernetes:

- **declara no Git**;
- **compara com o cluster**;
- **sincroniza com segurança**;
- **traz rastreabilidade e previsibilidade de deploy**.

Se dominar `Application`, `sync policy` e CLI (`argocd app get/sync/diff/wait`), você já tem base forte para uso real em times de plataforma.
