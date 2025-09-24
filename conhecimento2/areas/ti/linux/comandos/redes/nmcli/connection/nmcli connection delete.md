---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para excluir uma conexão configurada, segue o mesmo padrão dos demais comandos de conexão, é necessário informar o identificador da interface que será apagada, isso notifica o [[NetworkManager]] para apagar a conexão desejada.
# Exemplos

Apagando uma configuração de rede pelo identificador
```bash
nmcli connection delete Fisica
```

Apagando uma configuração de rede pelo uuid
```bash
nmcli connection delete 789ac1e8-871e-4020-beb3-7fedee308f61
```
