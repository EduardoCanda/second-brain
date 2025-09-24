---
tags:
  - Linux
categoria: sistema_arquivos
ferramenta: cli
---
O **Comando ls** é utilizado para listagem de [[Sistema de arquivos|arquivos]], com ele podemos visualizar uma série de informações sobre diretórios especificados como, tamanho do arquivo, data de criação entre outras informações, existem algumas opções que podem ser úteis e geralmente são sempre utilizadas combinadas:

## **Opções úteis para o comando `ls`**

- `-h`: Mostra os tamanhos de arquivos em um formato legível para humanos (ex.: KB, MB, GB).
- `-a`: Inclui arquivos ocultos (que começam com um `.`).
- `-R`: Lista recursivamente todos os arquivos em subdiretórios.
- `-t`: Ordena os arquivos por data de modificação, mais recente primeiro.
- `-S`: Ordena os arquivos por tamanho, do maior para o menor.
- `-l`: Lista os arquivos em formato de lista

Essas opções podem ser combinadas, por exemplo, `ls -lh` para tamanhos legíveis e detalhes.


## **Exemplo basico de utilização**

Listando diretório atual em formato de lista
```bash
ls -l
```

Saida:
![[ls.png]]
Esse formato pode ser representado pela seguinte lista

### 1. **Permissões e tipo do arquivo**

Permissões e tipo do arquivo, para mais informações acesse [[Permissoes Arquivo|aqui]], e para modificar essa estrutura acesse [[chmod]]

### **2. Número de links**

Indica o número de links para o arquivo ou diretório (por exemplo, quantas vezes ele é referenciado).
### **3. Proprietário do arquivo

Nome do usuário que é o proprietário do arquivo, para mais informações sobre esse
conceito acesse [[Propriedades e grupos|aqui]], e para alterar obtenha mais informações sobre como alterar [[chown|aqui]]

### **4. Grupo do arquivo

Grupo associado ao arquivo. Usuários desse grupo podem herdar permissões dependendo da configuração, para mais informações sobre grupos acesse [[Propriedades e grupos]], e para modificar [[chgrp]].

### **5. Tamanho do arquivo**

Tamanho do arquivo em bytes. Para diretórios, pode indicar o tamanho usado para armazenar as informações internas.
### **6. Data e hora de modificação (Jan 16 15:30):**

Indica quando o arquivo foi modificado pela última vez.
Formato: Mês Dia Hora:Minuto. Se o arquivo foi modificado há mais de 6 meses, o ano será exibido no lugar da hora.
### **7. Nome do arquivo**

Nome do arquivo ou diretório.

# Verificando tamanho real de diretórios

Ao rodar esses comandos temos um problema, caso haja necessidade de saber o tamanho total alocado de um diretório no disco não vamos conseguir ter essa estimativa, para isso podemos usar o comando [[du|du]](disk usage), este pode retornar com precisão o tamanho real alocado em um diretório especificado.

Manual do comando
```bash
man pwd
```
