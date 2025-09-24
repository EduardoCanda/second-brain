---
tags:
  - Linux
  - Redes
  - Laboratorio
  - NotaPermanente
categoria: namespaces
---
Com o comando unshare através da opção --net é possível criar um namespace de rede, com isso
#### **Criar um namespace de rede**

```bash
unshare --net bash ip link
```


Cria um namespace de rede. Você verá que não há interfaces de rede, exceto `lo`.