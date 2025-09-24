---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
Os sistemas de arquivos **`tmpfs`** ou **`ramfs`** permitem criar um sistema de arquivos em memória RAM.

### **Exemplos**

**Montar um `tmpfs`**
```bash
sudo mount -t tmpfs -o size=512M tmpfs /mnt/ramdisk
```
- `-t tmpfs`: Define o tipo de sistema de arquivos como `tmpfs`.
- `-o size=512M`: Limita o tamanho para 512 MB.