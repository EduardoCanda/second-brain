---
tags:
  - Linux
  - Laboratorio
  - NotaPermanente
categoria: namespaces
---
Os namespaces de montagem são úteis para criar ambientes isolados semelhantes ao `chroot`. Por exemplo:

Crie uma pasta para ser o novo "root":

```bash
mkdir -p /tmp/newroot/{bin,lib,lib64}
```
 Copie alguns binários e bibliotecas necessários:
```bash
cp /bin/bash /tmp/newroot/bin/ 
cp --parents /lib/x86_64-linux-gnu/{libtinfo.so.6,libc.so.6,libdl.so.2} /tmp/newroot/ 
cp --parents /lib64/ld-linux-x86-64.so.2 /tmp/newroot/
```


Inicie um namespace de montagem:
```bash
sudo unshare --mount --fork bash
```

Monte o novo sistema de arquivos root:
```bash
mount --bind /tmp/newroot /tmp/newroot 
cd /tmp/newroot 
chroot .
```

Com isso será aberto um shell em um ambiente [[chroot]] isolado.