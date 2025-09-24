---
tags:
  - Linux
  - NotaPermanente
  - NotaBibliografica
categoria: sistema_arquivos
ferramenta: cli
---
Você pode montar arquivos de imagem, como `.iso` ou `.img`, usando o **loopback**.

### **Exemplos**
### **Montar uma Imagem ISO**

```bash
sudo mount -o loop arquivo.iso /mnt/iso
```
- `-o loop`: Informa ao kernel para tratar o arquivo como um dispositivo.