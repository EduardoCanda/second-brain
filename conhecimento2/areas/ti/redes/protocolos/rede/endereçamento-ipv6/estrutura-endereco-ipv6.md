---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
categoria: protocolo
---
A representação de um IPV6 é distinta de um [[estrutura-endereco-ipv4|IPV4]], tanto na quantidade de bits que no IPV4 é 32 e no IPV6 é 128 quanto na representação que no caso de um IPV4 é decimal(0 a 9) e no IPV6 é hexadecimal(0 a F), sendo no total 32 algarismos hexadecimais, cada algarismo representando 4 bits.

Sua divisão também é diferente, no IPV6 a divisão é feita em 8 grupos de 16 bits, sendo 4 agrupamentos a representação da rede e os outros 4 a representação do host, o que facilita de uma maneira geral a compreensão e identificação da porção de rede e porção de host de um determinado endereço IPV6, coisa que no endereçamento IPV4 se torna mais dificil sendo necessário a compreensão da mascara de subrede para encontrada a porção responsável pela identificação da rede.

Uma novidade incrivel também é que para formar a porção responsável pelo host, na maioria dos casos é utilizado o mac address da própia interface do host tornando assim o endereçamento extremamente simples, levando assim a responsabilidade de identificação da maquina para a própria maquina da rede.
Isso é tão verdade que o protocolo carrega um sistema de auto configuração chamado SLAAC(Stateless Address Configuration) que usa o **Protocolo NDP** para preencher a porção do endereço da rede, já que a maquina por si pode preencher a porção do host com informações que ela mesma já possúi(MAC ADDRESS).

A ùnica excessão de endereçamento automático é quando os 3 primeiros bits do endereço são fixados em 0, porém existe um novo meio que substituí também essa forma que utiliza com base o mac address da maquina chamada SLAAC com Privacy Extensions, ela gera identificadores aleatórios que contribuem para maior privacidade.

Graças a essas novidades, o [[protocolo-arp]] se tornou também obsoleto já que na maioria dos casos o endereço da interface de rede já existe no própio endereço lógico IPV6, e foi substituído pelo [[protocolo-ndp|Protocolo NDP]] e também não existe [[endereco-broadcast|Endereço Broadcast]], casos haja necessidade de se comunicar com mais de uma maquina é utilizado o [[endereco-multicast|Endereco Multicast]], este mesmo endereço Multicast se tornou obrigatório então todas as maquinas conectadas a uma rede IPV6 tem ao menos 2 endereços sendo um [[endereco-unicast]] e o outro um Endereco Multicast.

Para utilizar um endereço IPV6 em conjunto com uma porta, ou em uma url é necessário separar ele entre conchetes.

# Endereços IPV6 Especiais

![[enderecos-ipv6-especiais.png]]
# Exemplos de endereços IPV6

- **2561:1900:4545:0003:0200:F8FF:FE21:67CF**: IPV6 Simples
- **2001:db8:3333:4444:5555:6666:1.2.3.4**: IPV6 Válido 
- **::11.22.33.44**: IPV6 Simplificado
- **2001:db8::123.123.123.123**: IPV4 Simplificado
- **FE80:0000:0000:0000:0202:B3FF:FE1E:8329**: IPV4 Completo
- **FE80::0202:B3FF:FE1E:8329**: IPV4 Parcialmente Simplificado(Rede)
- `[2001:db8:0::1]:80`: IPV6 inclusindo uma porta 
- **http://[2001:db8:0::1]:80**: IPV6 em formato de url