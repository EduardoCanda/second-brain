---
tags:
  - Kubernetes
  - NotaPermanente
  - todo
categoria: CD
ferramenta: argocd
---
* [x] Implementar mecanismo de Coleta de Metricas do [[introducao-argocd|Argo CD]] ✅ 2025-08-22
* [x] Implementar Dashboard renderizando todas as informações do Argo CD ✅ 2025-08-30
> Dashboard implementado com sucesso, importando com ID disponível no grafana, precisei realizar alguns ajustes referentes a tag job que está divergente do dashboard, uma das possíveis soluções seria alterar no service monitor, porém pelo dashboard é muito mais rápido e prático.
* [x] Implementar helm chart do projeto de contas com todos os repositorios de infra(Possivelmente sera necessario waves) ✅ 2025-08-30
> Fiz a tentativa de criação de uma repositório unificado porém existe um grande risco de acoplamento forte entre worloads de deploy, inviabilizando essa operação. A maneira próxima que encontrei de realizar esse processo é criar um repositório centralizador de repositórios, onde há mapeamento de nomes de repos.
* [x] Avaliar possibilidade de criar um repositorio apartado de applications dedicadas para addos no cluster ✅ 2025-08-30
> Por hora estou criando os applications via interface gráfica, considero uma boa produtividade e por hora não vejo necessidade de automatizar esse processo, porém a medida que o projeto crescer será necessário retomar nesse assunto, e integrar isso via CI.
- [x] Configurar mecanismo para tráfego seguro(https). ✅ 2025-08-23
	> Essa integração foi realizada via implementação de [[gateway-api|Gateway API]], fiz a desativação do tráfego https da instância e foquei na borda.
- [ ] Estruturar applications em Projects, explorando a funcionalidade e sua evolução e utilização
- [ ] Configurar mecanismo para integrar autenticação com OIDC e OAUTH 2.0

