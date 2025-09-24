---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando tem duas funcionalidades, a primeira é simples, caso não seja passado nenhum argumento ela imprime o hostname do sistema, e em outro caso se for passado um hostname ela irá alterar ele(necessário permissão)
# Exemplos

Imprimindo o hostname

```bash
nmcli general hostname
```

Alterando o hostname

```bash
nmcli general hostname Berti
```