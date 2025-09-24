---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para examinar [[socket|sockets]] no nosso Linux, com ele podemos obter diversas informações sobre estes incluindo:

* Processo que está utilizando determinado socket(PID)
* Filtrar sockets pelo estado atual
* Filtrar sockets por ip de origem ou destino
* Filtrar portas por origem ou destino
* Especificar protocolo(TCP/UDP)

Ele vem para substituir o comando [[netstat]], trazendo objetividade para sua utilização além de maior simplificade de velocidade.

Quando nenhuma opção é informada é listada todas os sockets que não estão em estado listening(TCP/UDP/UNIX) que tem conexão estabelecida, é importante ressaltar que alguns processos podem não aparecer caso use a opção -p, sendo necessário executar o programa como su.

# Opções de Saída

Algumas opções são utilizadas na maioria dos casos e abaixo segue a lista de algumas por ordem de utilização

* **-p, --processes** - Informa na saída o processo que está utilizando aquele socket
* **-l, --listening** - Filtra somente processos que estão em estado listening
* **-n, --numeric** - Exibe o socket em formato cru, não tenta resolver os endereços em nome de serviço
* **-t, --tcp** - Exibe somente sockets TCP
* **-u, --udp** - Exibe somente sockets UDP

* **-a, --all** - Exibe todos os sockets, tanto listening quanto non-listening
* 
* **-V --version** - Retorna versão do comando

# Expressões

È possível utilizar expressões para realizar filtros conforme necessidade com operadores lógicos (Equals, Not Equals, Greather Than, Lower Than etc....)


## Exemplos

Filtrando sockets conectados a um determinado socket de destino

```bash
ss dst 0.0.0.0:443
```

Filtrando sockets conectados a um determinado socket de origem

```bash
ss src 0.0.0.0:443
```

Filtrando sockets conectados a uma determinada porta de origem

```bash
ss sport 443
```

Filtrando sockets conectados a uma determinada porta de destino

```bash
ss dport 443
```

Filtrando sockets vinculados a portas conhecidas

```bash
ss dport leq 1023
```

# Filtrando por status

Existe também a possibilidade de filtrar sockets por estado, por exemplo:
Caso utilizar a flag -l, serão listados os sockets em formato listening porém existe um opção dedicada para filtro de estado como nos exemplos abaixo:

## Exemplos

Filtrando processos em estado listening
```bash
ss -pnt state listening
```

Esse comando é equivalente a esse
```
ss -pnlt
```



