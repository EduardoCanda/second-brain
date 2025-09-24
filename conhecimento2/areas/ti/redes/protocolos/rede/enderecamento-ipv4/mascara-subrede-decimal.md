---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
O Formato decimal em mascaras de redes pode ser representado por um endereço de ip que represente a quantidade de bits utilizados para rede, ele é uma alternativa de representação a o sistema [[cidr-ipv4]].

O Racional é simples, ele irá apresentar a somatória dos bits representados em base decimal, ou seja, caso haja necessidade de utilizar 2 bits para representação de uma rede o valor que irá representar essa mascara será 128 + 64 = 192. 

È importante lembrar que os as mascaras sempre irão utilizar bits da direita para esquerda, e os bits resultantes serão utilizados para identificação de hosts.

# Exemplos

255.0.0.0
255.255.0.0
255.255.255.0