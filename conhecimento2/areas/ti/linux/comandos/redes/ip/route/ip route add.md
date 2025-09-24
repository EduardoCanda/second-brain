---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para adicionar rotas na tabela de roteamento do sistema, ele segue o mesmo padrão do comando [[ip route delete]], e recebe diversas opções para essa ação.

È fundamental conhecer os fundamentos de [[roteamento]] para entender em sua completude, é possível adicionar rotas para redes, hosts específicos e hosts na internet com esse comando além de ser estremamente útil para entender o sistema de rotas no linux.
# Exemplos

Adicionando uma rota padrão para acesso a internet via o gateway 192.168.15.1 na interface enp5s0

```bash
ip route add default via 192.168.15.1 dev enp5s0 
```

Adicionando uma rota para uma rede especifica que passe pelo gateway 192.168.15.1

```bash
ip route add 10.10.10.0/24 via 192.168.15.1 dev enp5s0
```

Criando uma rota para uma rede que estamos conectados diretamente sem a necessidade de um [[areas/ti/redes/conceitos-fundamentais/gateway]].

```bash
ip route add 192.168.15.0/24 dev enp5s0
```

Criando duas rotas para acesso a internet, uma para uma rede wifi com prioridade menor e outra para ethernet com prioridade maior

```bash
ip route add default via 192.168.15.1 dev enp5s0 metric 100
ip route add default via 192.168.15.1 dev wlp4s0 metric 200
```

Criando uma rota específica para um [[endereco-unicast]] com gateway.

```bash
ip route add 8.8.8.8 via 192.168.15.1 dev enp5s0
```

Criando uma rota em uma tabela específica, util para politicas de roteamento avançadas [[ip rule]]

```bash
ip route add 10.10.10.0/24 via 192.168.15.1 dev enp5s0 table 100
```

Criando uma rota para um endereço um [[endereco-unicast]] sem gateway

```bash
ip route add 192.168.1.50 dev enp5s0
```
