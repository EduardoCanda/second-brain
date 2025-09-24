---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
categoria: protocolo
---
Para gerar um indentificador de host IID(Interface Identifier) o protocolo [[protocolo-ipv6|IPV6]] utiliza esse formato que de forma resumida irá usar o mac address da maquina host para formar a porção identificadora(IID) do host no endereço IPV6.

O Mac Address é um endereço que possuí 48bits ou 12 algarismos hexadecimais, porém a porção identificador de interface do IPV6 possuí 64 bits, havendo necessidade de um processo para converter esse identificador da interface em um identificador lógico compatívél com o IPV6

# Passo a passo para conversão

**Mac Address Exemplo:** 00-0b-45-9e-87-46

1. Remova os `:` do mac address e faça uma separação em dois agrupamentos

00 0b 45       9e 87 46

2. Adicione os algarismos FF FE entre os dois grupos

00 0B 45 **FF FE** 9E 87 46

3. Inverta o bit UL(Universal/Local) do endereço MAC, esse bit é localizado na posição 41 do MAC Address e posição 57 do IID, para nisso é necessário converter o segundo algarismo hexadecimal para biário para depois realizar a inversão, a notação para encontrar o bit se chama **(lsb  0 contando da direita pra esquerda)** 

0<span style="color: red">0</span> 0B 45 **FF FE** 9E 87 46

00<span style="color: red">0</span>0

00<span style="color: red">1</span>0

0<span style="color: red">2</span> 0B 45 **FF FE** 9E 87 46

4. Agora podemos agrupar esse endereço resultando no formato compatível com o IPV6 que será agrupamentos de 4 algarismos hexadecimais separados por ":"

020b:45FF:FE9E:8746

5. Temos a opção também de realizar a [[simplificacao-enderecos-ipv6]] resultando finalmente no IID

20b:45FF:FE9E:8746