# Helm e Kustomize no Kubernetes

## O que é
Helm e Kustomize são abordagens para gerenciar manifests Kubernetes em escala.
- **Helm**: empacotamento por templates e valores.
- **Kustomize**: composição de YAML nativo com overlays e patches.

## Por que isso existe
Copiar YAML manualmente por ambiente aumenta drift, inconsistência de labels e risco de erro em deploy. Essas ferramentas reduzem duplicação e melhoram governança.

## Como funciona internamente

### Helm
```text
Chart (templates + values.yaml)
   -> renderização
   -> release no cluster (secret/configmap com histórico)
```

Comandos úteis:
```bash
helm lint charts/api
helm template api charts/api -f values-prod.yaml
helm upgrade --install api charts/api -n prod -f values-prod.yaml
```

### Kustomize
```text
base/ (YAML comum)
overlays/dev, overlays/prod (patches)
   -> kustomize build
   -> kubectl apply
```

Comandos úteis:
```bash
kustomize build overlays/prod
kubectl apply -k overlays/prod
```

### Helm vs Kustomize
- Use **Helm** para aplicações distribuídas como charts reutilizáveis.
- Use **Kustomize** para customizar deployment por ambiente sem template language.
- Combinação comum: Helm gera base e Kustomize aplica patches organizacionais.

## Exemplos práticos

### Exemplo de overlay para produção
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../base
patches:
  - target:
      kind: Deployment
      name: api
    patch: |-
      - op: replace
        path: /spec/replicas
        value: 4
```

### Exemplo de values por ambiente (Helm)
```yaml
image:
  repository: 123456789.dkr.ecr.us-east-1.amazonaws.com/api
  tag: "1.12.3"
resources:
  limits:
    cpu: "500m"
    memory: "512Mi"
```

## Boas práticas
- Validar render em CI (`helm template`, `kustomize build`).
- Padronizar labels e annotations de observabilidade.
- Versionar chart e manter changelog de breaking changes.
- Evitar lógica excessiva em templates Helm.

## Armadilhas comuns
- Usar Helm e Kustomize sem fronteira clara de responsabilidade.
- Duplicar values por ambiente sem herança/reuso.
- Não fixar versão de chart externo.

## Referências relacionadas
- [[05 - GitOps com Argo CD e Flux]]
- [[11 - CI-CD para DevOps]]
- [[12 - Deployment Strategies em Kubernetes]]
