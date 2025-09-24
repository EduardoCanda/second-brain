---
tags:
  - Linux
  - Namespaces
ferramenta: cli
---
O Comando lsns é utilizado para listar namespaces criados em nosso sistema, dependendo da opção especificada é possível filtrar os tipos de namespaces que serão retornados utilizando a flag -t

Ele também retorna o um idenficador de namespace na primeira coluna, com ele conseguimos verificar dados adicionais sobre o namespace

## Exemplos

Listando todos os namespaces
```bash
sudo lsns
```

Listando todos namespaces de montagem

```bash
sudo lsns -t mnt
```

Listando todos namespaces de PID

```bash
sudo lsns -t pid
```

Listando os namespaces e especificando o caminho proc dos namespaces

```bash
lsns -o +PATH

```

Outra opção é listar os processos associados a um descritor:

```bash
ls -l /proc/*/ns/net | grep $(readlink /var/run/netns/mynet)
```


## Lista de possíveis colunas utilizando a flag -o

Available output columns:
* **NS**  identificador de espaço de nome (número de inode)
* **TYPE**  tipo de espaço de nome
* **PATH**  caminho do espaço de nome
* **NPROCS**  número de processos no espaço de nome
* **PID**  menor PID no espaço de nome
* **PPID**  PPID do PID
* **COMMAND**  linha de comando do PID
* **UID**  UID do PID
* **USER**  nome de usuário do PID
* **NETNSID**  namespace ID as used by network subsystem
* **NSFS**  nsfs mountpoint (usually used network subsystem)
* **PNS**  parent namespace identifier (inode number**)**
* **ONS**  owner namespace identifier (inode number) 