---
tags:
  - Linux
  - Redes
  - Laboratorio
  - NotaPermanente
categoria: namespaces
---
Um estilo de configuração que podemos realizar é criando uma comunicação entre [[Namespaces de Rede]] através de uma bridge(ponte), é uma alternativa quando precisamos criar um rede complexa entre vários namespaces, com isso podemos ter uma opção interessante em que teremos uma introdução a redes mais complexas.

# Criando namespaces 

Inicialmente iremos criar os namespaces que serão utilizados para esse laboratório, o comando é relativamente simples, em seguidas já podemos visualizar os namespaces criados.

```bash
sudo ip netns add namespace1
sudo ip netns add namespace2
sudo ip netns add namespace3
sudo ip netns show
```

# Criando os veth pair

O Próximo passo será criar uma comunicação entre esses namespaces, e para isso iremos utilizar o comando [[Ip Link Add]] inicialmente para criar uma interface de rede virtual veth, da mesma forma para consultar se essas interfaces de rede foram criadas basta executar o comando [[Ip Link Show]]

```bash
sudo ip link add vethns1 type veth peer name vethns1p
sudo ip link add vethns2 type veth peer name vethns2p
sudo ip link add vethns3 type veth peer name vethns3p

sudo ip link show
```


# Criando a bridge

O Proximo passo é criar nossa bridge com o comando [[Ip Link Add]]

```bash
sudo ip link add bridge1 type bridge
```

# Associando os pares de veth a bridge e aos respectivos namespaces, e ativando tudo

Agora devemos associar uma ponta do veth pair ao nossa bridge, e ativar todos os componentes virtuais, tanto no host quant
```bash
sudo ip link set vethns1 netns namespace1
sudo ip link set vethns2 netns namespace2
sudo ip link set vethns3 netns namespace3

sudo ip link set vethns1p master bridge1
sudo ip link set vethns2p master bridge1
sudo ip link set vethns3p master bridge1

sudo ip link set dev bridge1 up

sudo ip link set dev vethns1p up
sudo ip link set dev vethns2p up
sudo ip link set dev vethns3p up

sudo ip netns exec namespace1 ip link set dev vethns1 up
sudo ip netns exec namespace2 ip link set dev vethns2 up
sudo ip netns exec namespace3 ip link set dev vethns3 up



```

# Endereçando as interfaces virtuais

Após associar as interfaces virtuais podemos endereçar essas redes com o comando [[Ip Address Add]], com isso usaremos uma rede /24, lembrando sempre de usar o nosso querido comando [[Ip Netns Exec]].

```bash
sudo ip netns exec namespace1 ip address add dev vethns1 10.0.0.1/24 brd 10.0.0.255 valid forever preferred forever label vethns1:1 

sudo ip netns exec namespace2 ip address add dev vethns2 10.0.0.2/24 brd 10.0.0.255 valid forever preferred forever label vethns2:1 

sudo ip netns exec namespace3 ip address add dev vethns3 10.0.0.3/24 brd 10.0.0.255 valid forever preferred forever label vethns3:1 

```


# Verificando conectividade entre os namespaces

Após toda essa configuração basta executar um teste de comunicação entre os dois namespace, basta executar o comando [[ping]] em qualquer um dos dois namespaces.

```bash
sudo ip netns exec namespace1 ping 10.0.0.2
sudo ip netns exec namespace2 ping 10.0.0.3
sudo ip netns exec namespace3 ping 10.0.0.1
```

# Apagando os namespaces, interfaces e bridges de dentro para fora

Podemos iniciar nossa limpeza, excluindo as interfaces de dentro do nosso, iremos desativar as interfaces, excluir os endereços, excluir as interfaces, excluir os namespaces e também excluir as bridges. Vamos usar os comandos combinando os comando conforme necessidade.

```bash

#Desativando interfaces
sudo ip netns exec namespace1 ip link set dev vethns1 down
sudo ip netns exec namespace2 ip link set dev vethns2 down
sudo ip netns exec namespace3 ip link set dev vethns3 down

#Excluindo endereçamento IPV4
sudo ip netns exec namespace1 ip address delete 10.0.0.1/24 dev vethns1
sudo ip netns exec namespace2 ip address delete 10.0.0.2/24 dev vethns2
sudo ip netns exec namespace3 ip address delete 10.0.0.3/24 dev vethns3

# Excluindo interfaces de redes virtuais
sudo ip netns exec namespace1 ip link delete dev vethns1
sudo ip netns exec namespace2 ip link delete dev vethns2
sudo ip netns exec namespace3 ip link delete dev vethns3

# Apagando os namespaces
sudo ip netns delete namespace1 
sudo ip netns delete namespace2
sudo ip netns delete namespace3

# Apagando bridge
sudo ip link delete dev bridge1


```

# Comando utilizados no laboratório
 * [[Ip Netns Add]]
 * [[Ip Netns Delete]]
  * [[Ip Netns Exec]]
  * [[Ip Netns Show]]
  * [[Ip Link Add]]
  * [[Ip Link Set]]
  * [[Ip Link Delete]]
  * [[Ip Link Show]]
  * [[Ip Address Add]]
  * [[Ip Address Show]]
  * [[Ip Address Delete]]