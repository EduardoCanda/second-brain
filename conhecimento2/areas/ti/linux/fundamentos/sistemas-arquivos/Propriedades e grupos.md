---
tags:
  - NotaPermanente
  - Fundamentos
  - Linux
categoria: sistema_arquivos
---
 No linux todos arquivos tem um proprietário, com isso é possível ter uma infinidade de combinações, tanto para esse proposito quanto para o [[Permissoes Arquivo|sistema de permissões de arquivos]], isso facilita no gerenciamento e na segurança e gestão de acessos e controle de arquivos.

È possível visualizar isso com o [[ls#Exemplo basico de utilização|comando ls]] e também existe a possibilidade de manipular esses a propriedade destes livremente.
 
Todos os arquivos e diretórios do linux apresentam 2 tipos de propriedade
- **Usuário:** O Usuário que criou o arquivo
- **Grupo:** O Grupo ao qual o arquivo pertence, com isso vários usuários podem acessar esse arquivo com a mesma permissão


È possível alterar a propriedade dos arquivos/diretórios, para isso pode-se utilizar o comando [[chown]](Change Owner) e também o comando [[chgrp]](Change Group), é importante ressaltar que ao alterar a propriedade de um arquivo, por consequência as permissões podem ser impactadas.