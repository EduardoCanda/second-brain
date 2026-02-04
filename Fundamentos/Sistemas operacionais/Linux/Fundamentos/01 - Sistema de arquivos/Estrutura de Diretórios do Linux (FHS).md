O Linux segue o padrão **Filesystem Hierarchy Standard (FHS)**, que define a estrutura e o propósito de cada diretório do sistema.  
Essa organização garante consistência entre distribuições (Ubuntu, Fedora, Debian, etc.) e facilita manutenção, automação, scripts e compatibilidade de software.

## Diretórios Principais (ordem alfabética)

### `/` — Root Directory

- Diretório **raiz do sistema**.
- Todos os outros diretórios e arquivos estão contidos nele.
- Serve como ponto inicial de montagem do sistema de arquivos.
- Apenas o **usuário root** possui controle administrativo total.

---

### `/bin` — Binaries (Programas Essenciais)

- Contém **executáveis essenciais** necessários para o sistema funcionar.
- Disponível mesmo em **modo de recuperação**.
- Exemplos:
  - `ls`, `cp`, `mv`, `cat`, `bash`, `grep`.

> Em sistemas modernos, `/bin` pode ser um link simbólico para `/usr/bin`.

---

### `/boot` — Arquivos de Inicialização

- Contém tudo o que é necessário para o **processo de boot**.
- Inclui:
  - Kernel do Linux (`vmlinuz`)
  - `initrd` / `initramfs`
  - Bootloaders (`grub`, `systemd-boot`)

---

### `/dev` — Device Files

- Contém **arquivos que representam dispositivos de hardware**.
- O Linux trata dispositivos como arquivos.
- Exemplos:
  - `/dev/sda`, `/dev/null`, `/dev/tty`
- Criados dinamicamente pelo kernel (geralmente via `udev`).

---

### `/etc` — Configuration Files

- Armazena **arquivos de configuração do sistema**.
- Arquivos geralmente em **texto puro**.
- Exemplos:
  - `/etc/passwd` → usuários do sistema
  - `/etc/fstab` → montagem de discos
  - `/etc/ssh/sshd_config` → configuração do SSH

---

### `/home` — Home Directories

- Diretório pessoal dos usuários comuns.
- Cada usuário possui um subdiretório:
  - `/home/usuario`
- Armazena arquivos pessoais, configurações locais e projetos.
- Exemplo:
  - `/home/eduardo/Documentos`

---

### `/lib` — System Libraries

- Contém **bibliotecas essenciais** usadas por programas em `/bin` e `/sbin`.
- Equivalente conceitual às DLLs no Windows.
- Exemplos:
  - `/lib`, `/lib64`

> Em sistemas modernos, pode ser link simbólico para `/usr/lib`.

---

### `/media` — Removable Media

- Ponto de montagem para **dispositivos removíveis**.
- Exemplos:
  - Pen drives, cartões SD, CDs.
- Caminho típico:
  - `/media/usuario/NOME_DO_DISPOSITIVO`

---

### `/mnt` — Temporary Mount Point

- Usado para **montagens manuais e temporárias**.
- Muito comum em tarefas administrativas.
- Exemplo:
  - Montar um disco manualmente para manutenção.

---

### `/opt` — Optional Software

- Local destinado a **softwares opcionais ou proprietários**.
- Normalmente aplicações completas com sua própria hierarquia.
- Exemplo:
  - `/opt/google/chrome/`

---

### `/proc` — Kernel & Process Information

- Diretório **virtual** (não ocupa espaço em disco).
- Fornece informações sobre:
  - Kernel
  - Processos ativos
- Exemplos:
  - `/proc/cpuinfo`
  - `/proc/meminfo`
  - `/proc/[PID]/status`

---

### `/root` — Root User Home

- Diretório pessoal do usuário **root**.
- Separado de `/home` por razões de segurança e isolamento administrativo.

---

### `/run` — Runtime Data

- Armazena **dados voláteis de tempo de execução**.
- Exemplos:
  - PIDs
  - Sockets
  - Informações de serviços ativos
- Recriado a cada boot (geralmente em `tmpfs`).

---

### `/sbin` — System Binaries

- Contém **binários administrativos** usados para manutenção do sistema.
- Normalmente executados apenas pelo **root**.
- Exemplos:
  - `shutdown`, `reboot`, `fdisk`, `mount`

> Em sistemas modernos, pode ser link simbólico para `/usr/sbin`.

---

### `/sys` — System Information (Sysfs)

- Diretório **virtual**, introduzido no kernel 2.6.
- Expõe informações sobre:
  - Dispositivos
  - Drivers
  - Módulos do kernel
- Exemplo:
  - `/sys/class/net/eth0/statistics`

---

### `/tmp` — Temporary Files

- Usado para **arquivos temporários**.
- Normalmente limpo em reinicializações.
- Qualquer usuário pode gravar, respeitando permissões.

---

### `/usr` — User System Resources

- Contém a **maior parte dos programas, bibliotecas e dados compartilhados**.
- Subdiretórios comuns:
  - `/usr/bin` → programas de usuários
  - `/usr/sbin` → ferramentas administrativas
  - `/usr/lib` → bibliotecas
  - `/usr/share` → documentação e dados independentes de arquitetura
  - `/usr/local` → softwares instalados manualmente

---

### `/var` — Variable Files

- Contém arquivos **variáveis**, que mudam com o tempo.
- Exemplos:
  - Logs → `/var/log`
  - Cache → `/var/cache`
  - Bancos de dados e estados → `/var/lib`
  - E-mails → `/var/mail`
