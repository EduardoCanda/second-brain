# CI/CD — Outros tipos de pipeline

## GitLab CI
- Arquivo `.gitlab-ci.yml`.
- Stages com runners compartilhados ou dedicados.
- Boa opção para times já no GitLab.

## Azure DevOps Pipelines
- YAML e integração com boards, repos e artifacts.
- Forte integração com ecossistema Microsoft.

## CircleCI
- Configuração em `.circleci/config.yml`.
- Boa experiência para pipelines rápidos com cache.

## Bitbucket Pipelines
- Nativo para repositórios Bitbucket.
- Configuração em `bitbucket-pipelines.yml`.

## Argo CD (GitOps para CD)
- Sincroniza estado do cluster Kubernetes a partir do Git.
- Excelente para promoção entre ambientes com rastreabilidade.

## Critérios para escolher ferramenta
- Integração com ecossistema atual.
- Custo de operação e manutenção.
- Escalabilidade dos runners/agentes.
- Segurança de segredos e compliance.
