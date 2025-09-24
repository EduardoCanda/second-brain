---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando cria uma conexão e conecta na rede, para visualizar a rede criada use [[nmcli connection show]], 

# Exemplos

Criando hotspot simples. 

```bash
nmcli device wifi connect "Bertie" ifname "wlp4s0" password "lucasberti1" name "BertieAlt"
```