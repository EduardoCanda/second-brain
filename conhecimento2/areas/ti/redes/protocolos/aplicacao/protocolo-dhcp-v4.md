---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
O Protocolo DHCP(Dynamic Host Configuration Protocol) é utilizado para automatizar a distribuição de [[protocolo-enderecamento-ipv4|endereços IPV4]], ele também é responsável por informar configurações de gateway, servidor dns, mascara de subrede etc...

Ele funciona na camada de aplicação, por isso na estrutura do datagrama UDP, existe um campo opções que tem um tamanho bastante variável, e também possibilidade um grande dinamismo em sua composição.


Ele utiliza o protocolo UDP e utiliza as seguintes portas para realizar a comunicação:

**Porta Servidor:** 67
**Porta Cliente:** 68

# Funcionamente básico protocolo DHCP

![[protocolo-dhcp-funcionamento.png]]

1. Na mensagem **DHCP DISCOVERY** o cliente envia um datagrama UDP em broadcast para a rede com a porta 67 de destino.
2. O Servidor DHCP recebe a mensagem de discovery do cliente e envia um novo datagrama UDP com a porta 68 de destino chamado **DHCP OFFER**, informando parametros de configurações disponíveis pára sua configuração.
3. O Cliente com as informações enviadas no passo anterior monta um novo datagrama UDP com a porta destino 67 solicitando um endereço de IP para o servidor DHCP através da mensagem **DHCP Request**.
4. O Servidor Finaliza a conexão enviando um novo datagrama UDP com a porta destino 68, neste ele confirma as informações que o cliente enviou no request com a mensagem **DHCP ACK**
Existem outras 2 mensagem que são:

**DHCP RELEASE** -> Cliente envia para o servidor uma mensagem solicitando a liberação do IP atribuído inicialmente no processo de solicitação de IP

**DHCP INFORM** -> Solicita informações sobre o servidor DHCP

# Estrutura mensagem DHCP
O Protocolo DHCP tem uma estrutura padrão, suas mensagens são enviadas sempre no mesmo padrão e sua compreensão é muito simples conforme demonstra a imagem: 
![[estrutura-mensagem-dhcp.png]]

* **Codigo** -> **1** para mensagem cliente servidor e **2** para mensagem servidor cliente
* **Arquitetura de Rede** -> 1 para Ethernet
* **Tamanho do endereço Fisico** -> **6** Tamanho endereço Físico MAC.
* **Número de saltos** -> 0 número de saltos, se o servidor estiver na mesma rede não haverá saltos.
* **Identificador da Transação** -> Identificador único da transação, para todo o processo de [[#Funcionamente básico protocolo DHCP|solicitação de endereço]], este identificador será único em todas as mensagens.
* **Segundos** -> Segundos decorridos desde o inicio do processo de aquisição/renovação de endereço.
* **Flags** -> Indica se a mensagem é de broadcast, 0 para não e 8000h para sim.
* **Endereço IP do Cliente ->** Se o cliente não tem ip atribuído o valor será 0
* **Seu Endereço IP ->** Campo em que o servidor informa o endereço IP Oferecido.
* **Endereço IP do Servidor ->** Endereço ip do servidor DHCP
* **Endereço IP do Gateway ->** Não Utilizado
* **Endereço Fisico do Cliente ->** MAC Address do cliente
* **Nome do Servidor ->** Opicional, Normalmente não é utilizado
* **Arquivo de BOOT ->** Não Utilizado
* **Opções ->**

# Campo Opções Mensagem DHCP

Nesse campo o servidor envia os parametros de configuração para o cliente, é interessante observar que os 4 primeros bytes desse campo será sempre algum valor aletório que funciona como "separador", do cabeçalho para o campo opções.

Cada opção irá seguir o mesmo padrão como mostra a imagem a seguir:

![[campo-opcoes-dchp.png]]

**Codigo** -> Codigo que representa aquela opção
**Tamanho** -> Tamanho do conteúdo da opção
**Conteúdo** -> Conteúdo da opção

Abaixo uma tabela com alguns exemplos de opções
![[exemplo-opcoes-dhcp.png]]