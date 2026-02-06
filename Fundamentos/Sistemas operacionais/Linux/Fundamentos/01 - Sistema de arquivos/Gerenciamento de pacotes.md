## Windows vs Linux

### Windows
Tradicionalmente, o Windows utiliza instaladores distribuídos manualmente, como:
- `.exe`
- `.msi`

Cada aplicação geralmente:
- gerencia suas próprias dependências
- atualiza de forma isolada
- exige download manual

Atualmente, o Windows possui gerenciadores de pacotes como:
- winget
- Chocolatey
- Scoop

No entanto, esse modelo ainda não é tão integrado ao sistema quanto no Linux.

---
### Linux
No Linux, o gerenciamento de software é feito por **gerenciadores de pacotes**, que trabalham com **repositórios remotos** oficiais.

Formatos variam por distribuição:
- Debian e derivados: `.deb`
- Red Hat e derivados: `.rpm`
- Arch Linux: `.pkg.tar.zst`
- Gentoo: pacotes compilados a partir do código-fonte

O usuário instala software sem buscar manualmente na internet, e o sistema resolve dependências automaticamente.

---
## Como funciona um repositório no Linux

Um repositório é um servidor remoto que contém:
- pacotes
- metadados
- índices de dependências

Cada distribuição possui arquivos de configuração que definem:
- URLs dos repositórios
- versões suportadas
- prioridades

Exemplos:
- Debian/Ubuntu: `/etc/apt/sources.list`
- RHEL/CentOS: `/etc/yum.repos.d/*.repo`
- Arch Linux: `/etc/pacman.conf`

Quando um pacote é solicitado:
1. O gerenciador consulta os índices locais
2. Resolve dependências
3. Baixa os pacotes necessários
4. Instala e registra no sistema

## Formato de pacote
Isso é **o arquivo físico** que contém o software.

|Formato|Usado por|
|---|---|
|`.rpm`|Red Hat, CentOS, Fedora|
|`.deb`|Debian, Ubuntu|
|`.pkg.tar.zst`|Arch|
## Ferramenta de baixo nível
Essas ferramentas **instalam o arquivo do pacote**, mas **não resolvem dependências** sozinhas.

| Ferramenta | Pacote |
| ---------- | ------ |
| `rpm`      | `.rpm` |
| `dpkg`     | `.deb` |

## Gerenciador de pacotes (alto nível)
Esses são os comandos que você usa no dia a dia.

Eles:
- consultam repositórios
- resolvem dependências
- baixam pacotes
- instalam
- atualizam
- removem

### Red Hat family
- `yum` (antigo)
- `dnf` (atual)

`dnf install nginx

### Debian Family
-  apt

`apt install nginx`

---
### Resumo
```
[apt / dnf / yum]  → gerenciador (alto nível)
        ↓
[rpm / dpkg]       → ferramenta (baixo nível)
        ↓
[.rpm / .deb]      → pacote (arquivo)
```
