---
tags:
  - Linux
  - Fundamentos
ferramenta: cli
---
No linux é possível trabalhar com redirecionamento de saída de um comando para usar como entrada de outro comando, ou redirecionamento de saída de um comando para um arquivo no [[Sistema de arquivos|sistema de arquivos]] isso é possível de ser feito através de alguns operadores descritos abaixo

| Operador                 | Função                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| *** \| (pipe) ***        | Redirecionar saída de um comando para entrada de outro                                                                |
| *** > (maior)***         | Redirecionar saída de um comando para um arquivo(se não existir cria, se existir sobre-escreve o conteúdo)            |
| ***>> (2x maior)***      | Redireciona saída de um comando para um arquivo(se não existir cria, se existir adiciona no final do arquivo)         |
| ***2> (2 e maior)***     | Redireciona saída de erro para um arquivo(se não existir cria, se existir sobre-escreve o conteúdo)                   |
| ***2>> (2 e 2x maior)*** | Redireciona saída de erro para um arquivo(se não existir cria, se existir adiciona no final do arquivo)               |
| ***&> (& e maior)***     | Redireciona saída de erro ou de sucesso para um arquivo(se não existir cria, se existir sobre-escreve conteudo)       |
| ***&>> (& e 2x maior)*** | Redireciona saída de erro ou de sucesso para um arquivo(se não existir cria, se existir adiciona no final do arquivo) |
|                          |                                                                                                                       |

### **Abaixo comandos de exemplo de uso com o pipe

Utilizando retorno da [[ls|listagem de arquivos]] para filtrar linhas que contenham a palavra Documentos, nesse caso a saída da listagem de arquivos, é utilizada como entrada do comando [[grep|grep]].

```bash
ls -lsh ~ | grep Documentos
```

### **Abaixo comandos de redirecionamento de saída para arquivos**

1. Salvando os [[ls|arquivos listados]] em um arquivo de texto, caso haja conteúdo no arquivo será sobre-escrito
```bash
ls -lsh > saida.txt
```
2. Salvando [[ls|arquivos listados]] novamente, porém preservando conteúdo no arquivo origem
```bash
ls -lsh >> saida.txt
```
3. Salvando erro em um arquivo, caso haja conteúdo no arquivo será sobre-escrito
```bash
ls -lsh diretorio-inexistente 2> saida-erro.txt
```
4. Salvando erro em um arquivo, porém preservando conteúdo no arquivo origem
```bash
ls -lsh diretorio-inexistente 2>> saida-erro.txt
```
6. Salvando os [[ls|arquivos listados]] em um arquivo de texto, em caso de erro ele também enviaria para o mesmo arquivo, caso haja conteúdo no arquivo será sobre-escrito
```bash
ls -lsh &> saida.txt
```
7. Salvando os [[ls|arquivos listados]] em um arquivo de texto, em caso de erro ele também enviaria para o mesmo arquivo, porém preservando conteúdo no arquivo origem
```bash
ls -lsh &>> saida.txt
```