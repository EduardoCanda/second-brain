---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---

+O Comando é utilizado para apagar rotas, sua utilização é bem simples porém existem alguns detalhes que iremos explorar, ele segue o mesmo padrão do comando [[ip route add]], porém a diferença é sua ação, quanto mais específica for a seleção menor a chance de erros.

Existem casos que caso uma rota seja redundante, a primeira ocorrencia na tabela de roteamento será apagada, então é importante criar um "query", que direcione para a rota desejada.

# Exemplos

Apagando a rota padrão que utiliza o gateway 192.168.15.1 na interface enp5s0 que foi criada automáticamente pelo kernel e corresponde a metrica 100
```bash
ip route delete default \
via 192.168.15.1 \ 
dev enp5s0 \
scope kernel \
metric 100
```