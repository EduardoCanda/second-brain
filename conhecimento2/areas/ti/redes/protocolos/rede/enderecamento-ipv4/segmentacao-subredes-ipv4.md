---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
Quando recebemos um bloco de endereçamento ip, podemos segmentar esse bloco em um determinado número de subredes, por exemplo. Imagine que recebemos um bloco com o seguinte prefixo 10.0.0.0/8 ao observar esse endereço podemos verificar algumas informações como:

*  O Endereço em questão se trata de um endereço de rede, já que todos os bits que representam os hosts(24 bits) estão zerados (00000000.00000000.00000000).
* Os primeiros digitos deste endereço representa a rede (10 ou 00001010).
* Está rede tem a capacidade de ter 2^24 endereços ou seja, 16777216 endereços disponíveis sendo destes 1 que represente a rede (**10.0.0.0** 00001010.00000000.00000000.00000000) e um que represente o broadcast desta rede **10.255.255.255**(00001010.11111111.11111111.11111111), possibilitando 16777214 endereços de hosts disponíveis.
* Por se tratar de um bloco único, possuí apenas uma rede, vamos apelidar esse bloco de "bloco sólido".

Sabendo dessas informações podemos segmentar esse endereço recebido, com isso podemos separar essa rede "/8" em algumas subredes, com isso podemos segregar esses espaços em redes menores como no exemplo abaixo podemos observar.

# Segmentando um bloco em 2 subredes

Vamos separar essa rede 10.0.0.0/8 em duas seguindo os seguintes passos.

1. Primeiramente como recebemos nosso "bloco sólido" contendo um /8, a partir do primeiro bit do segundo octeto podemos reservar ele para representação de uma nova rede.
2. Com isso podemos agora ter uma nova rede que será representada com a seguinte mascara: /9 ou 255.128.0.0.
3. È importante ressaltar que os bits reservados para rede serão sempre da direita para esquerda, e os bits representantes do hosts serão sempre os que restarem naquele octeto em questão.

Ao reservar o bit 1 do segundo octeto agora temos a possíbilidade de usar ele para representar redes, existe um calculo simples que podemos utilizar para saber quantos endereços de redes disponíveis temos a partir dessa segmentação que seguirá a seguinte lógica.

Vamos usar a potência de 2 equivalente ao numero de bits alocados para rede dentro de nosso bloco sólido, e com isso temos o seguinte calculo.
2^1 = 2 Novas subredes, com isso vamos observar como ficaria essas redes.

1. **Endereço Decimal:** 10.0.0.0
	**Endereço Binário:** 11000000.00000000.00000000.00000000
	**Mascara de Subrede Decimal:** 255.128.0.0
	**Mascara de Subrede CIDR:** /9 (9 bits do endereço serão dedicados para rede)
	**Endereço Broadcast:** 10.127.255.255 Adicionando todos bits que representam host com 1(00001010.01111111.11111111.11111111)
	**Endereço da Rede:** 10.0.0.0 Zerando todos os bits que representam hosts(00001010.00000000.00000000.00000000)
	**Quantidade de hosts na rede:** 8388606 ou 2^23-2 (Excluindo endereço da rede e do broadcast)

2. **Endereço Decimal:** 10.128.0.0
	**Endereço Binário:** 11000000.10000000.00000000.00000000
	**Mascara de Subrede Decimal:** 255.128.0.0
	**Mascara de Subrede CIDR:** /9 (9 bits do endereço serão dedicados para rede)
	**Endereço Broadcast:** 10.255.255.255 Adicionando todos bits que representam host com 1(00001010.11111111.11111111.11111111)
	**Endereço da Rede:** 10.128.0.0 Zerando todos os bits que representam hosts(00001010.10000000.00000000.00000000)
	**Quantidade de hosts na rede:** 8388606 ou 2^23-2 (Excluindo endereço da rede e do broadcast)

# Segmentando o mesmo bloco em 4 subredes

Essa lógica vai se persistir pelo numero de subredes que desejarmos, basta adicionar novos bits para serem utilizados como representantes da rede, no nosso exemplo usamos o /9, mas poderiamos alocar mais um bit formando um /10, derivado de nosso bloco sólido 10.0.0.0/8. Com isso teriamos a possibilidade de ter agora 4 subredes que seriam respectivamente:

1. **Endereço:** 10.0.0.0/10
	**Mascara de Subrede Decimal:** 255.192.0.0
    **Endereço Binário:** 00001010.**00000000**.00000000.00000000 
    **Endereço Broadcast:** **10.63.255.255**
    **Endereço Broadcast Binário:** 00001010.**00111111**.11111111.11111111
    **Quantidade de Hosts:** 2^22-2 4194302

2. **Endereço:** 10.64.0.0/10
	**Mascara de Subrede Decimal:** 255.192.0.0
    **Endereço Binário:** 00001010.01000000.00000000.00000000 
    **Endereço Broadcast:** 10.127.255.255
    **Endereço Broadcast Binário:** 00001010.**01111111**.11111111.11111111
    **Quantidade de Hosts:** 2^22-2 4194302

3. **Endereço:** 10.128.0.0/10
	**Mascara de Subrede Decimal:** 255.192.0.0
    **Endereço Binário:** 00001010.10000000.00000000.00000000
    **Endereço Broadcast:** 10.191.255.255
    **Endereço Broadcast Binário:** 00001010.10111111.11111111.11111111
    **Quantidade de Hosts:** 2^22-2 4194302

4. **Endereço:** 10.192.0.0/10
	**Mascara de Subrede Decimal:** 255.192.0.0
    **Endereço da Rede Binário:** 00001010.**11000000**.00000000.00000000 
    **Endereço Broadcast:** **10.255.255.255**
    **Endereço Broadcast Binário:** 00001010.**11111111**.11111111.11111111
    **Quantidade de Hosts:** 2^22-2 4194302

