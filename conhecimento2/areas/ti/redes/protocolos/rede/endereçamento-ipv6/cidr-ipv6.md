---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
categoria: protocolo
---
Da mesma forma como no [[cidr-ipv4]], a representação do CIDR no [[endereços-publicos-privados-ipv6]] funciona da mesma forma, a representação segue um padrão de /{N_BITS}, então podemos representar dessa forma, considerando que os algarismos hexadeciamais em verde serão os utilizados para representar a rede.

**Exemplo de Representação CIDR:**<span style="color: green">2561:1900:4545:00</span>03::/56
**Primeiro Endereço da Rede:** <span style="color: green">2561:1900:4545</span>::/56
**Ultimo Endereço da Rede:** <span style="color: green">2561:1900:4545:</span>FF:FFFF:FFFF:FFFF:FFFF/56

Nesse exemplo, temos uma mascara em bits que representa multiplos de 4, ou seja, nesse caso vamos ter sempre algarismos hexadecimais inteiros dedicados para representação de rede, porém existem alguns cenários que teremos um problema. e para resolver esse problema podemos dividir o numero de bits que representem a rede **(CIDR)** por 4, assim podendo obter a quantidade de bits fracionadas como no exemplo abaixo:

**Exemplo de Representação CIDR:**<span style="color: green">2561:1900:4545:00</span><span style="color: yellow">0</span>3::/57
**Primeiro Endereço da Rede:** <span style="color: green">2561:1900:4545</span>::/57
**Ultimo Endereço da Rede:** <span style="color: green">2561:1900:4545:</span><span style="color: yellow">7</span>F:FFFF:FFFF:FFFF:FFFF/57

Para entender como iremos utilizar algarismo hexadecimal que represente o basta dividir o numero de bits por 4, a cada 0.25 podemos representar por 1 bit dentro daquele algarismo hexadecimal, como no exemplo abaixo:

**Calculo Utilizado:** 57 / 4 = 14,25
**Racional:** Iremos utilizar 14 algarismos hexadecimais, no próximo algarismo (15), iremos utilizar somente o primeiro bit a esquerda, o restante será utilizado para representar os hosts daquele rede

**Algarismo de exemplo:** 0
**Representação Binária:** <span style="color: yellow">0</span>000
**Ultimo endereço Algarismo:** 7
**Representação binário Ultimo Endereço:** <span style="color:yellow">0</span>111

# Exemplos práticos com CIDR fracionado no algarismo hexadecimal


**Exemplo de Representação CIDR:**<span style="color: green">2561:1900:4545:11</span>11::/57
**Primeiro Endereço da Rede:** <span style="color: green">2561:1900:4545:11</span>00::/57
**Ultimo Endereço da Rede:** <span style="color: green">2561:1900:4545:11</span>7F:FFFF:FFFF:FFFF:FFFF/57
**Ultimo endereço Algarismo:** 7
**Representação binário Ultimo Endereço:** <span style="color:yellow">0</span>111

**Exemplo de Representação CIDR:**<span style="color: green">2561:1900:4545:11</span>11::/58
**Primeiro Endereço da Rede:** <span style="color: green">2561:1900:4545:11</span>00::/58
**Ultimo Endereço da Rede:** <span style="color: green">2561:1900:4545:11</span>3F:FFFF:FFFF:FFFF:FFFF/58
**Ultimo endereço Algarismo:** 3
**Representação binário Ultimo Endereço:** <span style="color:yellow">00</span>11


**Exemplo de Representação CIDR:**<span style="color: green">2561:1900:4545:11</span>11::/59
**Primeiro Endereço da Rede:** <span style="color: green">2561:1900:4545:11</span>00::/59
**Ultimo Endereço da Rede:** <span style="color: green">2561:1900:4545:11</span>1F:FFFF:FFFF:FFFF:FFFF/59
**Ultimo endereço Algarismo:** 1
**Representação binário Ultimo Endereço:** <span style="color:yellow">000</span>1