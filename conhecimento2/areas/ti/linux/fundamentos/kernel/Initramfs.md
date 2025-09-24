---
tags:
  - Linux
  - Fundamentos
categoria: sistema_arquivos
---
O Initramfs (Initial Ram Fillesystem), é um sistema de arquivos carregado em memória junto com o [[Kernel|kernel]], ele atua como sistema de arquivos auxiliar, trazendo binários e módulos responsáveis por controlar drivers entre outros componentes necessários para o [[Boot|boot]], do sistema operacional, ele apresenta uma estrutura hierárquica parecida com o root tradicional do sistema operacional, e é [[Montagem|montado]] em memória RAM para servir kernel.

Esse arquivo é montado no diretório /boot, e segue o padrão de nome do kernel, um exemplo é: initrd.img-6.8.0-49-generic, o kernel par seria vmlinuz-6.8.0-49-generic.