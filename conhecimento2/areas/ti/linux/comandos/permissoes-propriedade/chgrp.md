---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
linguagem: ShellScript
ferramenta: cli
---
O Comando chown(Change Owner) é utilizado para [[Propriedades e grupos|transferência de propriedade]], isso significa que com ele é possível alterar o grupo de um determinado diretório/arquivo, ele pode ser combinado com os comandos [[chmod]] e também [[chown]].

Isso pode ser útil para transferência de permissões, ou dependendo do objetivo, padronização de propriedade de determinados arquivos.

Exemplos de utilização:

* Alterando grupo proprietário de um determinado arquivo/diretório
```bash
chgrp usuariodestino arquivo
```
* Alterando grupo proprietário de um diretório e todos os seus arquivos(Recursivamente)
```bash
chgrp -R usuariodestino diretorio
```