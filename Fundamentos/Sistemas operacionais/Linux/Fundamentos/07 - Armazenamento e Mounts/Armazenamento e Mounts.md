## Conceito Central

No Linux:
- Discos ≠ diretórios
- Discos são **montados** em diretórios
- Sem mount, o disco não existe para o sistema

Tudo faz parte da **árvore única `/`**.

---

## Dispositivos de Bloco

Discos aparecem como arquivos em `/dev`.

Exemplos:
- `/dev/sda`
- `/dev/sda1`
- `/dev/nvme0n1`

Comando:
- `lsblk`

---

## Partições

Um disco pode ter várias partições.

Tipos:
- Primária
- Lógica
- LVM
- Swap

Comandos:
- `fdisk`
- `parted`

---

## Filesystems

Filesystem define **como dados são organizados**.

Comuns:
- ext4
- xfs
- btrfs

Comando:
- `mkfs`

---

## Mount

Mount liga:
dispositivo → diretório

Exemplo:
- `/dev/sdb1` → `/mnt/dados`

Comandos:
- `mount`
- `umount`

---

## Pontos de Mount Comuns

- `/` → root
- `/boot`
- `/home`
- `/mnt` → temporário
- `/media` → dispositivos removíveis

---

## fstab

Arquivo:
- `/etc/fstab`

Define mounts persistentes no boot.

Campos:
1. Dispositivo
2. Ponto de mount
3. Filesystem
4. Opções
5. Dump
6. Fsck

Erro aqui pode impedir boot.

---

## UUID

Recomendado usar UUID em vez de `/dev/sdX`.

Comando:
- `blkid`

Evita problemas de ordem de discos.

---

## Bind Mount

Monta um diretório dentro de outro.

Exemplo:
- `/var/log` → `/logs`

Muito usado em:
- Containers
- Chroot
- Debug

---

## Swap

Área de troca de memória.

Tipos:
- Partição
- Arquivo

Comandos:
- `swapon`
- `swapoff`

---

## Permissões e Mounts

Mount não ignora permissões:
- Usuário
- Grupo
- Mode

Filesystem define comportamento.

---

## Erros Comuns

- Editar `fstab` sem testar
- Usar `/dev/sda1` em produção
- Escrever dados em mount temporário
- Confundir bind mount com volume

---

## Regra Prática

Se arquivo sumiu:
- Verifique se o mount está ativo
- Verifique o ponto de mount
- Verifique o filesystem
