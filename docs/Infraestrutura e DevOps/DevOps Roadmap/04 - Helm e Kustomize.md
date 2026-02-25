# Helm e Kustomize no Kubernetes

## Objetivo
Gerenciar manifests Kubernetes de forma escalável por ambiente.

## Quando usar Helm
- Empacotar aplicações e dependências.
- Reutilizar charts da comunidade.
- Parametrizar via `values.yaml`.

## Quando usar Kustomize
- Ajustar overlays (`dev`, `staging`, `prod`) sem templates.
- Manter YAML próximo do formato nativo Kubernetes.

## Estratégia recomendada
- Helm para apps complexos.
- Kustomize para customização por ambiente e patches.

## Checklist
- [ ] Versionar chart/release.
- [ ] Definir valores por ambiente.
- [ ] Validar render (`helm template` / `kustomize build`) no CI.
