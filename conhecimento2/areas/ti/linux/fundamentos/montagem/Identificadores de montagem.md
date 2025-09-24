---
tags:
  - Linux
  - NotaPermanente
  - Fundamentos
categoria: sistema_arquivos
---
Existem algumas opções que podem ser usadas para identificar um sistema de arquivos a ser montado, não é recomendável usar o padrão /dev/sdX pois dependendo de alguma reconfiguração de hardware isso pode ser perder.
Segue alguns exemplos que podem ser usados.

* LABEL=label
* UUID=uuid
* PARTLABEL=label
* PARTUUID=uuid
* ID=id

Para visualizar as opções disponíveis, basta executar o comando [[blkid]], e também o comando [[lsblk]]