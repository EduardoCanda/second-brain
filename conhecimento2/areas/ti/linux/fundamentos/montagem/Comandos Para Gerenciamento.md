---
tags:
  - Linux
  - NotaPermanente
  - Fundamentos
categoria: sistema_arquivos
---
Um dos comandos utilizados para montagem de dispositivos de bloco é o [[mount]], com eles podemos fazer o mapeamento destes dispositivos dentro da nossa raiz do sistema, fazendo um espelhamento dentro de nosso sistema, um outro uso deste comando é para listar montagens, o par deste comando é o [[umount]], que faz a parte de desmontagem de dispositivos.

Outro comando utilizado para esse propósito é o [[findmnt]], com ele podemos ter uma visão mais amigável do output, inclusive com ele é possível visualizar os pontos de montagem do [[#**Arquivos de configurações de montagem**|/etc/fstab]], [[#**Arquivos de configurações de montagem**|/etc/mtab]] e [[#Arquivos de configurações de montagem|/proc/mounts]] que são arquivos de configurações que possuem os dados de montagem.