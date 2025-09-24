---
tags:
  - Linux
  - Redes
  - Laboratorio
  - NotaPermanente
---
Para se conectar a uma rede podemos utilizar o comando [[nmcli device wifi connect]], com arguns argumentos é possível especificar uma série de informações sobre a conexão desejada como no exemplo abaixo:

```bash
nmcli device wifi connect "Bertie" ifname wlp4s0 name "ConexaoBerti1" password "lucasberti1"  
```

Após executar a instrução acima, o terminal irá retornar se deu certo ou não.

Será criada uma conexão wifi, é possível também visualizar o status da interface com o comando [[nmcli device status]].

```bash
nmcli device status
```
O Retorno do comando será a interface, status atual e conexão associada.

Também podemos visualizar essa conexão com o comando [[nmcli connection show]] abaixo, o comando abaixo irá mostrar aparecer um hidden no lugar da senha,
```bash
nmcli connection show "ConexaoBerti1" | grep -i "802-11-wireless-security.psk"
```

Com a opção -s é possível inclusive visualizar segredos.
```bash
nmcli -s connection show "ConexaoBerti1" | grep -i "802-11-wireless-security.psk"
```

Agora podemos clonar a conexão com o comando [[nmcli connection clone]] e após esse clone podemos personalizar a conexão com o comando [[nmcli connection modify]], atribuindo uma lista de endereços ip na interface alvo, e na sequencia usar o comando [[Ip Address Show]] para conferir o endereçamento da interface. 

```bash
nmcli connection clone "ConexaoBerti1" "ConexaoBerti2"
nmcli connection modify "ConexaoBerti2" \
ipv4.method "manual" \
ipv4.addresses "192.168.15.100,192.168.15.200" \
ipv4.gateway "192.168.15.1" \
ipv4.dns "192.168.15.1"

nmcli connection up ConexaoBerti2
ip a show dev wlp4s0
```
No caso, podemos separar multiplos ip's com uma virgula, porém existe uma outra forma que seria bem interessante, podemos adicionar um novo endereço de ip a uma lista existente, isso pode ser útil para uma configuração com maior segurança já que iremos somente adicionar mais um endereço, e não iremos realizar uma sobre-escrita no valor completo.

```bash
nmcli connection down ConexaoBerti2 # Desativando conexão na interface

nmcli connection del ConexaoBerti2 # Apagando conexão

nmcli connection clone "ConexaoBerti1" "ConexaoBerti2" # Clonando conexão novamente

# Modificando conexão, mas dessa vez adicionando somente um ip na interface

nmcli connection modify "ConexaoBerti2" \
ipv4.method "manual" \
ipv4.addresses "192.168.15.100" \
ipv4.gateway "192.168.15.1" \
ipv4.dns "192.168.15.1" 

nmcli connection modify "ConexaoBerti2" +ipv4.addresses "192.168.15.200" 
# Usando o operador + para adicionar mais um ip na interface sem sobre-escrita


nmcli con sh ConexaoBerti2 | grep ipv4.addresses # Exibindo endereçamento configurado na interface

nmcli connection up ConexaoBerti2 # Ativando conexão

ip a show dev wlp4s0 # Exibindo configuração de endereçamento na interface alvo
```

Após realizar todo esse script é possível visualizar o endereçamento devidamente configurado pelo [[NetworkManager]].

Um comportamento adicional que podemos observar são as rotas adicionadas na interface configurada, quando executamos o comando [[nmcli connection up]], é possível visualizar que foi adicionada algumas entradas na interface.

```bash
nmcli device disconnect wlp4s0 # Desconectando dispositivo e impedindo que seja realizada uma nova tentativa de conexão

ip route show # Listando tabela de roteamento 

nmcli connection up ConexaoBerti2 # Ativando a conexão novamente

ip route show # Listando tabela de roteamento, dessa vez você irá observar entradas novas na interface
```

No final podemos deletar as duas conexões com o comando [[nmcli connection delete]]

```bash
nmcli connection delete ConexaoBerti1
nmcli connection delete ConexaoBerti2
nmcli con show
```

# Comando utilizados no laboratório

Comandos de dispositivos
[[nmcli device wifi connect]]
[[nmcli device disconnect]]
[[nmcli device status]]

Comandos de conexão
[[nmcli connection clone]]
[[nmcli connection show]]
[[nmcli connection modify]]
[[nmcli connection delete]]
[[nmcli connection down]]
[[nmcli connection up]]

Comandos de ip

[[Ip Address Show]]
[[ip route show]]