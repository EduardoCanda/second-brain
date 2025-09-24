---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para que o [[NetworkManager]], recarregue todas as conexão a partir do disco pois o NetworkManager não fica monitorando a conexão continuamente, ou seja, em caso de modificação nas redes há uma necessidade de recargarregamento

# Exemplos

```bash
sudo nmcli connection reload
```