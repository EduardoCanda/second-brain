---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para desconectar uma interface a uma conexão, diferente do comando [[nmcli connection down]] que tem a possíbilidade de tentar reconectar uma outra conexão, esse comando já impede que novas tentativas conexões sejam realizadas
# Exemplos

Desconectar dispotivi

```bash
nmcli device disconnect enp5s0
```