---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando retorna a lista de redes disponíveis, com ele é possível listar todas as redes e especificar qual dispositivos deseja escanear.
# Exemplos

Listando status de dispositivos, especificando qual interface deseja ser utilizada e informando a flag para reenscanear todas as redes disponíveis
```bash
nmcli device wifi list ifname wlp4s0 --rescan yes
```
![[nmcli-device-wifi.png]]