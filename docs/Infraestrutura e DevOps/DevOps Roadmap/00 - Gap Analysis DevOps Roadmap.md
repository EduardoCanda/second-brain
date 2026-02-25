# DevOps Roadmap (roadmap.sh) — Gap analysis do repositório

> Objetivo: mapear o que já existe no repositório e o que ainda falta para uma trilha de estudos DevOps mais completa.

## 1) Fundamentos

### ✅ Já existe no repo
- Linux e fundamentos de SO.
- Bash e linha de comando.
- Redes (TCP/IP, DNS, DHCP, HTTP, load balancer, segurança etc.).

### ⚠️ Faltando/raso
- Git (conceitos e fluxo avançado).
- Estratégias de branching e convenções de commit/versionamento.

## 2) CI/CD

### ✅ Já existe no repo
- Fundamentos de CI/CD.
- GitHub Actions.
- Jenkins.

### ⚠️ Faltando/raso
- Estratégias de deploy (blue/green, canary, rolling).
- Pipeline templates, quality gates e política de releases.

## 3) Containers e Orquestração

### ✅ Já existe no repo
- Docker (fundamentos, imagens, volumes, networking, compose, troubleshooting).
- Kubernetes (visão geral + manifestos).

### ⚠️ Faltando/raso
- Helm e Kustomize.
- GitOps com Argo CD/Flux.

## 4) Infraestrutura como código e automação

### ❌ Faltando
- Terraform (IaC).
- Ansible (configuration management).
- Conceitos de state, drift, idempotência e modularização.

## 5) Cloud

### ✅ Já existe no repo
- OpenStack e Proxmox.
- Trilha de AWS (Developer Certification).

### ⚠️ Faltando/raso
- Arquitetura cloud para operação DevOps (IAM, rede, observabilidade, custo, alta disponibilidade).

## 6) Observabilidade e operação

### ✅ Já existe no repo
- Prometheus, Grafana, Loki, Jaeger, OpenTelemetry.

### ⚠️ Faltando/raso
- SRE: SLI/SLO/SLA, error budget, incident response, postmortem.

## 7) Segurança

### ✅ Já existe no repo
- Firewall, TLS, conceitos gerais de segurança.

### ⚠️ Faltando/raso
- Secrets management (Vault/KMS).
- Segurança de cadeia de suprimentos (SBOM, assinatura, scan de imagem, policy-as-code).

## 8) Datastores, mensageria e web servers

### ✅ Já existe no repo
- Banco de dados (overview SQL/noSQL).

### ❌ Faltando
- Mensageria (RabbitMQ/Kafka).
- Web servers/reverse proxy (Nginx).
- Caching operacional (Redis) voltado para DevOps.

## 9) Continuidade e confiabilidade

### ❌ Faltando
- Backup, restore, disaster recovery (RTO/RPO).
- Runbooks operacionais.

---

## Plano de criação das notas (neste ciclo)

1. Git e estratégia de branches.
2. Terraform (IaC).
3. Ansible.
4. Helm e Kustomize.
5. GitOps com Argo CD/Flux.
6. Mensageria (Kafka/RabbitMQ).
7. Nginx e reverse proxy.
8. Secrets management e supply chain security.
9. SRE (SLA/SLI/SLO/incidentes).
10. Backup e disaster recovery.
