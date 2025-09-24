---
tags:
  - Linux
  - Redes
ferramenta: cli
---
Esse objeto é utilizado para gerenciar perfis de conexões criadas no network manager, conseguimos desde a criação, ativação até a desativação troca de perfil de conexão e exclusão do mesmo, por padrão ao usar somente o nmcli connection, o comando [[nmcli connection show]] é executado, porém não é possível usar as opções do mesmo, somente uma visualização basica de todas a redes.

As conexões são uma abstração e podem ser interpretadas como "perfis", de execução de uma interface de rede, podemos configuração por exemplo se iremos utilizar um servidor DHCP, ou iremos realizar a configuração de endereçamento manualmente, configurando gateway padrão, servidores dns, e roteamento.

Assim como o comando [[nmcli device]], ele possui diversos comandos, e cada um representa uma ação dentro desse contexto de conexões.

# Comandos

Gestão geral de conexões
[[nmcli connection show]]
[[nmcli connection up]]
[[nmcli connection down]]
[[nmcli connection reload]]
[[nmcli connection monitor]]
[[nmcli connection load]]

Manipulação de conexões
[[nmcli connection add]]
[[nmcli connection edit]]
[[nmcli connection modify]]
[[nmcli connection clone]]
[[nmcli connection delete]]
[[nmcli connection import]]
[[nmcli connection export]]