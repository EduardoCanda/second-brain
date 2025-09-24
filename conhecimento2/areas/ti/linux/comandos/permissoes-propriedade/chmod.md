---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
linguagem: ShellScript
ferramenta: cli
---
O Comando **chmod** é utilizado para gestão de modos e permissão de arquivos/diretórios, usamos ele com o objetivo de alterar o modo de execução de um arquivo tanto a nível de Usuário, Grupo ou Outros que tenham acesso a determinado arquivo/diretório.

Esse comando pode ser considerado junto com o [[chown]] e o [[chgrp]] pode ter boas combinações, já que podem trabalhar em sinergia.

Ele se trata de um comando extremamente simples e sua utilização depende do entendimento do [[Permissoes Arquivo|Sistema de Permissões de arquivos]], [[Permissoes Especiais|Sistema de permissões especiais]], e também [[Propriedades e grupos|Sistema de Propriedade e grupos]] para sua utilização.

## **Execução utilizando representação numérica**

De maneira geral sua sintaxe e simples como no exemplo abaixo:
```bash
chmod 777 arquivo.sh
```
Nesse exemplo podemos dividir os números em 3 agrupamentos respectivamente, um representa a permissão do usuário, o segundo do grupo, e o terceiro de outros que tenham acesso a determinado arquivo, o significado dos números está descrito [[Permissoes Arquivo#**Representação Numérica**|aqui]]

**Outros Exemplos usando representação numerica:**
* Adicionando permissão somente de execução somente para o usuário
```bash
chmod 100 arquivo
```
* Adicionando permissão somente de leitura somente para o usuário
```bash
chmod 200 arquivo
```
* Adicionando permissão de leitura e execução somente para o usuário
```bash
chmod 300 arquivo
```
* Adicionando permissão de leitura somente para o usuário
```bash
chmod 400 arquivo
```
* Adicionando permissão de leitura e execução somente para o usuário
```bash
chmod 500 arquivo
```
* Adicionando permissão de leitura e escrita somente para o usuário
```bash
chmod 600 arquivo
```
* Adicionando permissão de leitura, escrita e execução somente para o usuário
```bash
chmod 700 arquivo
```
Qualquer variação nos outros 2 números zeradas vão seguir o mesmo padrão porém acessos modo de acesso para grupo e outros respectivamente, a vantagem desta abordagem é a simplicidade e a desvantagem é a sobre-escrita de modo, cabe a pessoa avaliar o melhor uso dessa opção

### **Resumo Rápido dos Números**

|Permissão|Representação|Valor|
|---|---|---|
|Nenhuma|`---`|`0`|
|Execução|`--x`|`1`|
|Escrita|`-w-`|`2`|
|Leitura|`r--`|`4`|
|Leitura e execução|`r-x`|`5`|
|Leitura e escrita|`rw-`|`6`|
|Todas|`rwx`|`7`|

## **Execução utilizando representação simbólica**

Existem outras variações do chmod utilizando um formato alternativo, essa representação é denominada modo simbólico, porém a ideia é muito parecida, a diferença é que usa as representações descritas [[Permissoes Arquivo#**Representação das Permissões**|aqui]]


- Adicionando permissão de leitura, escrita e execução para o usuário:
```bash
chmod u+rwx arquivo
```
- Removendo permissão de leitura, escrita e execução para o usuário:
```bash
chmod u-rwx arquivo
```
- Mantendo somente permissão de leitura o usuário:
```bash
chmod u=r arquivo
```
- Adicionando permissão de leitura, escrita e execução para todos usuários do grupo:
```bash
chmod g+rwx arquivo
```
- Removendo permissão de leitura, escrita e execução para todos usuários do grupo:
```bash
chmod g-rwx arquivo
```
- Mantendo somente permissão de leitura para todos usuários do grupo:
```bash
chmod g=r arquivo
```
- Adicionando permissão de leitura, escrita e execução para outros usuários
```bash
chmod o+rwx arquivo
```
- Removendo permissão de leitura, escrita e execução para outros usuários
```bash
chmod o-rwx arquivo
```
- Mantendo somente permissão de leitura para outros usuários
```bash
chmod o=r arquivo
```
- Adicionando permissão de leitura, escrita e execução para todos:
```bash
chmod ugo+rwx arquivo
chmod a+rwx arquivo
```

Com essa abordagem é possível adicionar permissões específicas, sem impactar as permissões que já existem, na abordagem numérica é sempre sobre-escrito os valores de permissões, cada abordagem tem uma vantagem em relação a outra

## **Execução para permissões especiais**
- **Adicionar [[Permissoes Especiais#**1. Setuid (Set User ID)**|setuid]] a um programa executável**
```bash
chmod u+s programa
chmod 4777 /diretorio
```
* **Adicionar [[Permissoes Especiais#**2. Setgid (Set Group ID)**|setgid]] a um diretório**

```bash
chmod g+s /diretorio
chmod 2777 /diretorio
```

* **Adicionar [[Permissoes Especiais#**3. Sticky Bit**|Sticky Bit]] a um diretório
```bash
chmod +t /diretorio
chmod 1777 /diretorio
```
* **Adicionar todas permissões especiais**
```bash
chmod ugo+sst arquivo
chmod 7777 arquivo
```
* **Remover permissões especiais**
```bash
chmod 0777 arquivo
chmod ugo-sst arquivo
```
Lembrando que como as permissões especiais são exclusivas, na teoria seria 1 modo exclusivo extra, isso significa que ainda sim é necessário a permissão de execução por exemplo, caso seja necessária.