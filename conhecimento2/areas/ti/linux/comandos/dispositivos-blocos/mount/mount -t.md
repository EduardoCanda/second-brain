---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
Às vezes, é necessário informar explicitamente o tipo de sistema de arquivos com a opção `-t`.


### **Exemplos:**
**Montar uma Partição FAT32**

```bash
sudo mount -t vfat /dev/sdb1 /media/usb
```

- `-t vfat`: Informa que o sistema de arquivos é FAT32.

**Montar um CD/DVD com ISO9660**

```bash
sudo mount -t iso9660 /dev/sr0 /media/cdrom
```