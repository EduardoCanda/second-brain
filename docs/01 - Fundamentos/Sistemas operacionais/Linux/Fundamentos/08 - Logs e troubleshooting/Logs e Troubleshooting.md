## Conceito Central

Troubleshooting não é adivinhação.  
É **método**.

Sempre responder:
1. O que quebrou?
2. Quando quebrou?
3. Onde quebrou?
4. Por que quebrou?

Logs são a principal fonte de verdade.

---

## Onde ficam os Logs

### systemd (padrão moderno)
- Logs centralizados no journal
- Acesso via `journalctl`

### Diretórios clássicos
- `/var/log/syslog`
- `/var/log/auth.log`
- `/var/log/kern.log`
- `/var/log/dmesg`

---

## journalctl (essencial)

Comandos básicos:
- `journalctl`
- `journalctl -f`
- `journalctl -b`
- `journalctl -u serviço`

Filtros úteis:
- `--since`
- `--until`
- `-p err`

---

## Logs de Boot

- `journalctl -b`
- `journalctl -b -1`
- `dmesg`

Úteis para:
- Problemas de inicialização
- Drivers
- Hardware

---

## Logs de Serviços

- `systemctl status serviço`
- `journalctl -u serviço`

Sempre começar pelo status.

---

## Logs de Autenticação

- `/var/log/auth.log`

Usado para:
- SSH
- sudo
- falhas de login

---

## Logs de Kernel

- `dmesg`
- `/var/log/kern.log`

Mostram:
- Erros de hardware
- Problemas de driver
- Falhas de filesystem

---

## Logs de Aplicação

Dependem da aplicação:
- stdout / stderr
- Arquivos próprios
- journal

Em containers:
- `docker logs`

---

## Ferramentas de Diagnóstico

### Processos
- `ps`
- `top`
- `htop`

### Recursos
- `free`
- `vmstat`
- `iostat`
- `df -h`
- `du -sh`

### Rede
- `ss`
- `ip`
- `ping`
- `traceroute`
- `curl`

---

## Método de Troubleshooting

### Ordem recomendada
1. O processo está rodando?
2. O serviço está ativo?
3. Há erro nos logs?
4. Recursos estão esgotados?
5. Rede está ok?
6. Permissões corretas?

---

## Problemas Comuns

### Serviço não sobe
- Erro no unit file
- Porta ocupada
- Permissão incorreta

### Aplicação cai
- OOM Killer
- Exceção não tratada
- Falha de dependência

### Sistema lento
- Swap excessivo
- I/O alto
- Processo travado (D state)

---

## OOM Killer

- Kernel mata processo por falta de memória
- Log aparece no journal
- Muito comum em containers

---

## Debug em Produção

Boas práticas:
- Não apagar logs
- Não reiniciar sem entender causa
- Capturar evidências
- Agir com mínimo impacto

---

## Erros Comuns

- Reiniciar como primeira ação
- Ignorar logs do kernel
- Focar só na aplicação
- Não correlacionar tempo

---

## Regra Prática

Logs contam a história.  
Seu trabalho é **ler a história certa**.
