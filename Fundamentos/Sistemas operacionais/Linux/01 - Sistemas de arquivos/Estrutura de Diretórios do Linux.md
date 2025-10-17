**Arquivo:** `Estrutura-de-Diretorios.md`  
**Categoria:** Linux / Fundamentos

## 📘 Visão Geral

O Linux segue o padrão **Filesystem Hierarchy Standard (FHS)**, que define a estrutura e o propósito de cada diretório do sistema. Essa organização garante consistência entre distribuições (como Ubuntu, Fedora, Debian, etc.) e facilita a manutenção, scripts e compatibilidade de software.

---
## 📁 Diretórios Principais

### `/` — _Root Directory_

- É o diretório **raiz do sistema**.
- Todos os outros diretórios e arquivos estão contidos nele.
- Apenas o **usuário root** tem controle total sobre este nível.
- Serve como ponto de montagem inicial do sistema de arquivos.

---
### `/bin` — _Binaries (Programas Essenciais)_

- Contém **executáveis fundamentais** necessários para o funcionamento do sistema e para todos os usuários.
- Exemplos:
    - `ls`, `cp`, `mv`, `cat`, `bash`, `grep`.
- Disponível mesmo em **modo de recuperação** (single-user mode).

---
### `/sbin` — _System Binaries_
- Contém **binários administrativos** usados para manutenção do sistema.
- Normalmente apenas o **root** os executa.
- Exemplos:
    - `shutdown`, `reboot`, `fdisk`, `ifconfig`, `mount`.

---
### `/usr` — _User System Resources_
- Armazena a **maior parte dos programas e bibliotecas** instalados.
    - Subdiretórios comuns:
    - `/usr/bin` → programas de usuários comuns.
    - `/usr/sbin` → programas administrativos.
    - `/usr/lib` → bibliotecas.
    - `/usr/share` → documentação e arquivos de dados.
    - `/usr/local` → programas instalados manualmente (fora do gerenciador de pacotes).

---
### `/boot` — _Arquivos de Inicialização_
- Contém tudo o que o sistema precisa para **iniciar**.
- Inclui o **kernel do Linux** (`vmlinuz`), o **initrd/initramfs** e o **bootloader** (`grub`, `systemd-boot`).

---
### `/etc` — _Configuration Files_
- Armazena **arquivos de configuração do sistema**.
- Configurações são **de texto puro**.
- Exemplos:
    - `/etc/passwd` → usuários do sistema.
    - `/etc/fstab` → montagem de discos.
    - `/etc/ssh/sshd_config` → configuração do SSH.

---
### `/dev` — _Device Files_
- Contém **arquivos que representam dispositivos** do hardware.
- O Linux trata dispositivos como arquivos (ex: `/dev/sda`, `/dev/null`, `/dev/tty`).
- Criados dinamicamente pelo kernel (geralmente via `udev`).

---
### `/proc` — _Kernel & Process Information_
- Diretório **virtual** (não ocupa espaço real em disco).
- Contém informações sobre o **kernel e processos ativos**.
- Exemplos:
    - `/proc/cpuinfo`, `/proc/meminfo`, `/proc/[PID]/status`.

---
### `/sys` — _System Information (Sysfs)_
- Outro diretório **virtual**, introduzido com o kernel 2.6.
- Fornece **informações sobre dispositivos, módulos e drivers** do sistema.
- Exemplo: `/sys/class/net/eth0/statistics`.

---
### `/var` — _Variable Files_
- Contém arquivos **variáveis** (que mudam constantemente).
- Exemplos:
    - Logs → `/var/log/`
    - Fila de e-mails → `/var/mail/`
    - Bancos de dados temporários → `/var/lib/`
    - Cache → `/var/cache/`

---
### `/tmp` — _Temporary Files_
- Usado para **arquivos temporários** criados por aplicações.
- Limpo automaticamente a cada reinicialização.
- Qualquer usuário pode gravar, mas com restrições de permissão.

---
### `/home` — _Home Directories_
- Cada usuário comum tem seu diretório pessoal aqui: `/home/usuario`.
- Armazena **arquivos pessoais, configurações locais e projetos**.
- Exemplo: `/home/eduardo/Documentos`.

---
### `/root` — _Root User Home_
- Diretório pessoal do usuário **root**.
- Separado dos demais usuários por questões de segurança.

---
### `/lib` — _System Libraries_
- Contém **bibliotecas essenciais** usadas por programas em `/bin` e `/sbin`.
    
- Semelhante a “DLLs” no Windows.
    
- Exemplos: `/lib`, `/lib64`.
    

---

### `/media` — _Removable Media_

- Ponto de montagem para **dispositivos removíveis** como pen drives e CDs.
    
- Exemplo: `/media/usuario/USB_DRIVE`.
    

---

### `/mnt` — _Temporary Mount Point_

- Usado para **montagem manual e temporária** de dispositivos.
    
- Exemplo: montar um disco externo com:
---
### `/opt` — _Optional Software_

- Local para **instalar softwares opcionais ou proprietários**.
    
- Exemplo: `/opt/google/chrome/`
    

---

### `/run` — _Runtime Data_

- Armazena **dados voláteis de tempo de execução**, como PIDs e sockets.
    
- É recriado a cada boot (fica geralmente em tmpfs).

---

|Diretório|Função Principal|
|---|---|
|`/`|Raiz do sistema|
|`/bin`, `/sbin`|Programas essenciais e administrativos|
|`/usr`|Aplicações e bibliotecas instaladas|
|`/boot`|Inicialização do sistema|
|`/etc`|Arquivos de configuração|
|`/dev`, `/proc`, `/sys`|Interface com hardware e kernel|
|`/var`, `/tmp`|Dados variáveis e temporários|
|`/home`, `/root`|Diretórios de usuários|
|`/lib`|Bibliotecas essenciais|
|`/media`, `/mnt`|Pontos de montagem|
|`/opt`|Softwares opcionais|
|`/run`|Dados de runtime|

---
