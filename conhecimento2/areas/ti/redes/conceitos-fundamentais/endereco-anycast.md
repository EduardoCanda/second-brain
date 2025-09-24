---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
O Endereço multicast é amplamente utilizado para representar um agrupamento de hosts, diferente do [[endereco-broadcast]] que representa todos os computadores de uma determinada rede, este tipo de endereço pode segregar determinados hosts e com isso ter um controle maior sobre aquele agrupamento sem afetar todos os hosts da rede em que esse endereço está inserido, porém uma ressalva sobre a observação sobre o uso desse endereço, é adequado para hosts que fornecem o mesmo tipo de serviço.

O Endereço Anycast é nativo no [[protocolo-enderecamento-ipv6]], e sua estrutura não difere de um estrutura de um [[endereco-unicast]].

Um outro ponto interessante é que no endereçamento IPV6 o primeiro endereço da rede é um endereço anycast que indica o roteador principal da rede(Gateway Padrão).

Uma aplicação prática deste tipo de endereçamento é um servidor CDN, em que vários hosts espalhados pela internet podem oferecer o mesmo conteúdo, podendo váriar sua localização, nesse caso o host com maior latencia será sempre o selecionado.

