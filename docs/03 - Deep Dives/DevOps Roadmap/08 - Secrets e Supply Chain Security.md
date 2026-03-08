# Secrets Management e Supply Chain Security

## O que é
Conjunto de práticas para proteger credenciais, artefatos e cadeia de build/deploy contra vazamento, adulteração e execução de componentes comprometidos.

## Por que isso existe
Ambientes modernos dependem de múltiplos tokens, chaves e imagens de terceiros. Sem controles de segurança contínuos, o risco de comprometimento cresce em toda entrega.

## Como funciona internamente

### Secrets management
- Segredo é armazenado em cofre central (Vault/Secrets Manager).
- Aplicação autentica com identidade de workload.
- Segredo é entregue on-demand e rotacionado.

### Vault e Cloud KMS
- **HashiCorp Vault**: secret engine, dynamic secrets, policies por path.
- **Cloud KMS**: gestão de chaves para criptografia e envelope encryption.

### Supply chain controls
```text
Source -> Build -> Scan -> SBOM -> Sign -> Registry -> Deploy policy
```

- **SBOM**: inventário de componentes do artefato.
- **Image scanning**: CVEs em dependências e base image.
- **Policy as Code**: bloqueia deploy fora da política.

## Exemplos práticos

### Vault CLI
```bash
vault kv put secret/payments/db username=app password='***'
vault kv get secret/payments/db
vault policy write payments-read payments-read.hcl
```

### SBOM e scan de imagem
```bash
syft packages my-api:1.2.0 -o spdx-json > sbom.spdx.json
grype my-api:1.2.0 --fail-on high
trivy image --severity HIGH,CRITICAL my-api:1.2.0
```

### Policy as Code (exemplo conceitual)
- Negar imagem sem assinatura.
- Negar `latest` em produção.
- Exigir `runAsNonRoot: true`.

## Boas práticas
- Nunca guardar segredos em Git/plaintext.
- Implementar rotação automática para credenciais sensíveis.
- Assinar imagens e verificar assinatura no deploy.
- Definir severidade máxima permitida para release.

## Armadilhas comuns
- Usar segredo de longa duração em CI sem rotação.
- Considerar `Kubernetes Secret` seguro sem criptografia at-rest.
- Gerar SBOM sem integrá-la a processo de aprovação.

## Referências relacionadas
- [[05 - GitOps com Argo CD e Flux]]
- [[11 - CI-CD para DevOps]]
- [[13 - Arquitetura Cloud para DevOps]]
