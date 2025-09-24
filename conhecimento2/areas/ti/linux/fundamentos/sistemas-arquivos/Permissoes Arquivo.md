---
tags:
  - NotaPermanente
  - Fundamentos
  - Linux
categoria: sistema_arquivos
---
No linux existe um sistema de permissões de arquivo que é divido em 3 conceitos principais, [[Propriedades e grupos| propriedade, grupo]] e modos de acesso com isso em mente podemos resumir esse sistema e para simplificar vamos destrinchar os 3 conceitos de forma individual

## **Modos de acesso**

Os arquivos podem apresentar 3 modos de acesso distintos, estes vão valer tanto para propriedade de usuário, grupo e outros.
1. **Leitura (r - read)**: Permite visualizar o conteúdo do arquivo ou listar o conteúdo do diretório.
2. **Escrita (w - write)**: Permite modificar o arquivo ou criar/renomear/apagar arquivos dentro de um diretório.
3. **Execução (x - execute)**: Permite executar um arquivo (se for um script ou programa) ou acessar o diretório.


## **Representação das Permissões**

As permissões são representadas com 10 caracteres, exibidos pelo comando [[ls|ls -l]], como no exemplo:
```
-rwxr-xr--
```

O primeiro caractere indica o tipo do item:
     **`-` para arquivo**.
    **`d` para diretório**.
    **`l` para link simbólico**.
Os nove caracteres seguintes são divididos em três conjuntos, indicando permissões para:
    **Usuário (rwx):** Leitura (r), escrita (w), execução (x).
    **Grupo (r-x):** Leitura (r), sem escrita (-), execução (x).
    **Outros (r--):** Leitura (r), sem escrita (-), sem execução (-).
## **Modificando permissões**

Essas permissões, tanto de usuário grupo e outros podem ser alterados caso haja necessidade, existe uma convenção que representa as permissões, ela é representada por 3 números em sequencia e cada posição representa respectivamente, usuário, grupo e outros, e o numero máximo que pode ser representado é sempre 777.

### **Representação Numérica**

As permissões podem ser representadas numericamente, onde cada permissão tem um valor:

- **Leitura (r) = 4**
- **Escrita (w) = 2**
- **Execução (x) = 1**

Os valores são somados para cada conjunto (usuário, grupo, outros). Por exemplo:

- `rwxr-xr--` é representado como `755`:
    - Usuário: 7 (4+2+1)
    - Grupo: 5 (4+0+1)
    - Outros: 4 (4+0+0)

O Comando que é utilizado para esse propósito é o [[chmod]]

## **Permissões especiais**

Há permissões adicionais que afetam o comportamento de arquivos/diretórios:

1. **Setuid (S)**: Quando definido em um executável, o programa é executado com os privilégios do proprietário do arquivo.
2. **Setgid (G)**: Semelhante ao Setuid, mas aplica-se ao grupo.
3. **Sticky bit (t)**: Quando definido em um diretório, apenas o proprietário pode apagar ou renomear arquivos dentro dele (comum em `/tmp`).