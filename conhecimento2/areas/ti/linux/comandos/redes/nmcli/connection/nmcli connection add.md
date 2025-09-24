---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para criar uma conexão diretamente, sem interação com terminal, ideia muito parecida com o comando [[nmcli connection modify]] ele recebe diversos argumentos para essa criação, já que não haverá interação com o terminal a ideia é receber o máximo de parametros possíveis para criação da conexão,.
# Exemplos

Criando uma conexão com parametros básicos para sua criação, é possível especificar outras configurações, para mais informações acesse [aqui](https://manpages.org/nm-settings/5)
```bash
nmcli connection add type ethernet con-name Fisica ifname enp5s0 autoconnect yes save yes mtu 1500 cloned-mac "30-6C-7F-ED-E2-88" ipv4.addresses 192.168.15.18
```