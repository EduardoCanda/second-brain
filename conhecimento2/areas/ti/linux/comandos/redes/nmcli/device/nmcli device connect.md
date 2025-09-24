---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é responsável por conectar uma interface de rede a uma conexão, isso significa que um perfil será aplicado e ativado naquela interface específica, com isso ela será "ativada", e a conexão através dessa conexão irá fluir, o algoritmo de seleção considera conexões que estão com o autoconnect como yes
# Exemplos

Conectando o dispositivo enp5s0 
```bash
nmcli device connect enp5s0
```
![[nmcli-device-connect.png]]