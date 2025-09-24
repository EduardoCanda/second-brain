---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
Existe um mecanismo de filtragem que podemos utilizar para selecionar endereços de ip, ele consiste em utilizar uma **mascara coringa** também conhecida como wildcard mark. 

A utilização da mesma consiste em desenvolver um padrão desejado para que caso algum [[estrutura-endereco-ipv4|Endereço Ip]] atinja os requisitos seja selecionado através do padrão que especificamos, é importante ter um endereço de ip referência para aquela mascara para o teste fazer sentido.

Para entender o seu funcionamento a maneira rápido é utilizar um ip de amostra e no nosso exemplo iremos utilizar as seguintes informações abaixo:



O Racional será, todos os bits fixados em zero na mascara coringa deveram ser iguais aos bits do endereço de referência, ou seja, no nosso exemplo os agrupamentos 192.168.15 devem ser exatamente iguais no endereço testado, abaixo alguns endereços testes para avaliarmos o comportamento.

# Exemplo 1
--- 

**Endereço Decimal:** 192.168.15.12
**Endereço Binário:** 11000000.10101000.00001111.00001100
**Mascara Coringa Decimal:** 0.0.0.255  
**Mascara Coringa Binária:** 00000000.00000000.00000000.11111111  

**Endereço Decimal:** 192.168.15.13
**Endereço Binário:** 11000000.10101000.00001111.00001101
**Situação:** Match


**Endereço Decimal:** 192.168.15.14
**Endereço Binário:** 11000000.10101000.00001111.00001110
**Situação:** Match

**Endereço Decimal:** 192.168.16.12
**Endereço Binário:** 11000000.10101000.00010000.00001100
**Situação:** No Match

---
# Exemplo 2
---

**Endereço Decimal:** 192.168.128.0
**Endereço Binário:** 11000000.10101000.10000000.0000000
**Mascara Coringa Decimal:** 0.0.127.255  
**Mascara Coringa Binária:** 00000000.00000000.01111111.11111111  

**Endereço Decimal:** 192.168.15.13
**Endereço Binário:** 11000000.10101000.00001111.00001101
**Situação:** No Match


**Endereço Decimal:** 192.168.15.14
**Endereço Binário:** 11000000.10101000.00001111.00001110
**Situação:** No Match

**Endereço Decimal:** 192.168.128.12
**Endereço Binário:** 11000000.10101000.00010000.00001100
**Situação:** Match