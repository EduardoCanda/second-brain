---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é extremamente simples, basta informar a conexão que será clonada através de algum identificador e o novo nome para conexão, caso queira que esse clone seja temporário basta usar a flag `--temporary`, quando a maquina for reiniciada a conexão é apagada, isso pode ser útil para testar modificações na configuração de rede sem alterar a conexão original.
# Exemplos

Clonando uma conexão

```bash
nmcli connection clone Fisica Fisica2
```

Clonando uma conexão temporáriamente

```bash
nmcli connection clone --temporary Fisica FisicaTemp
```