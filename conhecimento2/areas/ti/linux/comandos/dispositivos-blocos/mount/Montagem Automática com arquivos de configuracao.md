---
tags:
  - Linux
  - NotaPermanente
  - NotaBibliografica
categoria: sistema_arquivos
ferramenta: cli
---

Você pode configurar sistemas de arquivos para serem montados automaticamente no arquivo [[Arquivos de Configuração|`/etc/fstab`]].

### **Exemplos**

**Entrada no `/etc/fstab`**

```bash
/dev/sda1  /mnt/dados  ext4  defaults  0  2
```
Aqui:

- `/dev/sda1`: Dispositivo.
- `/mnt/dados`: Ponto de montagem.
- `ext4`: Tipo de sistema de arquivos.
- `defaults`: Opções padrão (leitura/escrita, atualizações de tempo), esse é o padrão de opções do sistema ext4
- `0`: Desabilita `dump`.
- `2`: Prioridade de verificação no `fsck`.

**Para montar as entradas do `/etc/fstab` manualmente:**
```bash
sudo mount -a
```