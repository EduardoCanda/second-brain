---
tags:
  - Linux
  - Redes
ferramenta: cli
---

O Comando é utilizado para gerir interfaces de rede, tanto ethernet, wifi e dispositivos virtuais, ao executar esse comando por padrão é executado o comando [[nmcli device status]].

# Comandos

[[nmcli device show]]
[[nmcli device status]]
[[nmcli device connect]]
[[nmcli device set]]
[[nmcli device disconnect]]
[[nmcli device reapply]]
[[nmcli device delete]]
[[nmcli device wifi]]
[[nmcli device wifi list]]
[[nmcli device wifi show-password]]
[[nmcli device wifi connect]]
[[nmcli device wifi hotspot]]

# Exemplos


## Listando dispositivos wifi
```bash
nmcli device wifi list
```
![[nmcli-device-wifi-list.png]]
Conectando em uma rede wifi via terminal
```bash
nmcli device wifi connect "NomeDaRede" password "Senha"
```