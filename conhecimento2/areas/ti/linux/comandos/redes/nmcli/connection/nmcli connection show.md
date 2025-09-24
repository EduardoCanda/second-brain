---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O comando nmcli connection show é utilizado para listar conexões gerenciadas pelo [[NetworkManager]], é possível específicar uma conexão específica, obtendo detalhes acerca da mesma.

Esse comando pode ser útil em diversas situações como por exemplo verificar se alguma interface tem conexões ativas, e se sim, qual é a conexão.

# Exemplos

Listando todas as conexões

```bash
nmcli connection show
```

Listando conexões ativas

```bash
nmcli connection show --active
```

Alterando a saída na listagem de conexões

```bash
nmcli -f NAME,DEVICE,FILENAME connection show
```

Ordenando a saída por conexões ativas

```bash
nmcli connection show --order active
```

Obtendo informações de uma conexão específica, é possível usar id, uuid, path, apath etc...

```bash
nmcli connection show Fisica
```