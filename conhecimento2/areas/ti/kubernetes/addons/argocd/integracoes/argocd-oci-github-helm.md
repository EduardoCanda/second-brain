---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: argocd
categoria: CD
---
Perfeito! Vamos direto ao ponto.

## Por que `passCredentials: true` resolveu

O `repo-server` do [[introducao-argocd|Argo CD]] chama o [[helm]] [[helm-dependency-build|dependency build]] para baixar as **dependências** definidas no seu `Chart.yaml`.  
Quando a dependência vem de **outro host** (no seu caso, **GHCR: `ghcr.io`**) o Helm, por padrão, **não repassa** credenciais em todas as requisições envolvidas na resolução (ex.: chamada ao endpoint de **token** do registry). Resultado: o Helm tenta negociar **anonimamente** e toma **401**.

Com `passCredentials: true`, o Argo CD executa o Helm com `--pass-credentials`, instruindo o Helm a **enviar as credenciais também para as URLs auxiliares** usadas no fluxo (como `ghcr.io/token`). Assim o GHCR emite um bearer token e o pull do chart **passa a ser autenticado** (sem cair no “anonymous token → 401”).

---

## Resumo do que fizemos (p/ documentação)

1. **Identificamos o erro** no `argocd-repo-server`: `failed to fetch anonymous token ... 401 Unauthorized` ao tentar baixar a dependência OCI do GHCR.
    
2. **Ajustamos a forma de referenciar registries OCI no Argo CD**:
    
    - Para _registrar_ o registry (Secrets tipo `repository`): **sem** `oci://`, ex.: `ghcr.io/<owner>/charts`.
        
    - Para _dependências Helm no `Chart.yaml`_: **com** `oci://`, ex.: `oci://ghcr.io/<owner>/charts`.
        
3. **Criamos credenciais de registry** no Argo CD (Secrets com `argocd.argoproj.io/secret-type: repo-creds`) cobrindo:
    
    - o host `ghcr.io` (amplo), e
        
    - opcionalmente o path exato `ghcr.io/<owner>/charts`.
        
4. **Garantimos permissão de fonte** no `AppProject` (incluir `ghcr.io/*` em `spec.sourceRepos` se você restringe fontes).
    
5. **Ativamos `passCredentials: true`** no `Application`, fazendo o Helm **repassar** credenciais durante o `dependency build`.
    
6. **Reiniciamos** o `repo-server` para limpar cache de credenciais e **testamos**.
    

---

## Manifests finais (modelo)

### Credenciais (repo-creds)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: repocreds-ghcr-host
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repo-creds
stringData:
  url: ghcr.io
  type: helm
  enableOCI: "true"
  username: <github-username>
  password: <github-pat-classic-read-packages>
```


### AppProject (se você restringe fontes)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: default
  namespace: argocd
spec:
  sourceRepos:
    - '*'
    - ghcr.io/*
  destinations:
    - namespace: '*'
      server: '*'
  clusterResourceWhitelist:
    - group: '*'
      kind: '*'
```

### Application (Git + dependência OCI) — com `passCredentials`

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: minha-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/<git-owner>/<git-repo>.git
    path: <path-do-chart>              # ex.: charts/minha-app
    targetRevision: <branch-ou-tag>    # ex.: main
    helm:
      passCredentials: true
  destination:
    server: https://kubernetes.default.svc
    namespace: apps
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Chart.yaml (no seu repositório [[Git]])

```yaml
apiVersion: v2
name: minha-app
version: 0.1.0
dependencies:
  - name: kubernetes-java-helm
    version: "<X.Y.Z>"
    repository: "oci://ghcr.io/<owner-lowercase>/charts"
```

---

## Dicas operacionais

- **Token**: use **PAT classic** com `read:packages` (e autorize SSO se houver).
    
- **Tudo minúsculo** em `ghcr.io/<owner>/charts/<chart>`.
    
- Para destravar rapidamente em emergências: **vendorize** as dependências (`helm dependency build` local + commit de `charts/` e `Chart.lock`).
    

Se quiser, eu monto esses manifests já com seus nomes reais pra você só aplicar.