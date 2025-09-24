---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O Comando blkid é utilizado para listagem de atributos de [[mount|dispositivos de bloco]],
ele retorna informações como estes [[Identificadores de montagem| identificadores]], úteis para montagem de blocos.

Você pode trabalhar com o comando [[lsblk]], para ter uma gama variada de informações sobre os blocos também.q
Exemplos:

```bash
blkid
```

Com esse comando temos a seguinte saída:
![[blkid.png]]

Temos também a opção de listar informações do bloco especificado:
```bash
blkid /dev/sdb1
```
![[blkid-BLOCO.png]]