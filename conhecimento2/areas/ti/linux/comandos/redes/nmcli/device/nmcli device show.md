---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---

O Comando é utilizado para exibir o status de dispositivos, por padrão caso não seja informado nenhuma interface ele irá listar todas interfaces, ele imprime as informações da conexão configurada em cada interface de rede configurada.
# Exemplos

Listando todos dispositivos
```bash
nmcli device show
```
![[nmcli-device-show.png]]
Listando dispositivo específico
```bash
nmcli device show enp5s0
```
![[nmcli-device-show-enp5s0.png]]