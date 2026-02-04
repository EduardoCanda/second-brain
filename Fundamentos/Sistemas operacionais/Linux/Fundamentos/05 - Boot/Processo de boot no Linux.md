# Processo de Boot do Linux

O processo de boot do Linux é uma sequência de etapas bem definidas, onde cada componente inicializa o próximo até que o sistema esteja pronto para uso.

## Visão geral
Power → POST → BIOS/UEFI → Bootloader → Kernel → init/systemd → Usuário

---

## 1. Power On

- O sistema recebe energia.
- A CPU é inicializada e começa a executar código do firmware.
- Nenhum sistema operacional está carregado ainda.

---

## 2. POST (Power-On Self Test)

Executado pelo firmware da placa-mãe.

Verifica:
- CPU
- Memória RAM
- Dispositivos essenciais

Falhas críticas impedem o boot.

---

## 3. Firmware: BIOS ou UEFI

### BIOS (Legacy)

- Utiliza MBR (Master Boot Record).
- Lê os primeiros 512 bytes do disco.
- Possui limitações de tamanho e particionamento.

### UEFI (Moderno)

- Utiliza GPT (GUID Partition Table).
- Suporta arquivos `.efi`.
- Usa a EFI System Partition (ESP).
- Mais seguro e flexível.

---

## 4. Bootloader (GRUB)

Responsável por:
- Exibir menu de boot
- Carregar o kernel
- Carregar o initramfs

Arquivos comuns:
- `/boot/grub/grub.cfg`
- `/boot/vmlinuz-*`
- `/boot/initrd.img-*`

---

## 5. Kernel Linux

O kernel:
- Inicializa hardware
- Gerencia memória e CPU
- Monta o initramfs
- Prepara o sistema para o espaço de usuário

---

## 6. initramfs

Sistema de arquivos temporário em memória.

Funções:
- Carregar drivers essenciais
- Montar o filesystem raiz definitivo

Após isso, é descartado.

---

## 7. init / systemd (PID 1)

Primeiro processo do sistema.

Responsável por:
- Iniciar serviços
- Montar filesystems
- Gerenciar dependências
- Definir o estado do sistema

Targets comuns:
- `multi-user.target`
- `graphical.target`
- `rescue.target`

---

## 8. Sistema pronto

- Serviços são iniciados
- Interface gráfica ou terminal é exibido
- Sistema operacional pronto para uso