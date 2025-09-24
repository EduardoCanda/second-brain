---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O comando `mount` também suporta a montagem de sistemas de arquivos remotos, como NFS e CIFS.

**Exemplos**

**Montar um Sistema NFS**

```bash
sudo mount -t nfs 192.168.1.10:/export/data /mnt/nfs
```
- `192.168.1.10:/export/data`: Caminho remoto no servidor NFS.
- `/mnt/nfs`: Ponto de montagem local.

### **Exemplo 6.2: Montar Compartilhamento Windows (CIFS)**

bash

CopiarEditar

`sudo mount -t cifs //192.168.1.10/shared /mnt/smb -o username=usuario,password=senha`

- `-t cifs`: Tipo de sistema de arquivos para compartilhamento Windows.
- `username` e `password`: Credenciais de acesso.