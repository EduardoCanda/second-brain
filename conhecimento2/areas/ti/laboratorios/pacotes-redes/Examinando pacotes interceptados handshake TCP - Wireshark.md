---
tags:
  - Linux
  - Redes
  - Laboratorio
  - NotaPermanente
---
Neste laboratório iremos explorar na prática pacotes interceptados a partir de uma [[conexao-tcp]] real e estabelecida, houve handshake de 3 vias e transferência de dados em ambas direções.

No inicio de tudo capturamos 3 pacotes que serão a representação de nosso [[conexao-tcp#Inicio Conexão TCP - Handshare 3 vias TCP|Handshake 3 vias]], e temos 3 pacotes a serem observados.

![[pacotes-handshake-3-vias.png]]

È importante observar que o wireshark já traz uma visão resumida na coluna info, facilitando uma avaliação prévia do conteúdo daqueles pacotes.

# Primeiro pacote (SYN)

O Primeiro pacote enviado é correspondente aos dados de inicio de conexão TCP(SYN), ele possuí diversas informações tanto do [[introducao-protocolo-tcp|Protocolo TCP]] quanto do [[protocolo-ipv4]].

## Informações do Datagrama IP

Para se iniciar a conexão TCP é utilizado também o protocolo de rede para transferir os dados entre maquinas, e no nosso exemplo capturado o protocolo que está sendo utilizado é o [[protocolo-ipv4]] com sua unidade chamada [[estrutura-datagrama-ipv4|Datagrama IPV4]]

![[datagrama-ipv4-handshake-syn.png]]

**Version:** 4 - Relativa ao protocolo IPV4 de rede

**Header Length:** 5 - Tamanho do cabeçalho em linhas

**Type Of Service:** 0 - Sem configurações de qualidade de serviço

**Total Length:** 60 - Tamanho total do datagrama(Considerando o tamanho total do [[#Informações do segmento TCP|Segmento]])

**Identification:** 26311 - Identificador único do datagrama.

**Flags:** 2 - Nesse caso o datagrama não será fragmentado pela rede.

**Fragment Offset:** 0 - Nesse caso não há fragmentação

**Time to Live (TTL):** 64 - Número máximo de saltos entre roteadores

**Protocol**: 6 - Protocolo utilizado na camada de transporte(Camada acima, payload)

**Header Checksum** 77D3 - Checksum do cabeçalho IPV4, no nosso caso ele está inválido pois só será calculado pela placa de rede

**Source Address:** 192.168.15.5 endereço de ip de origem, nesse caso como estamos interceptando de nossa rede local ele será um endereço privado, porém ao sair de nossa rede(através do processo [[traducao-enderecos-nat]]) ele será reescrito com o endereço de ip público, com isso o checksum do cabeçalho também será recalculado.

**Destination Address:** 44.200.95.164 endereço de destino, onde o pacote será entregue, esse não tera alteração até a entrega no destinatário.
## Informações do segmento TCP

No segmento o cliente(192.168.15.5) inicia o pedido de conexão(Flag SYN ativa), em primeira avaliação podemos observar os dados relativos a camada de transporte e podemos já observar que o protocolo utilizado é o [[introducao-protocolo-tcp|Protocolo TCP]].

![[segmento-tcp-hanshake-syn.png]]

**Source Port:** 40578  [[portas|Porta]] origem efemera pelo cliente **(192.168.15.5)**, Geralmente é randomica.

**Destination Port:**  é a 443, relativa ao [[protocolo-https]] de segurança com o protocolo de aplicação 

**Sequence Number:** Número de sequencia gerado randomicamente c9714eeb(3379646187)

**Acknowledgment Number**: 0, por se tratar do primeiro pacote de conexão TCP **(SYN)**

**Deslocamento:** A0 Relativo ao tamanho do cabeçalho, que no caso será de 10 linhas.

**Reservado:** 0 Todos os bits reservados são zerados.

**Flags:** Como podemos visualizar as flags, a unica ativa é relativa ao bit 2, sinalizando o inicio de uma conexão TCP, podemos observar os 3 bits do campo reservado zerado aqui.
![[flags-segmento-tcp-hanshake-syn.png]]

**Window Size:** 64240 - Tamanho da [[janela-deslizante-tcp]], nesse caso será o range que o cliente enviará dados ao servidor.

**Checksum:** 5c50, valor relativo ao calculo de [[checksum-ipv4]].

**Ponteiro de urgencia**: 0000 valor zerado, não utilizado.

**Opções:** 
![[opcoes-segmento-tcp-hanshake-syn.png]]

	Maximum Segment Size: 
		Opção: 2
		Tamanho da Opção: 4
		Valor: 1460
		Significado: Essa opção é correspondente ao tamanho máximo de um segmento trafegado(àrea de dados)

	Sack permitted:
		Opção: 4
		Tamanho: 2
		Significado: Permite acks de segmentos específicos.
	
	Timestamps:
		Opção: 8
		Tamanho: 10
		Valor: 828706041
		Significado: Horário do segmento.

	NOP:
		Opção: 1
		Tamanho: 0
		Significado: Esse campo é utilizado unicamente para preenchimento de opções do cabeçalho TCP, sua principal utilidade é manter as opções sempre em múltiplos de 4 bytes, essa limitação acontece por conta que todo cabeçalho TCP precisa ter linhas completas(32 bits), e em alguns casos devido a opções de tamanhos váriáveis essa opção vem para corrigir o preenchimento e fixar a linha.

	Window Scale:
		Opção: 3
		Tamanho: 3
		Valor: 7
		Significado: Potencia de 2 que será utilizada como multiplicador do campo Window do cabeçalho TCP, nesse caso será utilizado 128, ou seja 64240 x 128.


# Segundo pacote (SYN,ACK) 

Nesse segundo pacote podemos ver a resposta da solicitação(SYN) do cliente(192.168.15.5), com isso o servidor irá responder a solicitação de conexão e irá realizar a negociação de opções com o cliente, esse pacote também usa os protocolos [[protocolo-ipv4|IPV4]] e o [[introducao-protocolo-tcp|TCP]].

## Informações do Datagrama IP

Na resposta ao pedido de conexão TCP é utilizado também o protocolo de rede para transferir os dados entre maquinas, e no nosso exemplo capturado o protocolo que está sendo utilizado é o [[protocolo-ipv4]] com sua unidade chamada [[estrutura-datagrama-ipv4|Datagrama IPV4]]

![[datagrama-ipv4-handshake-synack.png]]

**Version:** 4 - Relativa ao protocolo IPV4 de rede

**Header Length:** 5 - Tamanho do cabeçalho em linhas

**Type Of Service:** 0 - Sem configurações de qualidade de serviço

**Total Length:** 60 - Tamanho total do datagrama(Considerando o tamanho total do [[#Informações do segmento TCP|Segmento]])

**Identification:** 0000 - Identificador único do datagrama.

**Flags:** 2 - Nesse caso o datagrama não será fragmentado pela rede.

**Fragment Offset:** 0 - Nesse caso não há fragmentação

**Time to Live (TTL):** 244 - Número máximo de saltos entre roteadores, é importante observar que cada lado pode configurar seu TTL.

**Protocol**: 6 - Protocolo utilizado na camada de transporte(Camada acima, payload)

**Header Checksum** 77D3 - Checksum do cabeçalho IPV4, no nosso caso ele está inválido pois só será calculado pela placa de rede

**Source Address:** 44.208.95.164 Dessa vez o endereço de origem será o do servidor, essa logica se persistirá até o fim da transferencia.

**Destination Address:** 192.168.15.5 endereço de destino, onde o pacote será entregue, podemos observar que esses endereços vão alternando entre a direção da conexão, nesse caso como há o processo de NAT, provavelmente o pacote original emitido na origem do datagrama era o ip público, porém ao chegar em nossa rede o processo de [[traducao-enderecos-nat|Nat]] alterou para o endereço do host de destino do datagrama.
## Informações do segmento TCP

Neste segmento iremos observar a resposta do servidor a solicitação de conexão do cliente(SYN ACK Ativas)

![[segmento-tcp-handshake-synack.png]]

**Source Port:** 443  [[portas|Porta]] origem fixa pelo servidor, a lógica aplicada pelo segmento anterior é invertida aqui.

**Destination Port:**  40578 Aqui o servidor informa a porta de destino do segmento SYN ACK, é importante ressaltar que o processo de geração dessa porta é feito no cliente durante a abertura de conexão e através do primeiro segmento SYN o servidor sabe que deve responder nessa porta.
OBS: Provavelmente houve [[traducao-enderecos-nat|NAT]] nesse campo também.

**Sequence Number:** Número de sequencia gerado randomicamente   dc14e827(3692357671).

**Acknowledgment Number**: 3379646188, Este confirma o recebimento do primeiro pacote(SYN), já indicando o próximo byte que espera receber.

**Deslocamento:** A0 Relativo ao tamanho do cabeçalho, que no caso será de 10 linhas.

**Reservado:** 0 Todos os bits reservados são zerados.

**Flags:** Nesse caso podemos ver que foram enviadas novas flags que representam a recepção do SYN, o servidor devolverá as flags SYN e ACK
![[flags-segmento-tcp-handshake-synack.png]]

**Window Size:** 26847 - Tamanho da [[janela-deslizante-tcp]], nesse caso será o range que o servidor enviará dados ao cliente.

**Checksum:** 68df, valor relativo ao calculo de [[checksum-ipv4]].

**Ponteiro de urgencia**: 0000 valor zerado, não utilizado.

**Opções:** 
![[opcoes-segmento-tcp-handshake-synack.png]]

	Maximum Segment Size: 
		Opção: 2
		Tamanho da Opção: 4
		Valor: 1440
		Significado: Essa opção é correspondente ao tamanho máximo de um segmento trafegado(àrea de dados)

	Sack permitted:
		Opção: 4
		Tamanho: 2
		Significado: Permite acks de segmentos específicos.
	
	Timestamps:
		Opção: 8
		Tamanho: 10
		Valor: 828706041
		Significado: Horário do segmento.

	NOP:
		Opção: 1
		Tamanho: 0
		Significado: Esse campo é utilizado unicamente para preenchimento de opções do cabeçalho TCP, sua principal utilidade é manter as opções sempre em múltiplos de 4 bytes, essa limitação acontece por conta que todo cabeçalho TCP precisa ter linhas completas(32 bits), e em alguns casos devido a opções de tamanhos váriáveis essa opção vem para corrigir o preenchimento e fixar a linha.

	Window Scale:
		Opção: 3
		Tamanho: 3
		Valor: 8
		Significado: Potencia de 2 que será utilizada como multiplicador do campo Window do cabeçalho TCP, nesse caso será utilizado 256, ou seja 26847 x 256.






# Terceiro pacote (ACK) 

No ultimo pacote o cliente aceita a solicitação de conexão do servidor e assim é dada a conexão TCP.

## Informações do Datagrama IP

![[datagrama-ipv4-handshake-ack.png]]

**Version:** 4 
**Header Length:** 5
**Type Of Service:** 0
**Total Length:** 52
**Identification:** 26312
**Flags:** 2
**Fragment Offset:** 0
**Time to Live (TTL):** 64
**Protocol**: 6(TCP)
**Header Checksum** 77da 
**Source Address:** 192.168.15.5 
**Destination Address:** 44.200.95.164

## Informações do segmento TCP

No segmento o cliente(192.168.15.5) inicia o pedido de conexão(Flag SYN ativa), em primeira avaliação podemos observar os dados relativos a camada de transporte e podemos já observar que o protocolo utilizado é o [[introducao-protocolo-tcp|Protocolo TCP]].

![[segmento-tcp-handshake-ack.png]]

**Source Port:** 40578 
**Destination Port:** 443
**Sequence Number:** (c9714eec)3379646188
**Acknowledgment Number**: 3692357672
**Deslocamento:** 8
**Reservado:** 0
**Flags:** ACK
![[flag-ack.png]]
**Window Size:** 502
**Checksum:** 5c48
**Ponteiro de urgencia**: 0000

**Opções:** 
![[opcoes-segmento-tcp-hanshake-syn.png]]