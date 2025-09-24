---
tags:
  - Kubernetes
  - NotaPermanente
categoria: CD
ferramenta: argocd
---
Os [[application]] basicamente fazem a leitura de um repositório no Github, ele irá ler os metadados armazenados, sendo possível por exemplo expecíficar de onde ele irá extrair os arquivos YAML podendo usar tanto o kubectl para aplicar as alterações quanto ferramentas como o [[helm]] entre outras.

Ele trabalha com [[GitOps]], ou seja, a fonte verdadeira desejada será sempre a estrutura de metadados específicada no repositório [[Git]] e qualquer modificação manual poderá ocasionar problemas de [[sync-policies|sincronismo]], podendo impactar a atualização da aplicação(que é mapeada através de um [[application|application]])

