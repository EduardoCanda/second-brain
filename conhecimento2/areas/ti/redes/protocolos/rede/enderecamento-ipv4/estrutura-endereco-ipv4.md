---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
Um endereço ipv4 é composto por 32 bits, e são esses os responsáveis por definir um endereço IPV4, o protocolo de endereçamento IPV4 vai determinar como será realizado esse endereçamento e sua composição é determinada pela seguinte lógica.

Cada endereço IPV4 pode ser dividido em 4 grupos que serão representados por 8 bits cada grupo, esses 8 bits são denominados octetos e seus valores podem ser representados também de maneira decimal sendo numeros de 0 a 255 em cada octeto, matematicamente falando cada endereço tem um intervalo de 0 a 2^8.
 
Ele é dividido em duas porções, uma representante a divisão de rede em que aquele endereço de ip está localizado e a seguinte porção representando um host, esse endereço pode ser denominado um [[endereco-unicast]], [[endereco-broadcast]] ou um [[endereco-multicast]].
 
Esse endereço também deve possuir uma [[mascara-subrede-decimal]] que pode seguir um formato decimal, ou [[cidr-ipv4]] que representa em forma de / seguido de um valor de 0 a 32, elas representam a quantidades de bits que serão utilizados para representar a rede deste endereço, também é importante ressaltar que quanto mais bits de redes alocados em um determinado endereço, maior será a quantidade de sub redes em que aquela porção de endereçamento comportar e menor será a quatidade de hosts.

 Por haver essa mascara de rede existe um racional simples, quando todos os bits que representam o hosts estiverem zerados, esse endereço será sempre o da rede em questão, quando todos os bits de hosts estiverem preenchidos com 1 este endereço será o de broadcast.
# Representações de endereços IPV4

**Endereço Decimal:** 192.168.15.1
**Endereço Binário:** 11000000.10101000.00001111.00000001
**Mascara de Subrede Decimal:** 255.255.255.0
**Mascara de Subrede CIDR:** /24 (24 bits do endereço serão dedicados para rede)
**Endereço Broadcast:** 192.168.15.255 Adicionando todos bits que representam host com 1(11000000.10101000.00001111.11111111)
**Endereço da Rede:** 192.168.15.0 Zerando todos os bits que representam hosts(11000000.10101000.00001111.00000000)
**Exemplo endereço unicast:** **192.168.15.4/32**

**Endereço Decimal:** 10.0.0.1
**Endereço Binário:** 00001010.00000000.00000000.00000001
**Mascara de Subrede Decimal:** 255.0.0.0
**Mascara de Subrede CIDR:** /8 (8 bits do endereço serão dedicados para rede)
**Endereço Broadcast:** 10.255.255.255 Adicionando todos bits que representam host com 1(00001010.11111111.11111111.11111111)
**Endereço da Rede:** 10.0.0.0 Zerando todos os bits que representam hosts(00001010.00000000.00000000.00000000)
**Exemplo endereço unicast:** **10.0.0.15/32**

# Endereços IP Especiais

![[enderecos-ipv4-especiais.png]]