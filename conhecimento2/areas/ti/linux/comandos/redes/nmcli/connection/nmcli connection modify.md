---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para remover uma configuração de uma conexão, é possível fazer isso tanto de forma temporária quanto permanente utilizando a flag `--temporary`. [aqui](https://manpages.org/nm-settings/5) possuí todas opções validas para configuração. 

Esse metodo de edição acaba sendo uma forma objetiva de realizar uma alteração pontual, porém com o comando [[nmcli connection edit]], temos uma forma interativa de alterar uma conexão, com isso podemos alterar diversas opções de uma unica vez.
# Exemplos

Removendo a configuração automática de endereçamento IPV4, temporariamente.
```bash
nmcli connection modify --temporary Fisica ipv4.method manual
```
Modificando diversos parametros de uma vez

```bash
nmcli connection modify Fisica \ 
ipv4.method manual \ 
ipv4.addresses "192.168.15.100,192.168.15.200" \
ipv4.gateway "192.168.15.1" \
ipv4.dns "192.168.15.1"
```

