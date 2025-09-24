---
tags:
  - Linux
categoria: sistema_arquivos
ferramenta: cli
---
O Comando mount é utilizado para projetar dispositivos de bloco em nosso [[Estrutura de Diretorios|FHS]], é possível realizar apontamentos(mount points) em diretórios, e com isso conseguimos ter acesso a leitura e escrita e diferentes sistemas de arquivos de forma transparente, para entender mais a respeito consulte [[Montagem|aqui]]

Isso significa que podemos ter uma série de [[Exemplos de dispositivos de blocos|discos/dispositivos de blocos]] acessíveis através de nossa estrutura de diretórios, podendo adicionar/remover/editar esses arquivos de forma livre e simplificada independente da implementação do sistema de arquivo alvo da montagem.

Link oficial da documentação: [link](https://man7.org/linux/man-pages/man8/mount.8.html)
## **Montagem Básica**

**A montagem básica requer três elementos:**

- Um **dispositivo** (ex.: `/dev/sda1`).
- Um **ponto de montagem** (ex.: `/mnt/dados`).
- (Opcional) O **tipo de sistema de arquivos** (ex.: `ext4`).

 ### **Exemplos**
 
 **Montagem Simples**
 
```bash
sudo mount /dev/sda1 /mnt
```
- `/dev/sda1`: Partição a ser montada.
- `/mnt`: Diretório onde será montada.

Por padrão o sistema detecta automaticamente o tipo de sistema de arquivos.

## Notas de detalhamento

[[mount -t]]
[[mount --make-shared]]
[[mount -o]]
[[mount -t tmpfs]]
[[Montagem de Arquivos como Dispositivos de Bloco]]
[[mount -t nsf]]
[[Montagem Automática com arquivos de configuracao]]
[[Montagem e Diagnóstico]]
[[Replicando ponto de montagem]]


