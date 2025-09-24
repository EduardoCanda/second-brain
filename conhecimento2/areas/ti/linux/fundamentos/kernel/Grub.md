---
tags:
  - Linux
  - Fundamentos
  - NotaBibliografica
---
O **GRUB** (GRand Unified Bootloader) é o **gerenciador de boot padrão** na maioria das distribuições Linux. Ele é responsável por carregar o kernel do Linux (ou outros sistemas operacionais, em caso de *dual boot*) na memória RAM e iniciar o sistema.  

---

## **Principais Características do GRUB**  
✔ **Suporte a múltiplos sistemas operacionais** (Linux, Windows, macOS em Hackintosh, etc.).  
✔ **Configurável** (permite editar opções de boot durante a inicialização).  
✔ **Suporte a BIOS (Legacy) e UEFI**.  
✔ **Interface interativa** (menu gráfico ou texto para selecionar sistemas).  
✔ **Capacidade de carregar kernels e initramfs** (sistema de arquivos inicial temporário).  

---

## **Como o GRUB Funciona?**  
1. **Fase 1 (BIOS) / Fase 1 (UEFI)**  
   - Na **BIOS**, o GRUB é instalado no **MBR** (Master Boot Record) do disco.  
   - No **UEFI**, ele é armazenado na **partição ESP (EFI System Partition)** como um arquivo `.efi`.  

2. **Menu do GRUB**  
   - Exibe uma lista de sistemas operacionais instalados (se configurado).  
   - Permite editar parâmetros do kernel antes de iniciar (útil para recuperação).  

3. **Carregamento do Kernel**  
   - O GRUB carrega o **kernel Linux** (`vmlinuz`) e o **initramfs** na memória.  
   - Passa o controle para o kernel, que continua o boot.  

---

## **Estrutura de Arquivos do GRUB**  
Os arquivos de configuração do GRUB estão geralmente em:  
- **`/boot/grub/`** (em sistemas BIOS ou Legacy)  
- **`/boot/efi/EFI/[distro]/`** (em sistemas UEFI)  

O arquivo principal de configuração é:  
- **`/boot/grub/grub.cfg`** (gerado automaticamente, **não deve ser editado manualmente**).  
- **`/etc/default/grub`** (arquivo de configuração principal que pode ser modificado).  

---

## **Comandos Úteis do GRUB**  
| Comando | Descrição |  
|---------|-----------|  
| **`sudo update-grub`** | Atualiza o `grub.cfg` após mudanças. |  
| **`grub-install /dev/sdX`** | Reinstala o GRUB no disco (útil em reparos). |  
| **`grub-mkconfig -o /boot/grub/grub.cfg`** | Gera um novo arquivo de configuração. |  

---

## **Como Editar o GRUB Temporariamente?**  
Se o sistema não está iniciando, você pode:  
1. Pressionar **`Shift`** (BIOS) ou **`Esc`** (UEFI) durante o boot para acessar o menu.  
2. Selecionar uma entrada e pressionar **`e`** para editar os parâmetros antes de iniciar.  
   - Exemplo: adicionar **`single`** para modo de recuperação.  
3. Pressionar **`Ctrl + X`** ou **`F10`** para bootar com as alterações.  

---

## **GRUB vs. systemd-boot**  
- **GRUB** → Mais flexível, suporta BIOS/UEFI e múltiplos sistemas.  
- **systemd-boot** → Mais simples, apenas para UEFI (usado no Arch Linux, Fedora Silverblue).  

---

## **Problemas Comuns e Soluções**  
🔹 **GRUB não aparece (Windows sobrescreveu)** → Use um Live USB e reinstale (`grub-install`).  
🔹 **Erro "no such device"** → Verifique UUIDs em `/etc/fstab` e `/boot/grub/grub.cfg`.  
🔹 **Tela preta no boot** → Edite o GRUB e adicione `nomodeset` nos parâmetros do kernel.  

Quer ajuda com alguma configuração específica? 😊