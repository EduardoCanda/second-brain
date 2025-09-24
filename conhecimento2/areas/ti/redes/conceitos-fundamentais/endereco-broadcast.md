---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
Um endereço de broadcast é o último endereço de uma determinada rede [[protocolo-enderecamento-ipv4|IPV4]], ele geralmente é fácilmente observável e geralmente sempre termina em 255, exceto em redes com [[cidr-ipv4|CIDR]] quebrados, onde esse valor pode variar.

O Endereço broadcast é antagonista ao [[endereco-unicast]] pois ele representa todas as maquinas da rede, isso significa que ao enviar um pacote para esse endereço, ele será redistribuído para todos os hosts daquela rede ao contrário de um [[endereco-unicast]].