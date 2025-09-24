---
tags:
  - Linux
  - Redes
  - NotaPermanente
ferramenta: cli
---
O Comando é utilizado para gerir rotas, podemos visualizar, apagar, criar, modificar rotas, ou seja, gestão de rotas de maneira geral, para entender mais sobre rotas acesse [[roteamento|aqui]], muitas operações com esse comando tem sinergia com os comandos e conceitos de [[ip-address]] e [[Ip Link]].

Outro tema importante de entender é a respeito de [[areas/ti/redes/conceitos-fundamentais/gateway]], e como ele se comporta em nossas configurações de roteamento.

As queries de alteração/criação/substituição devem seguir sempre um padrão explicito, então é sempre bom consultar a rota para montar uma operação consistente.

De uma certa forma para entender como esse comando funciona, é necessário antes entender um pouco dos outros comandos do programa [[Areas/TI/Redes/Protocolos/Pilha de Protocolos TCP/IP]], pois isso é a porta de entrada para uma compreensão mais avançada sobre esse tema.

# Manual do comando

[manual](https://www.man7.org/linux/man-pages/man8/ip-route.8.html)
# Comandos para navegação
[[ip route show]]
[[ip route get]]
# Comandos de gestão
[[ip route add]]
[[ip route delete]]
[[ip route change]]
[[ip route append]]
[[ip route replace]]
[[ip route flush]]
# Comandos de backup
[[ip route save]]
[[ip route restore]]

