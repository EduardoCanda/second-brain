---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---

O Comand retorna o status atual de todas interfaces de rede e por padrão, quano executamos somente o comando nmcli device, o status já é executado por padrão, ele irá exibir sempre o tipo do dispositivo e a conexão associada ao mesmo.

# Exemplos

Listando status de dispositivos
```bash
nmcli device status
```
![[nmcli-device-status.png]]
Listando status de dispositivos(suprimido)
```bash
nmcli device 
```
![[nmcli-device.png]]