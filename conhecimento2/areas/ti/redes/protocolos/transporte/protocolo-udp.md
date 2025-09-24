---
tags:
  - Fundamentos
  - Redes
---
O Protocolo UDP(User Datagram Protocol) é um protocolo que opera na camada de transporte, ele é do tipo inseguro pois não garante que o datagrama será efetivamente entregue ao destinatário(sem confirmação), a aplicação ideal deste é aplicações que não tenham necessidade de confirmação de recebimento por exemplo streaming de vídeos, jogos entre outras aplicações de tempo real.

Este protocolo também é utilizados por alguns protocolos de aplicação como o [[protocolo-dhcp-v4]], [[protocolo-dns]], [[protocolo-rip]]

Como não existe a confirmação de recebimento implementada no protocolo ele apresenta uma velocidade superior em comparação com o [[introducao-protocolo-tcp]], e por se tratar de um protocolo não orientado a conexão agiliza ainda mais a entrega dos dados, por mais não haja garantia de entrega.

Por ter essas características o processo no receptor também se torna mais rápido, já que ele só irá realizar a leitura dos dados sem a necessidade de resposta(característica do protocolos orientados a conexão), e por não ter essa conexão os pacotes podem ser recebidos fora de ordem.

# Cabeçalho UDP

Seu cabeçalho possuí uma estrutura simples e objetiva já que o protocolo não apresenta segurança na entrega dos dados o seu tamanho é de 8 bytes, e pode ser dividido em:

**Porta Origem** - 2 Bytes 0 a 65535
**Porta Destino** - 2 Bytes 0 a 65535
**Tamanho do Datagrama** - 2 Bytes - sendo o tamanho máximo 65535 bytes, esse valor irá determinar o tamanjp da área de dados do datagrama.
**[[checksum-ipv4|checksum-ipv4]] -** 2 Bytes - Opicional, informar 0 se não for utilizar checksum, caso valor real do checksum seja diferente de 0, se for igual deve-se informar o valor 65.535.
**Dados** - Váriável, o campo tamanho do datagrama irá definir o tamanho desse campo.

![[datagrama-udp.png]]