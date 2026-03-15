# Helm no Kubernetes (guia completo)

Helm é o **gerenciador de pacotes do Kubernetes**.

Se o `kubectl apply -f` instala recursos YAML “soltos”, o Helm instala um **pacote versionado** chamado **Chart**, com suporte a templates, variáveis e ciclo de vida de release.

---

## 1) Conceitos fundamentais (bit a bit)

## O que é Chart
Um **Chart** é o pacote da aplicação Kubernetes, contendo:
- templates YAML
- valores padrão
- metadados de versão
- dependências

## O que é Release
Uma **Release** é uma instância instalada de um Chart em um cluster/namespace.

Exemplo mental:
- Chart = “molde” da aplicação
- Release = “instância real” rodando no cluster

## Helm Repository
Repositório de charts (similar a registry de pacotes).
Pode ser remoto (HTTP/OCI) ou local.

## values.yaml
Arquivo com parâmetros para customização (imagem, réplicas, recursos, ingress, etc.).

## templates
Arquivos YAML com placeholders usando Go Templates.

---

## 2) Estrutura padrão de um Chart

```text
meu-chart/
  Chart.yaml
  values.yaml
  charts/
  templates/
    deployment.yaml
    service.yaml
    ingress.yaml
    _helpers.tpl
  templates/tests/
```

### `Chart.yaml`
Metadados do chart:
- `name`
- `version` (versão do chart)
- `appVersion` (versão da aplicação)
- `dependencies`

### `values.yaml`
Valores padrão que alimentam os templates.

### `templates/`
Manifestos Kubernetes renderizados com base em `.Values`, `.Release`, `.Chart`, etc.

### `_helpers.tpl`
Funções e labels reutilizáveis para padronizar nomenclatura.

---

## 3) Fluxo de trabalho principal

1. Criar chart (`helm create`) ou usar chart existente.
2. Ajustar `values.yaml` por ambiente.
3. Renderizar local (`helm template`) para validar YAML final.
4. Validar políticas/lint (`helm lint`, scanners, testes).
5. Instalar/atualizar release (`helm upgrade --install`).
6. Acompanhar rollout e histórico.
7. Rollback se necessário.

---

## 4) Comandos essenciais de Helm

```bash
# Adicionar e atualizar repositório
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Buscar charts
helm search repo nginx

# Criar chart base
helm create minha-api

# Validar chart
helm lint ./minha-api

# Renderizar templates sem instalar
helm template minha-api ./minha-api -f values-dev.yaml

# Instalar release
helm install minha-api ./minha-api -n dev --create-namespace -f values-dev.yaml

# Upgrade (ou install se não existir)
helm upgrade --install minha-api ./minha-api -n dev -f values-dev.yaml

# Ver releases
helm list -n dev

# Histórico e rollback
helm history minha-api -n dev
helm rollback minha-api 2 -n dev

# Remover release
helm uninstall minha-api -n dev
```

---

## 5) Estratégia de ambientes (dev/staging/prod)

Modelo comum:
- `values.yaml` (base)
- `values-dev.yaml`
- `values-staging.yaml`
- `values-prod.yaml`

Exemplo:

```bash
helm upgrade --install minha-api ./chart \
  -n prod \
  -f values.yaml \
  -f values-prod.yaml
```

> Regra: arquivos passados por último sobrescrevem os anteriores.

---

## 6) Helm x kubectl puro

## Vantagens do Helm
- versionamento e empacotamento de manifests
- reuso de templates
- gestão de release e rollback nativo
- facilidade para padronizar deploy entre ambientes
- suporte a dependências de charts

## Pontos de atenção
- templates excessivos podem reduzir legibilidade
- abstração em excesso dificulta troubleshooting
- risco de acoplamento grande em um único chart “monolítico”

---

## 7) Boas práticas para produção

- Manter charts **simples e legíveis**.
- Evitar lógica complexa demais em templates.
- Separar configuração por ambiente em arquivos específicos.
- Usar `helm lint` e `helm template` no CI antes de deploy.
- Versionar chart e app de forma explícita.
- Padronizar labels/annotations via `_helpers.tpl`.
- Definir `resources.requests/limits`, probes e políticas de segurança.
- Evitar segredos em texto puro no `values.yaml`.

---

## 8) Segurança e secrets

Helm **não criptografa secrets nativamente**.
Abordagens comuns:
- External Secrets Operator + secret manager (AWS/GCP/Azure/Vault)
- SOPS + helm-secrets
- Sealed Secrets

Prática recomendada:
- armazenar apenas referências/chaves no repositório
- obter segredo real em runtime/control plane

---

## 9) Dependências de charts

Você pode declarar dependências no `Chart.yaml`.
Exemplo: aplicação + Redis + PostgreSQL (quando fizer sentido).

Comandos úteis:

```bash
helm dependency update ./meu-chart
helm dependency build ./meu-chart
```

Use com cautela: em produção, muitas equipes preferem bancos/filas gerenciados fora do chart da app.

---

## 10) Helm no CI/CD e GitOps

## CI/CD tradicional
- pipeline executa `helm lint`, testes, `helm upgrade --install`

## GitOps (Argo CD / Flux)
- Git é a fonte de verdade
- controlador aplica o estado desejado
- charts Helm podem ser reconciliados automaticamente

Padrão maduro:
- build da imagem no CI
- atualização de tag/valores no Git
- reconciliação contínua pelo operador GitOps

---

## 11) Troubleshooting rápido

Comandos úteis:

```bash
helm status minha-api -n dev
helm get values minha-api -n dev
helm get manifest minha-api -n dev
helm history minha-api -n dev
kubectl get events -n dev --sort-by=.lastTimestamp
kubectl describe deploy/minha-api -n dev
kubectl logs deploy/minha-api -n dev
```

Perguntas-guia:
- O template gerado está correto?
- Os valores aplicados são os esperados?
- A release atualizou para a revisão correta?
- O problema é de Kubernetes (probe, quota, RBAC, imagem) e não do Helm?

---

## 12) Anti-patterns comuns

- Colocar toda a empresa em um chart gigante.
- Misturar lógica de negócio em templates.
- Ignorar limites/requests e probes.
- Não usar revisão/rollback.
- Publicar segredo em `values.yaml` no Git.
- Não validar render no pipeline.

---

## 13) Resumo executivo

- Helm padroniza e acelera deploy no Kubernetes.
- Chart é o pacote; Release é a instalação.
- `values*.yaml` permite promover a mesma app entre ambientes.
- `helm lint`, `helm template` e `upgrade --install` são o núcleo do fluxo.
- Em escala, combine Helm com CI/CD e GitOps.

Se você já domina manifests YAML, aprender Helm é o próximo passo natural para operar Kubernetes com consistência.
