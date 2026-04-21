O Load Balancer atua como intermediário entre a requisição do client e o servidor. Ao interceptar a requisição, de acordo com o algoritmo selecionado no nele, será distribuída a carga para os servidores dentro do pool.

Muito útil em sistemas distribuídos, ajuda na escabilidade horizontal, evitando oneração de um servidor focal para dar conta de todas as requisições dos clients. 

## Algoritmos:
### Round Robin:
Algoritmo que distribui a carga igualmente entre todos os servidores dentro do pool. Como se enfileirasse as requisições e enviasse uma requisição para cada servidor, até finalizar essa fila. Não leva em consideração o tamanho do pacote na rede para distribuir  a carga aos servidores (oque é considerado um trade-off)

### Least Request:
Uma abordagem de balanceamento simples, onde a requisição é enviada ao servidor que menos processou solicitações no momento. Para fazer este controle, o algoritmo utiliza um contador para cada host ativo, incrementado o mesmo a medida que o host processar sua respectiva requisição.

Então para escolher o próximo host a processar a requisição, é selecionado o host com menor contador. Dependendo da implementação, este contador pode ser reiniciado depois de algum tempo.

Muito vantajoso para quando as requisições são uniformes e curtas.

### Least Connection:
Este método considera o estado atual do servidor, em relação a conexões ativas. Isto é, implementações que suportam keep-alive, WebSockets, gRPC persistentes, etc.

O Host que tiver menor número de conexões no momento, será o próximo selecionado a receber a carga.

O Least Connection se concetra apenas no número de conexões ativas, sem avaliar a carga de cada uma delas. Isso pode levar a sobrecarga de servidores que lidam com conexões mais exigentes, além da necessidade de load balancer gerenciar essas conexões.

Servidores com muitas conexões de longa duração como as mantidas por keep-alive, podem aparentar estar menos ocupados do que realmente estão. Isso cria um potencial para distribuições ineficientes.

### Least Outstading Requests (LOR)
É um algoritmo muito sotifiscado que leva em consideração a saturação e saúde dos hosts para distribuir a carga. O LOR considera o número de requisições pendentes em cada host. Isto é, aquela requisição que foi iniciada, mas ainda não concluída, seja ou não parte de uma conexão ativa contínua.

Pelo fato de considerar a saturação do servidor (CPU e latência), a distribuição tende a ser mais eficaz e inteligente onde as requisições podem ter tempo de resposta variáveis e imprevisíveis.

O LOR exige monitoramento contínuo e detalhado das requisições, oque aumenta a complexidade de implementação, mais necessidade de recursos computacionais para manter o acompanahmento em tempo real.

## IP Hash Balancing
Basicamente o IP Hashing faz o balanço de carga de acordo com o IP do cliente. Dado um IP, é transformado em um Hash que por sua vez será direcionado a um determinado host. A regra não se restringe somente a IP, pode entrar headers, URLs entre outros parâmetros para decidir o balanceamento.

Não é muito útil quando o cliente está por trás de um proxie ou NAT, visto que vários clientes possuem o mesmo IP público, oque pode sobrecarregar um determinado host.

## Random Load Balancing
Um dos algoritmos mais simples de balanceamento. O Random Load Balancing não leva em conta o status do host. Sua escolha de host destino é simplesmente aleatória. Para isso, existe uma lista com todos os servidores disponíveis. Dado um número aleatório, o host escolhido será de acordo com o número gerado. O algoritmo não requer monitoramento complexo, é muito simples de implementar. Muito baixa latência, já que não é necessário controlar estado dos hosts.

---
# Load Balacing e Camada OSI
...
