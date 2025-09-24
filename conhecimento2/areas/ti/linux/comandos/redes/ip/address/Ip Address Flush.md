---
tags:
  - Linux
  - Redes
ferramenta: cli
---
Com o comando ip address flush é possível limpar todas as configurações de uma interface de rede, podemos criar filtros para impedir que todas as configurações sejam apagadas, porém se isso não for especificado a limpeza será completa.


# Exemplos

Apagando configurações de ip segundários da interface de rede enp5s0
```
sudo ip address flush dev enp5s0 secondary 
```