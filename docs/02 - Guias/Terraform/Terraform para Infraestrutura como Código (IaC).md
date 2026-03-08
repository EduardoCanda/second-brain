## O que é
Terraform é uma ferramenta declarativa para provisionar infraestrutura por meio de providers (AWS, Kubernetes, Cloudflare etc.), gerando plano de execução antes de aplicar mudanças.

## Por que isso existe
Provisionamento manual em console gera drift, baixa reprodutibilidade e pouca auditoria. Terraform reduz erro humano, padroniza ambientes e integra com PR/CI.

## Como funciona internamente

### Fluxo de execução
```text
HCL (.tf) -> terraform init -> terraform plan -> terraform apply
                    │
                    └-> backend remoto (state + lock)
```

- **State**: mapeia recurso real para recurso lógico no código.
- **Plan**: diferença entre estado desejado e estado atual.
- **Apply**: execução das mudanças planejadas.

### Terraform State
- Armazena IDs reais dos recursos (`aws_vpc.vpc.id`, etc.).
- Deve ficar em backend remoto com locking.
- Em AWS, padrão comum: S3 + DynamoDB lock table.

Exemplo:
```hcl
terraform {
  backend "s3" {
    bucket         = "tfstate-prod-company"
    key            = "network/prod.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tfstate-locks"
    encrypt        = true
  }
}
```

### Módulos Terraform
Módulos encapsulam padrões reutilizáveis (VPC, EKS, RDS). Benefícios:
- padronização de naming/tagging,
- menor duplicação,
- governança central.

### Drift e idempotência
- **Drift**: recurso alterado fora do Terraform (console/CLI).
- Detectar com `terraform plan` recorrente em CI.
- Terraform é idempotente: aplicar o mesmo código não deve gerar mudança quando estado real já está convergente.

### Terraform vs Ansible
- Terraform: provisionamento de infraestrutura (ciclo de vida de recursos).
- Ansible: configuração de sistema/aplicação dentro de hosts.
- Uso conjunto comum: Terraform cria instâncias, Ansible configura software.

## Exemplos práticos

### Pipeline mínimo para IaC
```bash
terraform fmt -check -recursive
terraform init -backend-config=backend.hcl
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
```

### Estrutura de repositório
```text
infra/
  modules/
    vpc/
    eks/
  envs/
    dev/
    prod/
```

### Drift detection em CI
```bash
terraform plan -detailed-exitcode
# exit 0: sem mudanças
# exit 2: drift/mudanças detectadas
# exit 1: erro
```

## Boas práticas
- Nunca commitar `terraform.tfstate` local.
- Separar estado por domínio e ambiente.
- Revisar `plan` em PR antes de `apply`.
- Definir política de tags obrigatórias (owner, cost-center, env).
- Usar `tflint`, `tfsec`/`checkov` em quality gate.

## Armadilhas comuns
- Um state gigante para tudo (alto blast radius).
- Misturar recursos de múltiplos ambientes no mesmo workspace sem governança.
- `terraform apply` direto em produção sem `plan` revisado.
- Uso excessivo de `-target` (pode causar inconsistência de dependências).
