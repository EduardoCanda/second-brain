---
tags:
  - Linux
  - Redes
  - NotaBibliografica
categoria: namespaces
ferramenta: cli
---
O Comando exec é utilizado para executar comando dentro de um namespace de rede

# Exemplo

Executando um comando dentro do namespace1
```bash
sudo ip netns exec namespace1 ip link show
```