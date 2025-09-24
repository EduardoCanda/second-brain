---
tags:
  - Linux
  - Laboratorio
  - Redes
  - NotaPermanente
---
Neste laboratório iremos explorar as configurações de endereçamento de rede, porém iremos abordar isso de forma totalmente manual.

Para isso precisamos entender que pode existir um gerenciador de redes, ele normalmente persiste as configurações de maneira automática na interface, então mesmo que utilizemos o comando [[Ip Address Flush]], ele irá atribuir as configurações novamente, sendo necessário primeiramente parar o dispositivo

Primeiramente iremos executar o comando status para obter os dispositivos disponíveis.
```bash
nmcli device status
```

Após isso iremos parar de gerir o dispositivo alvo da configuração
```
nmcli device set enp5s0 managed no
```

Agora sim, ao executar o comando [[Ip Address Flush]], as configuração não seram atribuidas novamente, podendo assim limpar todas configurações para o laboratório
```bash
sudo ip address flush dev enp5s0
```

Verificando se interface possuí algum endereçamento configurado
```bash
ip address show dev enp5s0
```

Verificando rotas, o resultado esperado é a inexistencia das mesmas.
```bash
ip route show
```
Com a interface e as rotas associadas com ela limpa, é possível agora iniciar a configuração dela, inicialmente vamos atribuir um endereço ipv4 na interface.

```bash
sudo ip address add 192.168.15.100/24 \
brd 192.168.15.255 \
valid forever \
preferred forever \
label enp:manual \
dev enp5s0
```

Ao criar essa rota estamos específicando o cidr da rede, isso irá criar uma rota automáticamente(o kernel linux entende que, ao informar o cidr, ele criará uma rota para que essa rede seja devidamente acessada), podemos visualizar essa rota atravez do [[ip route show|comando]] a seguir.

```bash
ip route show
```

Agora ao tentar executar um ping para o endereço do facebook, poderemos ter um problema, pois os únicos endereços acessíveis dentro desta rede configurada são os própios endereços da rede 192.168.15.0/24, com o ping podemos fazer esse teste.

```bash
ping 192.168.15.1 
```
Podemos usar o comando [[ip route get]] também para esse mesmo teste, ele sempre retorna a rota que será utilizada para acessar aquele host

```bash
ip route get 192.168.15.1
```

Ao tentar acessar algum endereço da internet iremos obter erro de conexão, abaixo existe um comando que irá fazer o teste

```bash
ping -4 www.facebook.com
```

Da mesma forma podemos usar o comando ip route get para tentar descobrir a rota que será utilizada, no caso nenhuma será pois ainda não criamos ela.

```bash
ip route get 157.240.12.35
```
Seguindo adiante, agora podemos adicionar uma rota default para esse endereço configurado, com isso teremos como acessar outros hosts fora da rede 192.168.15.0/24, isso incluindo hosts da internet.

```bash 
sudo ip route add default \
via 192.168.15.1 \
dev enp5s0 \
src 192.168.15.100 \
metric 100
```

Executando o mesmo teste agora teremos um cenário positivo, e assim conseguiremos acessar a internet, em alguns testes realizados houve um delay entre a inclusão da nova rota e o primeiro ping com sucesso.

```bash
ping -4 www.facebook.com
```

Se fizemos um teste excluindo a rota durante a execução do comando ping poderemos ver que o comando irá parar de receber pacotes, para tornar isso visual basta iniciar um novo terminal e executar o comando a seguir:

```bash
sudo ip route del default \
via 192.168.15.1 \
dev enp5s0 \
src 192.168.15.100 \
metric 100
```

Após toda essa configuração podemos limpar tudo que fizemos com o comando a seguir e na sequencia, reativar o network manager nesta interface, ou seja iremos manter o nosso ambiente no modo automático.

1. Limpando interface
```bash
sudo ip address flush dev enp5s0
```
2. Exibindo o resultado da limpeza, é esperado que não haja endereçamento configurado.
```bash
ip address show dev enp5s0
```
3. Reativando o gerenciamento da interface via [[NetworkManager]]
```bash
sudo nmcli device set enp5s0 managed yes
```
4. Verificando status da conexão no dispositivo
```bash
nmcli device status
```

5. Verificando novo endereçamento(no meu caso o NetworkManager irá utilizar o DHCP)
```bash
sudo ip address show dev enp5s0
```

# Comando utilizados no laboratório

Comandos de dispositivos
[[nmcli device set]]
[[nmcli device status]]

Comandos  de endereçamento

[[Ip Address Show]]
[[Ip Address Flush]]
[[ip route show]]
[[ip route add]]
[[ip route delete]]
[[ip route get]]

Comandos de ping
[[ping]]