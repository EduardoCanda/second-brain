---
tags:
  - Linux
  - Redes
ferramenta: cli
---
O Comando ip address add é utilizado para criar uma configuração de endereçamento de ip e atrelar esta a uma interface de rede, com ele podemos especificar escopo que esse ip atuara, broadcast da rede, labels de ip, configurações de validade e também timeout.
# Exemplos

## Criando um ip segundário e especificando broadcast 

Criando um endereço ip segundário na interface enp5s0, e associando broadcast a essa rede.
```bash
sudo ip a add 192.168.15.50/24 broadcast 192.168.15.255 dev enp5s0 secondary
```

Mesma configuração acima, porém adicionando tempo de expiração e obsolecencia.
```bash
sudo ip a add 192.168.15.50/24 broadcast 192.168.15.255 dev enp5s0 secondary valid_lft 3600 preferred_lft 1800
```

Criando um endereçamento ip na interface enp5s0, em caso de reinicialização da maquina, a configuração não irá se perder.
```bash
sudo ip addr add 192.168.15.50/24 dev enp5s0 permanent
```

## Especificando escopos

Configurando um ip com [[escopo-enderecos|escopo]] somente de host, ou seja a somente a maquina terá acesso a esse endereço:
```bash
sudo ip a add 192.168.15.50/24 dev enp5s0 scope host
```

Configurando ip com escopo global, deixando disponível o acesso de qualquer lugar

```bash
sudo ip addr add 192.168.15.50/24 dev enp5s0 scope global
```

 Endereço com escopo `link`, esse endereço não pode ser roteado, será somente acessível na mesma rede que foi associado.

```bash
sudo ip addr add fe80::1/64 dev eth0 scope link
```

Pra finalizar usar o scope nowhere, torna esse ip inacessível em qualquer lugar, ou seja, é registrado o endereço porém não pode haver comunicação (caso raro).

```bash
sudo ip addr add 192.168.1.150/24 dev eth0 scope nowhere
```

## Associando ips com rotulos

Podemos ao criar ip associar um rotulo a esta configuração de endereçamento, em  alguns lugares é dito "alias", porém a idéia é a mesma, ao adicionar um rotulo, é possível visualizar o mesmo ao rodar o comando show, e ainda podemos usar esse para regras de [[roteamento]], [[firewall]] e simulação de [[interfaces-redes-logicas]], isso pode ser útil por exemplo em caso de servidores que só possuam uma interface [[NIC]]

```bash
sudo ip a add 192.168.15.50/24 \
	broadcast 192.168.15.255 \
	dev enp5s0 \
	label enp5s0:1 \
	scope global \
	valid_lft 60 \
	preferred_lft 30 \
	secondary 
```


