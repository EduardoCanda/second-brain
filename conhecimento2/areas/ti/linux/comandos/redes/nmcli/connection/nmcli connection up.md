---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para ativar uma conexão, é possível usar diversos indentificadores para essa finalidade, como por exemplo o identificador da interface de rede, nesse caso o [[NetworkManager]] iŕa escolher uma conexão automaticamente a melhor conexão para a inferface desejada.

È importante verificar se a conexão foi ativada atravez do comando [[nmcli connection show]]
# Exemplos

Ativando o perfil de conexão Fisica

```bash
nmcli connection up Fisica
```

Ativando alguma conexão na interface enp5s0
```bash
nmcli connection up ifname enp5s0
```
