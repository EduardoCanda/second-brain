---
tags:
  - Linux
  - Redes
ferramenta: cli
---
O Comando ip link delete é utilizado para apagar dispositivos de rede, essa é a finalidade deste comando, devemos sempre específicar qual dispositivo será excluído com a opção dev

È importante ressaltar que interfaces físicas não podem ser excluídas com o comando, e é necessário permissão de root para apagar a interface desejada, e também a interface deve estar em status down para poder ser feita a exclusão

# Sintaxe basica

```bash
ip link delete [dev <dispotivo>] [group <group>] [type <type>]
```

# Exemplos:

Apagando o dispositivo especificado

```bash
ip link delete dev enp5s0
```