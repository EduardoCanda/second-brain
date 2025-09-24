---
tags:
  - Fundamentos
  - NotaPermanente
  - Linux
categoria: sistema_arquivos
---

As permissões especiais no Linux complementam o [[Permissoes Arquivo|sistema padrão de permissões]] (leitura, escrita e execução) e fornecem controles adicionais sobre o comportamento de arquivos e diretórios o comando que pode manipular essas permissoes é o [[chmod]]. As permissões especiais são:

## **1. Setuid (Set User ID)**

- **Comportamento:** Quando aplicado a um arquivo executável, faz com que o programa seja executado com os privilégios do **proprietário do arquivo**, em vez do usuário que o executa.
- **Uso comum:** Permite que programas acessem recursos que normalmente requerem privilégios elevados. Por exemplo:
    - O comando [[passwd]] (para mudar senhas) usa `setuid` para modificar arquivos de sistema protegidos, como `/etc/shadow`.
- **Indicação em permissões:** O bit de execução (x) para o proprietário é substituído por uma letra **s** no campo de permissões:
    - `-rwsr-xr-x` → Indica que o arquivo tem `setuid`.

## **2. Setgid (Set Group ID)**

- **Comportamento:**
    - Para arquivos executáveis: O programa é executado com os privilégios do **grupo proprietário**.
    - Para diretórios: Os arquivos criados dentro herdam o grupo do diretório, independentemente do grupo do usuário que os criou.
- **Uso comum:** Facilita a colaboração em diretórios compartilhados, garantindo que novos arquivos tenham o mesmo grupo do diretório pai.
- **Indicação em permissões:** O bit de execução (x) para o grupo é substituído por uma letra **s**:
    - `-rwxr-sr-x` → Indica que o arquivo tem `setgid`.
    - Para diretórios, é comum ver `drwxr-sr-x`.

## **3. Sticky Bit**

- **Comportamento:** Aplicado a diretórios, restringe a exclusão ou renomeação de arquivos para o proprietário do arquivo ou do diretório, mesmo que outros usuários tenham permissões de escrita no diretório.
- **Uso comum:** Diretórios compartilhados, como `/tmp`, para evitar que um usuário apague arquivos de outro, inclusive o /tmp possui esse bit habilitado.
- **Indicação em permissões:** A letra **t** aparece no lugar do bit de execução (x) para "outros":
    - `drwxrwxrwt` → Indica que o diretório tem o sticky bit.
## **Resumo na Representação das Permissões**

1. **Setuid**: `rws` (em vez de `rwx` no campo do proprietário).
2. **Setgid**: `r-s` (em vez de `r-x` no campo do grupo).
3. **Sticky Bit**: `rwt` (em vez de `rwx` no campo de outros, aplicado apenas a diretórios).