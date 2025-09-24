---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando Ip Link Set é utilizado para alterar parametros de uma determinada interface de rede, conseguimos ativar, desativar, atualizar, renomear e varias outras operações que envolvem modificação de uma interface de rede, inclusive alterar o mac address da interface logicamente.

Podemos também trabalhar com interfaces de rede virtual, havendo uma enorme combinação de possibilidades para utilização deste conceito como por exemplo trabalhar com veth e bridges.

# Exemplos

Ativando uma interface de rede

```bash
ip link set dev enp5s0 up
```

Desativando uma interface de rede

```bash
ip link set dev enp5s0 down
```

Renomeando uma interface de rede, é importante ressaltar que essa interface deve estar down antes de ser renomeada

```bash
ip link set dev enp5s0 down
ip link set dev enp5s0 name cabeada1
ip link set dev enp5s0 up
```

Atualizando o [[mtu]] da rede

```bash
ip link set dev enp5s0 mtu 1400
```

Atualizando o mac address da interface de rede

```bash
ip link set dev enp5s0 address 00:11:22:33:44:55
```

Atribuindo uma interface(veth) de rede virtual a um namespace

```bash
ip link set veth0 netns ns1 
```

Atribuindo uma interface virtual (veth pair) a uma bridge, nesse caso a bridge será o [[dispositivo-master]]

```bash
ip link set br-ns2 master br0
```

Podemos também desvincular esse veth, dessa bridge

```bash
ip link set br-ns2 nomaster
```

Ativando modo promíscuo para capturar todos os pacotes na rede

```bash
ip link set eth0 promisc on
```
Isso permite que `eth0` receba todos os pacotes, útil para ferramentas como Wireshark e tcpdump.
 
Desativar modo promíscuo

```bash
ip link set eth0 promisc off
```