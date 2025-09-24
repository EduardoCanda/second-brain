---
tags:
  - Linux
  - Redes
ferramenta: cli
---
O Comando ip address show é utilizado para visualizar configurações de endereçamento de redes, com ele podemos visualizar todas a interfaces de uma unica vez, pode podemos criar filtros para visualizar as configurações de endereçamento de uma única interface caso seja necessária uma visão mais simplificada.

# Exemplos 

Visualizar todas as configurações de interfaces de rede

```bash
# Usando o comando show
ip a show
## Ou
ip a
```
![[ip-address.png]]

Podemos também aplicar filtros na listagem de configurações de interfaces, como por exemplo pelo nome da interface:
```bash
ip a show dev lo
```
![[ip-addr-show-dev.png]]

Exibindo interface de rede ativas
```
ip a show up
```
![[ip-a-show-up.png]]