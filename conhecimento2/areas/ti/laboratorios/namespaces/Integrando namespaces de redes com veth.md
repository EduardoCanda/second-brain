---
tags:
  - Linux
  - Laboratorio
  - Redes
  - NotaPermanente
categoria: namespaces
---
Para reforçar o conhecimento em redes e namespaces de redes iremos integrar todos esses conhecimentos através de um exemplo simples porém objetivo, iremos realizar a configuração de namespaces que irão se comunicar através de uma rede virtual, ao longo deste exemplo iremos aumentar a complexidade do exemplo.

Para esse laboratório iremos utilizar os comandos como [[Ip Link]], [[ip Netns]], [[ip-address]] e variações destes também.

# Criando namespaces 

Inicialmente iremos criar os namespaces que serão utilizados para esse laboratório, o comando é relativamente simples

```bash
sudo ip netns add namespace1
sudo ip netns add namespace2
```

Para validar se os mesmos foram criados basta executar

```bash
sudo ip netns show
```

# Criando o veth pair

O Próximo passo será criar uma comunicação entre esses namespaces, e para isso iremos utilizar o comando [[Ip Link Add]] para criar uma interface de rede virtual veth

```bash
sudo ip link add veth0 type veth peer name veth1
```
Da mesma forma para consultar se essas interfaces de rede foram criadas basta executar o comando [[Ip Link Show]]

```bash
sudo ip link show dev veth0
sudo ip link show dev veth1
```

# Atribuindo as interfaces de rede aos respectivos namespace

Após criar os namespaces e os veth pair, podemos associar estes utilizando o comando [[Ip Link Set]].

```bash
sudo ip link set veth0 netns namespace1
sudo ip link set veth1 netns namespace2
```
Feito isso podemos agora verificar se as mesmas estão disponíveis os respectivos namespaces usando o comando [[Ip Netns Exec]]

```bash
sudo ip netns exec namespace1 ip link show dev veth0
sudo ip netns exec namespace2 ip link show dev veth1
```

# Atribuindo endereçamento de ip as interfaces internas ao namespaces

Mesmo após criar as interfaces, associar elas aos namespaces ainda sim elas permanecem desativadas e sem [[protocolo-enderecamento-ipv4]] atribuido, para isso iremos usar o comando [[Ip Address Add]], para adicionar endereçamento nas redes que criamos, é importante ressaltar que iremos utilizar estes comando dentro do contexto do namespace com o comando [[Ip Netns Exec]].

```bash
sudo ip netns exec namespace1 ip address add 10.0.0.1/24 brd 10.0.0.255 dev veth0 label veth0:first valid forever preferred forever

sudo ip netns exec namespace2 ip address add 10.0.0.2/24 brd 10.0.0.255 dev veth1 label veth1:first valid forever preferred forever
```
Para conferir o endereçamento que criamos basta executar o comando [[Ip Address Show]].

```bash
sudo ip netns exec namespace1 ip address show dev veth0
sudo ip netns exec namespace2 ip address show dev veth1
```

## Ativando as interfaces de redes nos respectivos namespaces

Para ativar as interfaces de redes iremos utilizar o comando [[Ip Link Set]]

```bash
sudo ip netns exec namespace1 ip link set up dev veth0
sudo ip netns exec namespace2 ip link set up dev veth1
```

Para verificar se a interface está ativa basta usar o comando [[Ip Link Show]], lembrando sempre de executar ele no contexto do namespace.

```bash
sudo ip netns exec namespace1 ip link show dev veth0
sudo ip netns exec namespace2 ip link show dev veth1
```

# Verificando conectividade entre os namespaces

Após toda essa configuração basta executar um teste de comunicação entre os dois namespace, basta executar o comando [[ping]] em qualquer um dos dois namespaces.

```bash
sudo ip netns exec namespace2 ping 10.0.0.1
```

# Apagando os namespaces

Após todos os testes, para excluir os namespaces basta executar o comando [[Ip Netns Delete]], ao excluir os namespaces os veth pairs também são excluídos.

```bash
sudo ip netns delete namespace1
sudo ip netns delete namespace2
```

# Comando utilizados no laboratório
 * [[Ip Netns Add]]
 * [[Ip Netns Delete]]
  * [[Ip Netns Exec]]
  * [[Ip Netns Show]]
  * [[Ip Link Add]]
  * [[Ip Link Set]]
  * [[Ip Link Show]]
  * [[Ip Address Add]]
  * [[Ip Address Show]]
  * [[Ip Address Delete]]