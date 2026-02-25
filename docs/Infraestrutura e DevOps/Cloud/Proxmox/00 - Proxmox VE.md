# Proxmox VE (Virtual Environment)

## O que é o Proxmox VE

O **Proxmox VE (PVE)** é uma plataforma open source de virtualização baseada em Debian que unifica:

- **KVM/QEMU** para máquinas virtuais (VMs);
- **LXC** para containers de sistema;
- **Storage e rede** com gerenciamento centralizado;
- **Cluster** de múltiplos nós;
- **Backup/restore** e migração de workloads.

Ele é muito usado em homelab porque entrega recursos de datacenter com interface web simples, sem esconder os conceitos fundamentais de virtualização, rede e armazenamento.

---

## Conceitos fundamentais

## Nó (Node)
Servidor físico que executa o Proxmox.

## Datacenter
Visão lógica do ambiente completo no painel (um ou vários nós).

## VM (KVM)
Virtualização completa com kernel próprio (Windows, Linux, BSD etc.).

## Container (LXC)
Virtualização leve com kernel compartilhado do host, ideal para serviços Linux simples.

## Storage
Locais de armazenamento para ISOs, discos de VM, snapshots e backups.
Exemplos comuns: `local`, `local-lvm`, NFS, ZFS, Ceph.

## Bridge de rede (vmbr)
Switch virtual que conecta VMs/CTs com a rede física ou VLANs.

## Cluster
Agrupamento de nós para gestão unificada, HA e migração.

---

## Quando usar VM vs LXC

### Use VM quando:

- precisar de kernel próprio;
- quiser isolamento mais forte;
- for rodar sistemas diferentes do host (Windows, pfSense, appliances);
- precisar de compatibilidade ampla.

### Use LXC quando:

- quiser menor consumo de recursos;
- for rodar serviços Linux leves;
- quiser subir ambientes rapidamente.

**Resumo prático:** em homelab, bancos de dados, monitoramento e automações podem ir em LXC; firewall, AD, Kubernetes com requisitos específicos e laboratórios de SO geralmente funcionam melhor em VMs.

---

## Arquitetura de rede para homelab

Uma base que funciona bem:

1. **vmbr0 (LAN principal):** management do Proxmox e acesso às VMs.
2. **VLANs por tipo de workload:**
   - VLAN 10: management;
   - VLAN 20: serviços internos;
   - VLAN 30: laboratório/ataque e defesa.
3. **Firewall dedicado em VM** (ex.: OPNsense/pfSense) para segmentar tráfego.
4. **Rede separada para storage/backup** se tiver mais de um nó.

Isso permite simular ambiente corporativo real com segurança e organização.

---

## Armazenamento: o que estudar primeiro

## LVM-Thin
- simples e rápido para começar;
- snapshots práticos;
- bom para um único disco local.

## ZFS
- excelente para integridade de dados;
- snapshots, compressão e replicação;
- ideal quando você quer estudar storage de forma mais profunda.

## NFS/SMB
- útil para backup centralizado em NAS.

## Ceph (nível avançado)
- storage distribuído para cluster;
- ótimo para estudar alta disponibilidade e escalabilidade.

---

## Backup, snapshot e recuperação

### Boas práticas

- Política **3-2-1** para backups críticos;
- Agendamento automático de backups (vzdump);
- Teste de restore frequente;
- Use snapshots antes de mudanças de risco (upgrade, alteração de rede, tuning).

### Fluxo recomendado

1. Snapshot antes da mudança;
2. Aplicar mudança;
3. Validar serviço;
4. Converter snapshot em backup estável (quando fizer sentido).

---

## Proxmox para estudo em homelab

## Trilha em 4 fases

### Fase 1 — Base
- instalar Proxmox em hardware antigo ou mini PC;
- subir 2 VMs Linux + 1 LXC;
- praticar template, clone e snapshot.

### Fase 2 — Rede e segurança
- criar VLANs e segmentação;
- subir firewall virtual;
- configurar regras entre segmentos.

### Fase 3 — Operação
- backup agendado + restore validado;
- monitoramento básico (CPU, RAM, disco, latência);
- runbook de incidentes (queda de VM, disco cheio, perda de rede).

### Fase 4 — Cluster e HA
- montar 2 ou 3 nós;
- testar migração ao vivo;
- explorar quorum, HA manager e cenários de falha.

---

## Como conectar Proxmox com estudos de Cloud

Mesmo sendo on-prem/homelab, Proxmox ajuda a entender fundamentos usados em cloud pública:

- provisionamento de compute;
- redes segmentadas e políticas;
- volumes e lifecycle de storage;
- automação (Terraform, Ansible, API);
- observabilidade e operação contínua.

### Ferramentas para elevar o laboratório

- **Terraform Provider Proxmox:** infraestrutura como código;
- **Ansible:** configuração e hardening pós-provisionamento;
- **GitHub Actions/GitLab CI:** pipeline para validar playbooks e templates;
- **Packer:** criação de imagens padronizadas.

---

## Limitações e cuidados

- sem planejamento de energia/rede, homelab pode ser instável;
- snapshots não substituem backup;
- overcommit exagerado degrada tudo ao mesmo tempo;
- misturar tráfego de management com laboratório aumenta risco.

---

## Checklist rápido de estudo

- [ ] Criar VM com cloud-init.
- [ ] Criar LXC com limite de CPU/RAM.
- [ ] Configurar bridge + VLAN tag em uma VM.
- [ ] Executar backup e restore completo.
- [ ] Testar migração entre nós (se cluster).
- [ ] Automatizar criação de 1 VM com Terraform.

---

## Próximos passos sugeridos

1. Documentar topologia do seu homelab em diagrama simples.
2. Definir um padrão de nomes para VMs/CTs.
3. Criar um repositório `infra-homelab` com Terraform + Ansible.
4. Adicionar métricas e alertas (Prometheus/Grafana) no ambiente.

