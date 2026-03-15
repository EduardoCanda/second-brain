## Conceito Central

Linux é um sistema **multiusuário por design**.  
Tudo roda **em nome de um usuário** e **pertence a um grupo**.

Controle de acesso é feito por:
- Usuário (owner)
- Grupo
- Outros (others)

---

## Usuários

Um usuário possui:
- UID (User ID)
- Diretório home
- Shell
- Grupos associados

Usuários comuns:
- UID >= 1000

Usuários de sistema:
- UID < 1000
- Usados por serviços (nginx, postgres, docker)

Arquivos importantes:
- `/etc/passwd` → lista de usuários
- `/etc/shadow` → senhas (restrito ao root)

---

## Grupos

Grupos servem para **compartilhar permissões**.

- Um usuário pode pertencer a vários grupos
- Cada arquivo tem **um grupo dono**

Arquivos:
- `/etc/group`

Exemplo mental:
> Em vez de dar permissão a 10 usuários, dá ao grupo.

---

## Root

- Usuário administrador
- UID 0
- Acesso irrestrito ao sistema

Boas práticas:
- Não trabalhar logado como root
- Usar `sudo` quando necessário

---

## Permissões de Arquivos

Formato clássico:
> -rwxr-xr--

Quebra:
- `-` → tipo (arquivo)
- `rwx` → usuário
- `r-x` → grupo
- `r--` → outros

Permissões:
- `r` → read (4)
- `w` → write (2)
- `x` → execute (1)

---

## Permissões Numéricas

Exemplo:
> chmod 755 arquivo

Significado:
- 7 → rwx (usuário)
- 5 → r-x (grupo)
- 5 → r-x (outros)

---

## Dono e Grupo

- `chown user arquivo`
- `chown user:group arquivo`
- `chgrp group arquivo`

---

## Diretórios (diferença importante)

Em diretórios:
- `r` → listar arquivos
- `w` → criar/remover arquivos
- `x` → acessar (cd)

Sem `x`, você **vê mas não entra**.

---

## Permissões Especiais

### SUID
- Executa como dono do arquivo
- Ex: `/usr/bin/passwd`

### SGID
- Executa com grupo do arquivo
- Em diretórios, herda grupo

### Sticky Bit
- Apenas o dono pode apagar
- Ex: `/tmp`

---

## Umask

Define permissões padrão ao criar arquivos.

Exemplo comum:
- `022`
- Arquivos → 755
- Diretórios → 644

---

## Erros Comuns

- Usar `chmod 777`
- Rodar serviços como root sem necessidade
- Não usar grupos
- Misturar permissões de arquivos e diretórios

---

## Regra Prática

Se algo falha:
1. Verifique o usuário
2. Verifique o grupo
3. Verifique as permissões
4. Só depois pense em root
