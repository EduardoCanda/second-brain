---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
Um Dispositivo master normalmente é associado a uma interface controladora(por exemplo um switch), havendo assim gerenciamento por parte desta. Um exemplo disso é uma bridge virtual no [[Linux]], todos os dispositivos associados a esta são gerenciados e os dados são comutados a partir dela.

O **"master"** significa que a interface será **subordinada** a um dispositivo maior que a gerencia, como uma **bridge**, um **bonding**, um **teaming**, ou uma **VRF**.
# Comparação com Outros Dispositivos Mestre:

O conceito de **mestre** não se aplica apenas a bridges, mas também a outros tipos de dispositivos, como: