# Secrets Management e Supply Chain Security

## Objetivo
Reduzir risco operacional e de segurança na esteira de entrega.

## Secrets management
- Evitar segredos hardcoded no repositório.
- Usar secret stores (Vault, cloud secret manager, Kubernetes secrets + KMS).
- Rotacionar credenciais periodicamente.

## Supply chain security
- Scan de vulnerabilidades em imagens e dependências.
- Assinatura de artefatos.
- Geração de SBOM.
- Policy as Code (bloquear deploy inseguro).

## Checklist mínimo
- [ ] Secret scanning no CI.
- [ ] Image scanning no build.
- [ ] Política de severidade para bloquear release.
