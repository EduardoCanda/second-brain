---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para adicionar rotas a nossa tabela de roteamento, a sintaxe é exatamente igual ao comando [[ip route add]], porém caso exista uma rota para o endereço destino, será adicionada uma nova rota em conjunto, no comando [[ip route add]] ocorre um erro nesse cenário pois a rota já existe, é sempre importante ser bem explicito nessa alteração de rotas.
# Exemplos

Adicionando uma rota default alternativa.

```bash
sudo ip route append default via 192.168.15.1 dev enp5s0 proto dhcp src 192.168.15.12 metric 600 
```