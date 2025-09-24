---
tags:
  - Linux
  - Redes
ferramenta: cli
---
O Comando Ip Address replace é utilizado para alterar/criar configurações de ips, com ele é possível alterar algumas configurações de endereço informado sem que haja indisponibilidade, por exemplo podemos alterar o tempo de expiração de um ip sem que haja impacto nas conexões ativas, caso o ip destino na interface destino não exista ele irá criar.


# Exemplos

Alterando tempo de expiração e tempo de validade de um ip, caso o ip não exista ele será criado

```bash
sudo ip address replace 192.168.15.50/24\
	dev enp5s0\
	valid_lft 5\
	preferred_lft 4\
	label enp5s0:a
```