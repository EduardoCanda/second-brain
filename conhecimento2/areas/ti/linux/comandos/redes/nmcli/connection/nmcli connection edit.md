---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para edição de uma conexão de uma forma interativa, ao executar ele é retornada um terminal interativo onde podemos navegar pela configuração e editar diversas propriedades de uma única vez, sem a necessidade de várias execuções do mesmo comando (esse caso acontece no comando [[nmcli connection modify]]).

[[Linux]]

Podemos também criar uma nova conexão com o comando edit através da opção `con-name`, com isso é aberto um terminal interativo semelhante ao de edição propriamente dito e podemos adicionar as configurações de forma sistematica, essa edição interativa é ótima pois já corrige alguns valores por exemplo, caso você tente trocar uma propriedade para um valor inválido em muitos casos ele irá retornar um erro.

# Exemplos

Editando uma conexão existente

```bash
nmcli connection edit Fisica
```

Criando uma conexão ethernet a partir do comando

```bash
nmcli connection edit type ethernet con-name Fisica3
```