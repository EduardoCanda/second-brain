A camada de rede é onde acontece a magia de roteamento e remontagem de dados (desde o menor pacote até os grandes). Portanto, toda conexão entre dois dispositivos entre de redes diferentes passa por esta camada.

Primeiramente é definido a melhor rota onde os pacotes devem ser entregues. Para isso alguns protocolos nesta camada determinam qual é a "melhor rota".  Nesta camada tudo é tratado com endereços [IP](../../03 - Protocolos/IP.md). 

Protocolos como [OSPF](Rede/OSPF.md) e [RIP](Rede/RIP.md) são utilizados para o critério da escolha da rota. Eles seguem os princípios como:
- Qual caminho mais curto? Ou seja, possui a menor quantidade de dispositivos que o pacote precisa atravessar.
- Qual caminho é o mais confiável? Os pacotes foram perdidos neste caminho antes?
- Qual caminho possui conexão física mais rápida? Este caminho utiliza conexão de cobre (lenta) ou fibra (rápida)?