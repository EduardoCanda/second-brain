---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
Com o comando mount é possível especificar o tipo de montagem, isso vai refletir diretamente em como esse ponto de montagem será propagado dentro de nosso sistema de arquivos, existem algumas opções que podemos usar com a option **`--make`** para mais informações sobre o processo de propagação [[Configurações de propagação|aqui]] há um detalhamento.

### **Montagem em modo shared**
```bash
mount --make-shared mountpoint
```
### **Montagem em modo slave**
```bash
mount --make-slave mountpoint
```
### **Montagem em modo privado**

```bash
mount --make-private mountpoint
```
