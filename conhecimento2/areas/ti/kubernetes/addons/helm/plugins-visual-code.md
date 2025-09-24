---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: build
ferramenta: helm
---
Sim — dá pra ter _IntelliSense_ de [[Helm]] no VS Code (inclusive para **values** e _subcharts_). Aqui vai o que funciona melhor:

**Extensões recomendadas**

1. **Kubernetes (Microsoft)** – dá syntax highlight e _IntelliSense_ para Helm charts/templatização, além de integrar com `kubectl` e repositórios Helm. ([Chocolatey Software](https://community.chocolatey.org/packages/vscode-kubernetes-tools?utm_source=chatgpt.com "Kubernetes Tools VSCode Extension 1.3.25"), [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=technosophos.vscode-helm&utm_source=chatgpt.com "vscode-helm"))
    
2. **Helm-Intellisense (3ºs)** – completa chaves de `values.yaml`, variáveis e _named templates_ lendo o chart automaticamente. Excelente para navegar por valores
3. . ([GitHub](https://github.com/tim-koehler/Helm-Intellisense?utm_source=chatgpt.com "tim-koehler/Helm-Intellisense: Extension for Visual Studio ..."))
    
3. **YAML (Red Hat)** – habilita _schema_ no YAML; com ele você recebe autocompletar/validação em `values.yaml` quando existir um **`values.schema.json`**. ([Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml&utm_source=chatgpt.com "YAML Language Support by Red Hat"), [GitHub](https://github.com/redhat-developer/vscode-yaml?utm_source=chatgpt.com "redhat-developer/vscode-yaml: YAML support for VS Code ..."))
    

**Como obter dicas de valores (inclusive de subcharts)**

- Adicione um **`values.schema.json`** ao chart (Helm 3 suporta validação por JSON Schema). No VS Code, o YAML usa esse schema para sugerir chaves/descrições. ([helm.sh](https://helm.sh/docs/topics/charts/?utm_source=chatgpt.com "Charts"))
    
- Para **subcharts**, coloque referências no schema do chart pai (ex.: `properties: { <nome-do-subchart>: { "$ref": "charts/<subchart>/values.schema.json" } }`). Há ferramentas que **geram** isso e já criam `$ref` para dependências. ([helm.sh](https://helm.sh/docs/chart_template_guide/subcharts_and_globals/?utm_source=chatgpt.com "Subcharts and Global Values"), [GitHub](https://github.com/dadav/helm-schema?utm_source=chatgpt.com "dadav/helm-schema: Generate jsonschemas from ..."))
    
- Dica prática no editor: no topo do seu `values*.yaml`, aponte o schema:
    
    ```yaml
    # yaml-language-server: $schema=./values.schema.json
    ```
    
    (ou configure em `settings.json` via `yaml.schemas`.) ([GitHub](https://github.com/redhat-developer/vscode-yaml?utm_source=chatgpt.com "redhat-developer/vscode-yaml: YAML support for VS Code ..."))
    

**Gerando schemas automaticamente (opcional, facilita muito)**

- **schema-gen (Helm plugin)** ou **helm-schema** criam `values.schema.json` a partir dos `values.yaml`, útil quando o chart (ou subchart) não publica schema. ([artifacthub.io](https://artifacthub.io/packages/helm-plugin/schema-gen/schema-gen?utm_source=chatgpt.com "helm schema gen plugin"), [GitHub](https://github.com/dadav/helm-schema?utm_source=chatgpt.com "dadav/helm-schema: Generate jsonschemas from ..."))
    
- Muitos charts já usam schema em cada subchart (ex.: prática comum em repositórios grandes). ([Documentação GitLab](https://docs.gitlab.com/charts/development/validation/?utm_source=chatgpt.com "Validations of values using JSON Schema"))
    

Se quiser, te mostro um exemplo de `values.schema.json` com `$ref` para um subchart (Linkerd/Gateway API/ServiceMonitor) e o `settings.json` do VS Code mapeando isso.