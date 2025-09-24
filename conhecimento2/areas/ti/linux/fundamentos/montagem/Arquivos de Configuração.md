---
tags:
  - Linux
  - NotaPermanente
  - Fundamentos
categoria: sistema_arquivos
---
No linux é possível realizar montagem automática de dispositivos de blocos através do arquivo [[Arquivos de Configuração|/etc/fstab]], ele possui uma tabela de dispositivos que devem ser montados sempre na inicialização do sistema.

Também existe o arquivo /etc/mtab esse arquivo também tem um papel parecido com o /etc/fstab, ele contem sistemas de arquivo montados manualmente, porém também possui os sistemas de arquivos que o /etc/stab tem, e é mantido pelo sistema [[mount]].

Um arquivo simular ao /etc/mtab é o /proc/mounts, ele tem uma funcionalidade muito parecida, pcaorém a implementação está dentro de kernel.

O arquivo /etc/filesystems fornece uma lista dos sistemas de arquivos que estão habilitados e aceitos pelo mount:

Existe também um arquivo localizado em /proc/partitions, que contém uma lista com todas as partições de todos os discos montados no momento, caso haja remoção de algum dispositivo essa lista será atualizada automaticamente, uma opção a esse arquivo é o comando [[lsblk]], que pode trazer essas mesmas informações em um formato mais amigável, trazendo informações extras como ponto de montagem do bloco.
