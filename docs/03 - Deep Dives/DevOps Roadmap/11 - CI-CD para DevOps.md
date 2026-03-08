# CI/CD para DevOps

## O que é
CI/CD é o conjunto de práticas e pipelines para integrar mudanças continuamente (CI) e entregar software com segurança e previsibilidade (CD).

## Por que isso existe
Pipelines padronizados reduzem lead time, minimizam erro manual e criam governança sobre qualidade, segurança e conformidade antes de promover versões.

## Como funciona internamente

### Pipeline design
```text
Commit -> Build -> Test -> Security -> Package -> Publish -> Deploy -> Verify
```

Cada estágio deve produzir artefatos imutáveis e evidências (logs, relatórios, SBOM).

### Pipeline templates
Templates evitam copiar YAML entre repositórios e padronizam:
- etapas de build,
- quality gates,
- assinatura de artefatos,
- estratégia de release.

### Quality gates
Bloqueios automáticos por política:
- testes unitários/integrados obrigatórios,
- cobertura mínima,
- CVEs acima de severidade definida,
- compliance de infraestrutura/policies.

### Release policies e artefact lifecycle
- **Release policy** define quando promover (janela, aprovação, critérios).
- **Artefact lifecycle**: build único, promoção entre ambientes, retenção e descarte.

## Exemplos práticos

### Exemplo de stages
```yaml
stages:
  - lint
  - test
  - build
  - security_scan
  - publish
  - deploy_staging
  - deploy_prod
```

### Gate de segurança no build de container
```bash
docker build -t registry.local/api:${GIT_SHA} .
trivy image --severity HIGH,CRITICAL --exit-code 1 registry.local/api:${GIT_SHA}
cosign sign registry.local/api:${GIT_SHA}
```

### Política de promoção
- `staging`: automática após sucesso.
- `prod`: aprovação manual + janela de baixo tráfego.

## Boas práticas
- Build once, deploy many (promover mesmo artefato).
- Pipeline como código versionado no Git.
- Executar testes rápidos cedo e caros depois.
- Publicar métricas de DORA e taxa de falha por pipeline.

## Armadilhas comuns
- Pipeline monolítico lento sem paralelização.
- Ambientes inconsistentes por rebuild entre estágios.
- Aprovação manual sem critérios objetivos.

## Referências relacionadas
- [[01 - Git e Estratégia de Branches]]
- [[08 - Secrets e Supply Chain Security]]
- [[12 - Deployment Strategies em Kubernetes]]
