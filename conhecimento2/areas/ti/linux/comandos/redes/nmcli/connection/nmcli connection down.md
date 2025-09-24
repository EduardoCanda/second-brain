---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para desativar uma conexão específica, uma observação importante é que caso haja uma outra conexão disponível para tal dispositivo e ela esteja marcada como *autoconnect*, ela será ativada, então é importante conferir se o [[NetworkManager]], ativou uma outra conexão no lugar da conexão que foi desativada caso esse seja um comportamente inesperado. 

Nos meus testes ao desativar uma conexão, tive uma outra conexão ativa no lugar da desativada, isso era um comportamento indesejado pois minha necessidade era para desativação total da interface, consegui descobrir isso usando o comando [[nmcli connection show]].

# Exemplos
Desativando a conexão física, é possível usar o id, uuid apath para especificar a conexão

```bash
nmcli connection down Fisica
```