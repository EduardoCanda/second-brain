---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: helm
categoria: buid
---
- **Não.** Você **não precisa** rodar [[helm-dependency-build|helm dependency build]] toda vez só para ter hover/autocomplete no VS Code. O IntelliSense vem do **JSON Schema** que o VS Code carrega do disco (via `$schema` ou `yaml.schemas`). ([GitHub](https://github.com/redhat-developer/vscode-yaml?utm_source=chatgpt.com "redhat-developer/vscode-yaml: YAML support for VS Code ..."))
    
- Você **só precisa “descompactar”** um subchart se o seu `values.schema.json` do **chart pai** estiver com um `$ref` que aponta para **um arquivo dentro do [[helm-subcharts|subchart]]** (ex.: `./charts/redis/values.schema.json`). O VS Code **não abre** o `.tgz` dentro de `charts/`. Logo, para esse caso, mantenha o subchart **em diretório** (desempacotado) ou referencie um schema **externo** ([[protocolo-https|HTTP]]). ([helm.sh](https://helm.sh/docs/helm/helm_pull/?utm_source=chatgpt.com "Helm Pull"))
    

### Fluxos que funcionam bem

**Opção A – Diretório “dev” só pra schemas (recomendada)**

1. Crie `schemas/subcharts/` no chart pai.
    
2. Baixe e descompacte o subchart **fora** de `charts/`:
    
    ```bash
    helm pull <repo/subchart> --version <x.y.z> --untar --untardir ./schemas/subcharts/<nome>
    ```
    
    Isso grava `./schemas/subcharts/<nome>/values.schema.json`. ([helm.sh](https://helm.sh/docs/helm/helm_pull/?utm_source=chatgpt.com "Helm Pull"))
    
3. No `values.schema.json` do chart pai:
    
    ```json
    { "properties": { "meuSubchart": { "$ref": "./schemas/subcharts/meuSubchart/values.schema.json" } } }
    ```
    
4. Adicione `schemas/` no **.helmignore** para não empacotar isso. ([helm.sh](https://helm.sh/docs/chart_template_guide/helm_ignore_file/?utm_source=chatgpt.com "The .helmignore file"))
    

> Nesse fluxo você **não roda** `helm dependency build` para o IntelliSense; só atualiza o `schemas/` quando trocar a versão do subchart.

**Opção B – Subchart “vendorizado” em `charts/` (sem .tgz)**

- Coloque o subchart **como diretório** em `charts/<nome>/` (não como `.tgz`). O loader do Helm aceita dependências como **diretório desempacotado** e o VS Code resolve o `$ref` local. ([helm.sh](https://helm.sh/docs/topics/charts/?utm_source=chatgpt.com "Charts"))
    
- Evite misturar isso com `helm dependency update/build`, que tendem a **baixar `.tgz`** para `charts/`. Se usar build/update, você teria que **untar** depois para manter o IntelliSense (ou usar a Opção A). ([helm.sh](https://helm.sh/docs/helm/helm_dependency_build/?utm_source=chatgpt.com "Helm Dependency Build"))
    

**Opção C – `$ref` remoto**

- Aponte o `$ref` para a URL “raw” do `values.schema.json` do subchart (GitHub/Git). Funciona, mas depende de rede e da estabilidade do link.
    

### Quando usar `helm dependency build` ou `update`?

- **`helm dependency build`**: reconstrói `charts/` usando as versões **presas no `Chart.lock`** (reprodutível). Se não houver lock, ele se comporta como `update`. ([helm.sh](https://helm.sh/docs/helm/helm_dependency_build/?utm_source=chatgpt.com "Helm Dependency Build"))
    
- **`helm dependency update`**: resolve **novas versões** conforme `Chart.yaml` e gera/atualiza o `Chart.lock`. ([helm.sh](https://helm.sh/docs/helm/helm_dependency_update/?utm_source=chatgpt.com "Helm Dependency Update"))
    

> Para **IntelliSense**, nenhum dos dois é obrigatório **a cada edição**. Use-os quando você **mudar a versão** de uma dependência; aí, se seu `$ref` é local, **atualize/untar** o schema correspondente.

### Dica final de VS Code

Garanta que seus `values*.yaml` apontem para o schema:

```yaml
# yaml-language-server: $schema=./values.schema.json
```

ou mapeie via `.vscode/settings.json`. ([GitHub](https://github.com/redhat-developer/vscode-yaml?utm_source=chatgpt.com "redhat-developer/vscode-yaml: YAML support for VS Code ..."))

Se quiser, te deixo um `Makefile`/script que lê `Chart.lock`, roda `helm pull --untar` para cada dependência em `schemas/subcharts/` e mantém os `$ref` sempre certinhos.