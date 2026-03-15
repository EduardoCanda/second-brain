A camada de enlance de dados foca no endereçamento físico da transmissão. Na prática ela é responsável 
garantir que os dados sejam **entregues corretamente entre dois dispositivos na mesma rede física**.

Quando ela recebe um pacote da **camada de rede**, ela o encapsula em um **quadro (frame)**. Nesse processo:
- Adiciona o endereço físico (endereço **MAC**) de origem e destino.
- Pode incluir mecanismos de **detecção de erros** (ex.: CRC).
- Prepara os dados para serem enviados pela **camada física**.

###### Endereçamento físico (MAC):
Dentro de cada computador na rede, há um [NIC](Física/NIC.md), componente que provê o endereço [MAC](Física/MAC.md)  que identifica o computador na  rede.

Portanto, quando um pacote é transmitido, é o **endereço MAC** que é usado para identificar o remetente. O MAC de destino também é identificado via [ARP](../../02 - LAN/ARP.md) caso esteja na mesma rede.

Para concluir também é trabalho do enlace de dados apresentar os dados de maneira que seja adequada para transmissão.
