---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para modificar uma roita existente, a sintaxe é exatamente igual ao comando [[ip route add]], porém ele não irá criar uma rota nova, somente alterar caso a rota já exista, se não existir ocorrerá um erro, diferente do comando [[ip route replace]].


# Exemplos
Alterando o dispositivo alvo de uma rota existente, anteriormente essa rota estava sendo direcionada para o dispositivo wlp4s0
```bash
sudo ip route change default via 192.168.15.1 dev enp5s0 proto dhcp src 192.168.15.12 metric 600
```