---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: helm
categoria: build
---
[[ordem-argumentos]]

Helm é o “gerenciador de pacotes” do Kubernetes. Ele empacota aplicações e seus manifests em **[[helm-charts|Charts]]**, permitindo **instalar, atualizar, fazer rollback e versionar** implantações com poucos comandos — além de **parametrizar** tudo via `values`.

# Conceitos rápidos

- **[[helm-charts|Chart]]**: pacote com templates e metadados (`Chart.yaml`, `values.yaml`, `templates/*`, `charts/`).
    
- **[[helm-release|Release]]**: uma instância instalada do chart no cluster (com histórico para rollback).
    
- **[[helm-values|Values]]**: arquivo(s) de configuração que alimentam os templates (Go templates + Sprig).
    
- **[[helm-repository|Repositório]]**: onde charts ficam publicados ([[protocolo-https|HTTP]] tradicional) ou **OCI** (ex.: `oci://ghcr.io/...`).
    
- **Helm 3**: sem Tiller; o histórico da release é gravado como **[[Secrets]]** no namespace.
    

# Fluxo de uso (essencial)

```bash
# adicionar repositório clássico
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# ver valores padrões de um chart
helm show values bitnami/nginx

# instalar/atualizar com seus values
helm upgrade --install meu-nginx bitnami/nginx -n web \
  -f values-prod.yaml --create-namespace

# renderizar localmente (sem aplicar)
helm template ./meu-chart -f values.yaml > manifests.yaml

# desinstalar
helm uninstall meu-nginx -n web
```

# Estrutura mínima de um chart

```
meu-chart/
  Chart.yaml        # nome, versão do chart, appVersion
  values.yaml       # configurações padrão
  templates/        # manifests .yaml com templates
  charts/           # dependências (se usar repositório http)
  crds/             # CRDs (se necessário)
  NOTES.txt         # dicas pós-instalação
```

# Dependências e [[OCI]]

- Você pode declarar dependências no `Chart.yaml` e rodar `helm dependency update` (repositórios HTTP) **ou** usar dependências hospedadas em **registries OCI** (`oci://`).
    
- Em pipelines/[[GitOps]] (ex.: [[introducao-argocd]]), quando charts ou **dependências são privados/OCI**, habilite OCI e, se a dependência estiver em outro host ou também exigir credenciais, use **`passCredentials: true`** para que a autenticação seja propagada na resolução das dependências.
    

# Quando escolher Helm (vs. Kustomize)

- **Helm**: precisa de **templating** rico, **parâmetros por ambiente**, **dependências** e **versionamento** do pacote.
    
- **Kustomize**: prefere **overlays declarativos** sem templating e integra direto no `kubectl`.  
    Muitos times usam **Helm para empacotar** e **Argo CD** para orquestrar.
    

# Boas práticas

- Versione o chart (SemVer) e separe `version` (chart) de `appVersion` (sua app).
    
- Separe valores por ambiente (`values-dev.yaml`, `values-prod.yaml`).
    
- Evite secrets em texto puro nos values; use SOPS/Sealed Secrets/External Secrets.
    
- Rode `helm lint` e mantenha `helm dependency update` em dia.
    

Se quiser, te mostro um chart de exemplo já pronto para sua stack (Argo CD + Gateway API + ServiceMonitor).

[[ordem-argumentos]]
