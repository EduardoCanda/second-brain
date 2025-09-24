---
tags:
  - Linux
  - Redes
ferramenta: cli
---
O Comando Ip Address Change é utilizado para alterar configurações de ips, com ele é possível alterar algumas configurações de endereço informado sem que haja indisponibilidade, por exemplo podemos alterar o tempo de expiração de um ip sem que haja impacto nas conexões ativas


# Exemplos

Alterando tempo de expiração e tempo de validade de um ip

```bash
sudo ip address change 192.168.15.50/24 dev enp5s0 valid_lft 300 preferred_lft 150
```