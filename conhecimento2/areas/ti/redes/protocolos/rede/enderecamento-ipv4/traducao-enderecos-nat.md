---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
O Sistema de tradução de endereços visa resolver problemas relacionados a exaustão de endereços IPV4, já que estes, tem o volume ligeramente limitado e com isso precisamos poupar o máximo de IP's possíveis.

Com isso em uma rede privada temos endereços de IPV4 privados, que serão reconhecidos somente dentro daquela rede, caso um computador externo queira se comunicar com estes computadores da rede privada será necessário um endereço de ip público para essa comunicação. Para mais informações sobre endereços de ip [[estrutura-endereco-ipv4#Endereços IP Especiais|acesse]].

Para resolver esse problema foi criado o processo de NAT(network address translation), que visa de forma estratégia mitigar esse problema. Basicamente temos 3 estratégias para resolver esse problema, sendo a primeira o sistema de NAT dinâmico, a segunda NAT estático, e a terceira NAT Overload(PAT- port address translator).

Independente do metodo utilizado, sempre vai existir duas fases em que o roteador irá realizar esse processo, no envio de datagramas e no recebimento deles.

No envio geralmente o roteador irá modificar o endereço de ip de origem do datagrama para o ip publico, e no caso do [[#NAT Overload (PAT)]] também irá alterar a porta origem.

No recebimento geralmente o roteador irá modificar o endereço de ip destino do datagrama recebido, justamente por conta que dessa vez esse datagrama foi recebido, e no caso do [[#NAT Overload (PAT)]] ele também irá alterar a porta destino do datagrama.

# NAT Dinâmico

Com o NAT Dinâmico é possível ter um pool de IPV4 públicos em um determinado roteador, de tempos em tempos esse roteador associa estes endereços a hosts privados através de uma tabela, com isso ele consegue enviar pacotes para internet.

O Processo consiste em:

## Envio do datagrama.

1. Recebe um datagrama IPV4
2. Substitui o Campo do datagrama IPV4 ip origem para o ip público disponível no pool naquele momento e grava em sua tabela interna essa relação público x privado
## Recebimento do datagrama

1. Ao receber um datagrama IPV4 da internet, esse roteador verifica qual IPV4 público do datagrama e consulta sua tabela, assim fazendo o caminho inverso do passo 2, altera o ip publico destino do datagrama IPV4 e envia para o host destino daquele datagrama.

A Grande desvantágem desse modo é a limitação dos IPV4 publicos disponíveis no roteador, ou seja, caso haja mais de 5 dispositivos na rede, algum destes ficará sem acesso a internet, e também não existe uma garantia que o mesmo dispositivo irá receber sempre o mesmo endereço IPV4 público.
![[nat-dinamico.png]]
# NAT Estático

Funciona de forma análoga ao [[traducao-enderecos-nat#NAT Dinâmico|Nat Dinamico]], porém a única diferença é que é possível fixar a relação ip privado x ip publico, tornando assim estática a configuração de endereçamento.
![[nat-estatico.png]]

# NAT Overload (PAT)

Este modo é o mais eficiência e amplamente utilizado nos dias atuais, ele utiliza recursos da camada 4(Transporte) para realizar a tradução de endereços, porém de uma forma controlada.

No Próprio título já temos uma prévia do que esse modo faz, **Port Address Translation**, o roteador utiliza de portas do protocolo de transporte para realizar a tradução de endereços!

No segmento/datagrama TCP/UDP os 4 primeiros bytes(32 bits) temos as informações de porta origem e porta de destino deste datagrama ip, com isso o roteador utiliza uma tabela para realizar o mapeamento dos hosts seguindo os seguintes passos.
## Envio do datagrama

1. O Roteador recebe o datagrama IPV4 de um host da rede privada.
2. Verifica o endereço de porta origem do datagrama e faz a substituição por uma outra porta diferente.
3. Altera o endereço origem do datagrama IPV4 para seu endereço de público.
4. Registra na tabela NAT uma entrada contendo a porta origem que foi utilizada no no passo 2 como "chave" e a combinação de socket(endereço IP + Porta) original do datagrama enviado pelo host origem como "valor" desse registro.

# Recebimento do datagrama

1. O Roteador recebe o datagrama IPV4 de um host da internet
2. Verifica o endereço de porta destino deste datagrama e verifica na sua tabela interna a chave correspondente aquela porta em que o host da internet quer se comunicar.
3. Substitui a porta de destino do datagrama pela porta do registro encontrado.
4. Substitui o endereço ip destino pelo endereço do registro encontrado
5. Direciona o datagrama para o host responsável.

![[nat-overload.png]]