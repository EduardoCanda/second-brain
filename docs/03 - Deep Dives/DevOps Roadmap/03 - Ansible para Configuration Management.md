# Ansible para configuration management

## Objetivo
Padronizar configuração de servidores e apps sem acesso manual repetitivo.

## Conceitos-chave
- **Inventory**: lista de hosts.
- **Playbooks**: automações declarativas.
- **Roles**: organização reutilizável.
- **Idempotência**: executar N vezes com o mesmo resultado.

## Exemplo simples
```yaml
- hosts: web
  become: true
  tasks:
    - name: Instalar nginx
      apt:
        name: nginx
        state: present
```

## Boas práticas
- Separar roles por responsabilidade (`base`, `security`, `app`).
- Usar `ansible-vault` para segredos.
- Testar com ambiente de staging antes de produção.
