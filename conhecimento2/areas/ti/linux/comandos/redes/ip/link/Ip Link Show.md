---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando ip link show tem como proposito a listagem de dispotivos de rede, ele apresenta diversas informaçoes de interfaces de redes, podemos visualizar detalhes de como tal interface está configurada, status atual, endereçamento físico, mecanismo de fila entre outras diversas possibilidades.

# Exemplos

Visualizando todas interfaces de rede
```bash
ip link show
```
![[ip-link-show.png]]

Visualizando uma interface de rede específica

```bash
ip link show dev enp5s0
```
![[ip-link-show-dev.png]]

Visualizando interfaces de redes ativas
```bash
ip link show up
```
![[ip-link-show-up.png]]

Visualizando interfaces de redes de um grupo específico
```bash
ip link show group default
```
![[ip-link-show-group-default.png]]
# Tradução dos campos na coluna

Abaixo, está uma tabela com as colunas principais retornadas pelo comando `ip link show`:

| **Campo**                                           | **Descrição**                                                                                                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Índice** (`2:`)                                   | Número da interface no sistema (exemplo: `2` para `enp5s0`).                                                                                                                                           |
| **Nome da Interface** (`enp5s0`)                    | Nome da interface de rede.                                                                                                                                                                             |
| **Flags** (`<BROADCAST,MULTICAST,UP,LOWER_UP>`)     | Conjunto de atributos da interface, como:  <br>- `BROADCAST`: Suporta broadcast  <br>- `MULTICAST`: Suporta multicast  <br>- `UP`: Interface está ativa  <br>- `LOWER_UP`: Interface tem um link ativo |
| **MTU** (`mtu 1500`)                                | Unidade máxima de transmissão da interface.                                                                                                                                                            |
| **qdisc** (`qdisc pfifo_fast`)                      | Disciplina de enfileiramento (Queue Discipline) da interface, usada para controle de tráfego.                                                                                                          |
| **State** (`state UP`)                              | Estado atual da interface:  <br>- `UP`: Ativa  <br>- `DOWN`: Desativada  <br>- `UNKNOWN`: Estado indefinido  <br>- `DORMANT`: Aguardando ativação                                                      |
| **Mode** (`mode DEFAULT`)                           | Modo de operação da interface. Em geral, é `DEFAULT`.                                                                                                                                                  |
| **Group** (`group default`)                         | Grupo ao qual a interface pertence.                                                                                                                                                                    |
| **Queue Length** (`qlen 1000`)                      | Tamanho da fila de pacotes em buffer antes da transmissão.                                                                                                                                             |
| **Endereço MAC** (`link/ether a8:a1:59:45:77:30`)   | Endereço físico (MAC) da interface.                                                                                                                                                                    |
| **Endereço de Broadcast** (`brd ff:ff:ff:ff:ff:ff`) | Endereço de broadcast da interface.                                                                                                                                                                    |