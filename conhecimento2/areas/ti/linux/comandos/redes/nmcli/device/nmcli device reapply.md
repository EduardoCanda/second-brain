---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando è utilizado para atualizar a configuração atualmente aplicada em um dispositivo, isso é útil quando precisamos atualizar a conexão aplicada a uma interface de rede após uma atualização.
# Exemplos

Reaplicando configuração na interface, com isso o efeito é de um "refresh"

```bash
nmcli device reapply enp5s0
```