---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O comando `mount` permite o uso de opções para personalizar o comportamento da montagem.

### **Opções Comuns**

| Opção       | Descrição                                                                     |
| ----------- | ----------------------------------------------------------------------------- |
| `ro`        | Monta como somente leitura.                                                   |
| `rw`        | Monta com permissões de leitura e escrita.                                    |
| `noatime`   | Não atualiza o tempo de acesso aos arquivos (melhora desempenho).             |
| `nosuid`    | Ignora bits `setuid` e `setgid` por segurança.                                |
| `nodev`     | Não permite a interpretação de dispositivos especiais no sistema de arquivos. |
| `sync`      | Realiza operações de escrita de forma síncrona.                               |
| `uid=1000`  | Define o ID do usuário dono dos arquivos (útil para FAT32 e NTFS).            |
| `gid=1000`  | Define o ID do grupo dono dos arquivos (útil para FAT32 e NTFS).              |
| `size=512M` | Define o tamanho máximo para sistemas de arquivos em RAM (`tmpfs`).           |

### **Exemplos**

**Montar com Somente Leitura**
```bash
sudo mount -o ro /dev/sda1 /mnt
```

- `-o ro`: Monta a partição como somente leitura.

**Montar com `noatime`**

```bash
sudo mount -o noatime /dev/sda1 /mnt
```

- `-o noatime`: Melhora o desempenho em sistemas onde o tempo de acesso não é relevante.

**Montar FAT32 com Proprietário Definido**
```bash
sudo mount -t vfat -o uid=1000,gid=1000 /dev/sdb1 /media/usb
```
- Define o dono dos arquivos para o usuário e grupo com ID 1000.