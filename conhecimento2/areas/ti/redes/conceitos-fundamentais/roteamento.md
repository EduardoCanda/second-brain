---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
O Processo de roteamento acontece em vários dispositivos diferentes, um exemplo é o nosso [[Linux]], com ele é possível criar rotas para acessar recursos na internet, baseadas em hosts, subredes, redes completas e até pattern especificos.

O conceito de roteamento aborda duas possíbilidades, uma sendo o roteamento estático, e outra o roteamento dinamico. O roteamento estático pode ser gerenciado em tempo de execução com o comando [[ip route]], e o roteamento dinamico como o própio nome diz pode ter diferentes formas de ser implementado, uma das formas mais comuns que existe é atravéz do [[protocolo-dhcp-v4]].

De forma simplificada o roteamento é utilizado para que por exemplo, o sistema operacional tenha um prévio conhecimento de qual caminho realizar para enviar determinado pacote de rede, isso inclui por exemplo, qual IP será utilizado nesse pacote de rede, qual interface será responsável por encaminhar esse pacote, se existem interfaces prioritárias entre outras diversas informações relacionadas a rede.