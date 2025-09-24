---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O Comando chown(Change Owner) é utilizado para [[Propriedades e grupos|transferência de propriedade]], isso significa que com ele é possível alterar o dono de um determinado diretório/arquivo, porém ele também pode alterar o grupo, ele pode ser combinado com os comandos [[chmod]] e também [[chgrp]].

Isso pode ser útil para transferência de permissões, ou dependendo do objetivo, padronização de propriedade de determinados arquivos.

Exemplos de utilização:

* Alterando proprietário de um determinado arquivo/diretório
```bash
chown usuariodestino arquivo
```
* Alterando proprietário de um diretório e todos os seus arquivos(Recursivamente)
```bash
chown -R usuariodestino diretorio
```
* Alterando proprietário e grupo de um diretório/arquivo, é possível usar a flag -R para recursividade também
```bash
chown usuariodestino:grupodestino diretorio
```