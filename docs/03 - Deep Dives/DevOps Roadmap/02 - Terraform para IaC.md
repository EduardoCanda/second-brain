# Terraform para Infraestrutura como Código (IaC)

## Objetivo
Provisionar infraestrutura de forma reprodutível, auditável e versionada.

## Conceitos-chave
- **Providers** (AWS, Azure, GCP, etc.).
- **State file** (`terraform.tfstate`) e backend remoto.
- **Plan vs Apply**.
- **Módulos** para reutilização.
- **Drift detection**.

## Estrutura sugerida
```txt
infra/
  modules/
  envs/
    dev/
    prod/
```

## Workflow mínimo
1. `terraform fmt`
2. `terraform validate`
3. `terraform plan`
4. Aprovação
5. `terraform apply`

## Boas práticas
- Nunca commitar state local sensível.
- Usar backend remoto (S3 + lock com DynamoDB, por exemplo).
- Separar ambientes por workspace/pasta.
- Revisar `plan` no PR.
