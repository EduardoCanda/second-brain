# Dual Boot → Triple Boot → Organização Final (Linux Mint + Windows)

## Contexto
Durante a troca de **Ubuntu → Linux Mint** usando instalação automática, o instalador criou uma nova partição ao invés de substituir a antiga. Resultado:
- Windows 11
- Ubuntu (antigo)
- Linux Mint (atual)

Objetivo final:
- Remover o Ubuntu
- Manter Windows + Linux Mint
- Usar o espaço livre do outro disco como **/home** do Mint

---

## Visão Geral do Setup

### Discos
- **nvme0n1 (SSD NVMe)**
  - Windows 11
  - Linux Mint (`/`)
  - EFI ativa

- **sda (disco secundário)**
  - Dados (NTFS)
  - Espaço livre após remover Ubuntu

---

## Etapa 1 — Identificar Partições

```bash
lsblk -f
```

Linux Mint (ativo):
```text
/dev/nvme0n1p6  ext4  mounted em /
```

Ubuntu antigo:
```text
/dev/sda3  ext4  (não montado)
```

---

## Etapa 2 — Remover Ubuntu

Ferramenta: **GParted**

1. Abrir:
```bash
sudo gparted
```
2. Selecionar o disco `/dev/sda`
3. Deletar a partição `ext4` do Ubuntu (`/dev/sda3`)
4. Aplicar alterações

---

## Etapa 3 — Criar Partição para /home

No espaço livre do `/dev/sda`:
- File system: `ext4`
- Label: `HOME`
- Usar todo o espaço disponível

Resultado:
```text
/dev/sda3  ext4  HOME
```

---

## Etapa 4 — Montar a Nova Partição Temporariamente

```bash
sudo mkdir /mnt/novo_home
sudo mount /dev/sda3 /mnt/novo_home
```

---

## Etapa 5 — Copiar Conteúdo do /home Atual

⚠️ Preserva permissões, donos e ACLs

```bash
sudo rsync -aAXv /home/ /mnt/novo_home/
```

Verificação:
```bash
ls /mnt/novo_home
```

---

## Etapa 6 — Preparar a Troca

```bash
sudo mv /home /home_backup
sudo mkdir /home
```

---

## Etapa 7 — Configurar Montagem Permanente (/etc/fstab)

Descobrir UUID:
```bash
blkid /dev/sda3
```

Editar fstab:
```bash
sudo nano /etc/fstab
```

Adicionar:
```text
UUID=XXXX-XXXX  /home  ext4  defaults  0  2
```

Recarregar systemd e testar:
```bash
sudo systemctl daemon-reload
sudo mount -a
```

Verificação:
```bash
df -h | grep home
```

---

## Etapa 8 — Reiniciar

```bash
sudo reboot
```

Confirmar:
- Login normal
- Arquivos intactos
- `/home` montado em `/dev/sda3`

---

## Etapa 9 — Limpeza Final

Após confirmar que tudo está ok:

```bash
sudo rm -rf /home_backup
```

---

## Resultado Final

- Windows 11 intacto
- Linux Mint usando NVMe para sistema (`/`)
- Disco secundário dedicado ao `/home`
- Setup limpo, organizado e escalável

---

## Boas Práticas Futuras

- Em troca de distro: usar **“Algo mais”** no instalador
- Reutilizar partição e marcar **formatar**
- Manter `/home` separado facilita reinstalações

---

## Status
✅ Triple boot resolvido
✅ Ubuntu removido
✅ /home migrado com segurança

