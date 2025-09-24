---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando apaga interfaces de rede, porém não irá apagar interfaces físicas, somente interfaces virtuais como bridges, veth, bonds, teams etc.... 
# Exemplos

Apagando ethernet virtual

```bash
nmcli device delete veth0
```