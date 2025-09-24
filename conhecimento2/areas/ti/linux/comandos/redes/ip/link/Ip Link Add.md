---
tags:
  - Linux
  - Redes
ferramenta: cli
---
O Comando Ip Link Add é utilizado para configurar novas interfaces de redes virtuais, é possível criar uma variedade enorme de dispositivos virtuais, existe um ampla lista de dispositivos possíveis de configurar, mas os principais serão:

1. **Veth (Virtual Ethernet)**
    - Par de interfaces conectadas como um "cabo virtual".
    - Muito usado para comunicação entre namespaces de rede.

2. **Bridge (Ponte)**
    - Funciona como um switch virtual, conectando várias interfaces.

3. **Macvlan**
    - Permite criar interfaces virtuais com endereços MAC únicos na mesma interface física.

4. **Dummy (Interface Fake)**
	- Simula uma interface de rede local sem tráfego real.

5. **Bonding**

	- Agrupa várias interfaces físicas em uma só para redundância ou agregação de banda

A forma de criação pode mudar, pois algumas interfaces virtuais pode requerer argumentos extras durante sua criação então é necesário entender qual o contexto que será criado e quais configurações serão utilizadas para esse propósito.

# Tipos de dispositivos configuráveis

**vrf** - Interface for L3 VRF domains
**amt** - Automatic Multicast Tunneling (AMT)
**bareudp** - Bare UDP L3 encapsulation support
**bond** - Bonding device
**bridge** - Ethernet Bridge device
**can** - Controller Area Network
**dsa** - Distributed Switch Architecture
**dummy** - Dummy network interface
**erspan** - Encapsulated Remote SPAN over GRE and IPv4
**geneve** - GEneric NEtwork Virtualization Encapsulation
**gre** - Virtual tunnel interface GRE over IPv4
**gretap** - Virtual L2 tunnel interface GRE over IPv4
**gtp** - GPRS Tunneling Protocol
**hsr** - High-availability Seamless Redundancy device
**ifb** - Intermediate Functional Block device
**ip6erspan** - Encapsulated Remote SPAN over GRE and IPv6
**ip6gre** - Virtual tunnel interface GRE over IPv6
**ip6gretap** - Virtual L2 tunnel interface GRE over IPv6
**ip6tnl** - Virtual tunnel interface IPv4|IPv6 over IPv6
**ipip** - Virtual tunnel interface IPv4 over IPv4
**ipoib** - IP over Infiniband device
**ipvlan** - Interface for L3 (IPv6/IPv4) based VLANs
**ipvtap** - Interface for L3 (IPv6/IPv4) based VLANs  and TAP
**lowpan** - Interface for 6LoWPAN (IPv6) over IEEE 802.15.4 / Bluetooth
**macsec** - Interface for IEEE 802.1AE MAC Security(MACsec)
**macvlan** - Virtual interface base on link layer address (MAC)
**macvtap** - Virtual interface based on link layer address (MAC) and TAP.
**netdevsim** - Interface for netdev API tests
**nlmon** - Netlink monitoring device
**rmnet** - Qualcomm rmnet device
**sit** - Virtual tunnel interface IPv6 over IPv4
**vcan** - Virtual Controller Area Network interface
**veth** - Virtual ethernet interface
**virt_wifi** - rtnetlink wifi simulation device
**vlan** - 802.1q tagged virtual LAN interface
**vti** - Virtual tunnel interface
**vxcan** - Virtual Controller Area Network tunnel interface
**vxlan** - Virtual eXtended LAN
**xfrm** - Virtual xfrm interface

# Exemplos

Criando uma interface veth

```bash
sudo ip link add veth0 type veth peer name veth1
```

Criando uma bridge

```bash
sudo ip link add br0 type bridge
```

Criando um macvlan associado a uma placa física

```bash
sudo ip link add macvlan0 type macvlan mode bridge link enp5s0
```

Criando uma interface dummy

```bash
sudo ip link add dummy0 type dummy
```