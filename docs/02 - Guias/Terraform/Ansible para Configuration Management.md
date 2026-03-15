## O que é
Ansible é uma ferramenta de automação agentless para configurar servidores, aplicar hardening, instalar aplicações e orquestrar rotinas operacionais via SSH/WinRM.

## Por que isso existe
Mesmo com Terraform, ainda existe trabalho de configuração de sistema operacional e middleware. Ansible cobre o "day-2": patching, baseline de segurança e mudanças repetíveis.

## Como funciona internamente
- **Inventory** define grupos de hosts.
- **Playbook** organiza tarefas por host/group.
- **Modules** executam ações idempotentes.
- **Roles** empacotam variáveis, tasks, handlers e templates.

Fluxo simplificado:
```text
Inventory -> Playbook -> Tasks (modules) -> Estado convergente
```

## Exemplos práticos
```yaml
- hosts: web
  become: true
  roles:
    - role: nginx
  tasks:
    - name: Garantir pacote de observabilidade
      apt:
        name: prometheus-node-exporter
        state: present
```

Executar:
```bash
ansible-playbook -i inventories/prod/hosts.ini site.yml --check
ansible-playbook -i inventories/prod/hosts.ini site.yml
```

## Boas práticas
- Usar `--check` e `--diff` antes de produção.
- Separar variáveis por ambiente (`group_vars/dev`, `group_vars/prod`).
- Proteger segredos com `ansible-vault`.
- Testar roles com Molecule quando possível.

## Armadilhas comuns
- Scripts shell longos dentro de `command`/`shell` em vez de módulos nativos.
- Inventário sem versionamento de ownership por serviço.
- Playbooks não idempotentes (sempre mudam).

## Referências relacionadas
- [[Terraform para Infraestrutura como Código (IaC)]]
- [[Backup, restore e disaster recovery]]
