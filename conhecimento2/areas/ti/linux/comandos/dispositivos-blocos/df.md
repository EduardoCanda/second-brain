---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O Comando DF é muito útil para conseguirmos obter a informações sobre quantidade de espaço disponível em um determinado [[Sistema de arquivos|sistema de arquivos]],
com isso podemos facilmente combinar ele com o comando [[mount]] e também o [[findmnt]], já que o argumento que ele recebe é o caminho no nosso [[Estrutura de Diretorios|FHS]].

## **Exemplo**

Exibindo informações de tamanho e uso do dispositivo que está montado no diretório /
```bash
df -h /
```
Saída:
![[df-h.png]]

Exibindo informações de todos os dispositivos, caso não seja passado nenhum arquivo/diretório como argumento
```bash
df -h
```
Saída