---
tags:
  - Linux
  - NotaPermanente
  - Fundamentos
categoria: sistema_arquivos
---
Existem diversos diretórios montados dentro do nosso Linux, para visualizar eles leia mais a respeito do comando [[mount]], segue alguns diretórios conhecidos que são pontos de montagem
.

* **`/`**- Diretório raiz, ele aponta para uma partição do sistema de arquivos principal
* **`/proc`** - Sistema de arquivos virtual, responsável por representar processos
* **`/boot/efi`** - Sistema de arquivos que contém binários responsáveis por inicialização
* **`/mnt`** - Esse diretório é o ponto de montagem padrão utilizado para sistema de arquivos montados momentaneamente como HDs. Caso não haja nenhum dispositivo montado esse diretório fica vazio.
* **`/media`** - Esse diretório é o ponto de montagem padrão utilizado por sistemas de arquivos removíveis como pendrives, cds. Caso não haja nenhum dispositivo montado esse diretório fica vazio.

Os diretórios padrão não necessariamente precisam ser obrigatórios, caso haja necessidade é possível montar em qualquer outro diretório de sua necessidade.