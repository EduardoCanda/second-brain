---
tags:
  - Fundamentos
  - Redes
---
O Formato CIDR em mascaras de redes pode ser representado por uma barra seguido de um valor decimal, ele é uma alternativa de representação a o sistema [[mascara-subrede-decimal]] e apresenta um simplicidade maior em sua representação, ele representa a quantidade em bits que serão utilizadas para representar aquela rede, dentro do tamanho total de bits disponíveis em um endereço.

È importante lembrar que os as mascaras sempre irão utilizar bits da direita para esquerda, e os bits resultantes serão utilizados para identificação de hosts.
# Exemplos

10.0.0.0/8
172.16.0.0/12
192.168.0.0/24