---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O Comando **du (disk usage)** é utilizado para catalogação de pastas, com ele é possível extrair a quantidade de uso de disco em utilização por um diretório, ele funciona nativamente de forma recursiva, isso significa que quando há uma pasta sendo utilizada como argumento.

No sistema linux o tamanho padrão de um diretório é 4096 bytes, isso reflete a estrutura da pasta e não o conteúdo.

## Opções úteis do comando du

*  `-h` Imprime tamanhos de forma legível, por exemplo 1G, 150M etc...
*  `-s` Sumariza o retorno, ao invés de imprimir o conteúdo de cada arquivo no diretório ele imprime o total alocado de todos arquivos, caso não seja utilizada vai imprimir todos arquivos de forma recursiva
* `-c` Imprime no final o tamanho total
## Exemplo

```bash
du -shc diretorio
```

Nesse comando é possível visualizar o tamanho real da pasta alocado.
