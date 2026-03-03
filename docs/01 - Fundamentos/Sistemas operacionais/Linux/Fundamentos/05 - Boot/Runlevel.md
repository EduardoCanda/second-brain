## Definição
Runlevel define o modo de operação do sistema Linux, determinando quais serviços são iniciados.

## Runlevels clássicos (SysV)
- 0: desligamento
- 1: modo single-user
- 3: multi-user sem GUI
- 5: multi-user com GUI
- 6: reboot

## systemd e targets
O systemd substituiu runlevels por targets.

| Runlevel antigo | systemd target    |
| --------------- | ----------------- |
| 0               | poweroff.target   |
| 1               | rescue.target     |
| 3               | multi-user.target |
| 5               | graphical.target  |
| 6               | reboot.target     |

### Equivalência
- multi-user.target ≈ runlevel 3
- graphical.target ≈ runlevel 5
- rescue.target ≈ runlevel 1

## Comandos úteis
- systemctl get-default
- systemctl set-default multi-user.target
- systemctl isolate rescue.target

## Uso prático
- troubleshooting
- servidores sem GUI
- recuperação do sistema
