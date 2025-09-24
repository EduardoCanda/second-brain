---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
categoria: protocolo
---
Uma característica marcante do IPV6 é o seu tamanho, com um total de 32 algarismos hexadecimais acaba em muitos casos sendo uma representação extensa e com o objetivo de simplificar essa visão, existem 2 regras que podem ser utilizadas para essa simplificação.

**Exemplo de Endereço IPV6:** 2031:0000:140f:0000:0000:0ac0:975b:010c

1. Nessa primeira regra podemos remover todos os zeros a esquerda de cada agrupamento, simplificando assim o nosso endereço de exemplo resultando no seguinte endereço.

2031:0:140f:0:0:ac0:975b:10c

2. Na segunda regra também podemos substituir agrupamentos de zeros contiguos pelo simbolo de `::`. È importante ressaltar que isso só pode ser feito um vez em um endereço IPV6, então caso haja outra sequencia de zeros contiguos, não poderá ser suprimida. O Nosso ip finalmente será:


2031:0:140f **::** ac0:975b:10c

Existe um processo de expansão se seguirá a lógica inversa, uma das formas fáceis de terminar quantos agrupamento devem ser preenchidos é entender a estrutura de um IPV6 que possuí 8 agrupamentos, fazendo assim o preenchimento de todos os grupos faltantes temos o endereço completo novamente como no exemplo abaixo:

1. 2031:0:140f **::** ac0:975b:10c
2. 2031:0:140f:0:0:ac0:975b:10c
3. 2031:0000:140f:0000:0000:0ac0:975b:010c
