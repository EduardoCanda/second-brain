---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando cria um access point, AP(caso hardware suporte), para desativar esse hotspot é necessário utilizar o comando [[nmcli connection down]], ou [[nmcli device disconnect]]

# Exemplos

Criando hotspot simples. 

```bash
nmcli device wifi hotspot ifname wlp4s0 ssid "LucasBerti" password 12345678 con-name "Hotspot Berti"
```