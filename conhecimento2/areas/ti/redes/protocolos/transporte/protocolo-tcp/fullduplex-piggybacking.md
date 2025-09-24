---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
O [[introducao-protocolo-tcp]] trabalha também com os conceitos de Piggybacking e Full Duplex, isso significa que uma comunicação TCP é bi-direcional, e a transmissão de pacotes acontecem nas duas vias, e para resolver esse problema ela utiliza dois campos do cabeçalho TCP para informar recebimentos de segmentos e também pode aproveitar o mesmo segmento para enviar novos dados.

Estes campos são o Número de Sequencia e o Número de Confirmação.

# Numero de Sequencia

O **número de sequência** é utilizado para identificar **a posição do primeiro byte de dados** dentro de um fluxo TCP. Ele informa em que parte da sequência de bytes aquele segmento pertence.

Esse campo existe em **ambos os lados da conexão** — cliente e servidor — e é iniciado durante o processo de [[conexao-tcp#Inicio Conexão TCP - Handshare 3 vias TCP|Handshake de três vias]], onde cada parte escolhe um número de sequência inicial aleatório.

Após a conexão ser estabelecida, o número de sequência **é incrementado com base no número de bytes transmitidos**, e **não pelo tamanho total do segmento (incluindo cabeçalho)**. Ou seja:

> O número de sequência sempre representa o **primeiro byte de dados** daquele segmento.

Quando o receptor recebe esse segmento, ele responde com um **número de confirmação**, indicando **o próximo byte que espera receber**. Esse número de confirmação é calculado somando o **número de sequência recebido** com o **tamanho do payload (dados) do segmento recebido**.

# Numero de Confirmação

O número de confirmação (ou **Acknowledgment Number**) é utilizado para a **confirmação de recebimento de dados** no protocolo TCP.

Cada lado da comunicação mantém **sua própria versão desse número**, andando em paralelo com a transmissão de dados.

A lógica pode ser compreendida da seguinte forma:

> Sempre que um segmento TCP é recebido, o host envia de volta uma confirmação por meio do campo **Número de Confirmação** no cabeçalho TCP.  
> Esse campo **indica a posição do próximo byte que o host espera receber**.

Por exemplo:

Se o host recebeu com sucesso **1000 bytes** iniciando do byte **1001**, o próximo byte esperado será **2001**.

Portanto, o número de confirmação será:

`acknowledgment number = 2001`
<small style="color:green">_(Obs.: o número de sequência representa o **número do primeiro byte** enviado no segmento.)_</small>

