---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
categoria: protocolo
---
Os Escopos de Endereços dizem a abrangencia de um endereço IP, podemos definir uma limitação de alcance a um determinado endereço e com isso delimitar acessos a nossa rede. Um exemplo prático disso é o endereçamento [[protocolo-enderecamento-ipv4|IPV4]] privado que impede que pacotes enviados a rede sejam distribuidos para o roteador, ou, até mesmo o endereço de loopback que nem sequer sai da própria maquina.

O Conceito de Escopo de endereços faz muito sentido quando pensamos em uma rede configurada para o protocolo [[protocolo-enderecamento-ipv6|IPV6]] pois no [[protocolo-enderecamento-ipv4|IPV4]] só temos 3 escopos sendo, loopback, endereçamento privado e endereçamento público.

Esses escopos podem ser úteis para realizar operações de seleção utilizando [[protocolo-enderecamento-ipv6|IPV6]], por exemplo.


ff0<span style="color: green">2</span>::1 -> Endereço de Multicast que representa todas as maquinas
ff0<span style="color: green">2</span>::2 -> Endereço de Multicast de todos os roteadores da rede

O Algarismo representado na cor verde representa o escopo que selecionamos, existe uma tabela ao qual podemos consultar para saber todos os algarismos hexadecimais disponíveis para utilizar nessa posição.
# Escopos de endereços

Os escopos que estão marcados como definido pelo administrador podem ser configurados no [[protocolo-enderecamento-ipv6|IPV6]] pelo administrador da rede.
![[escopos-enderecos.png]]

![[escopos-ipv6.png]]
