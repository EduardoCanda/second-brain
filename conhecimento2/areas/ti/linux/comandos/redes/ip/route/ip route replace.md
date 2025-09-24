---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para adicionar/substituir rotas a nossa tabela de roteamento, a sintaxe é exatamente igual ao comando [[ip route add]], porém caso não exista uma rota para o endereço destino, será adicionada uma nova rota, no comando [[ip route add]] é retornado um erro pois a rota já existe, e em caso de existencia da rota ela será sobre-escrita.

# Exemplos
Alterando o dispositivo alvo de uma rota existente, anteriormente essa rota estava sendo direcionada para o dispositivo wlp4s0, caso a rota não existisse o comando criaria a mesma.
```bash
sudo ip route replace default via 192.168.15.1 dev enp5s0 proto dhcp src 192.168.15.12 metric 600
```