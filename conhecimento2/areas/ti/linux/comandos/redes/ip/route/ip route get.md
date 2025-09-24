---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para verificar a rota que um determinado deverá ser acessada, com isso podemos de antemão saber minimamente se existe alguma rota para aquele endereço e assim entender como será realizada a conexão, o argumento **to** é utilizado por padrão.

<p style="text-decoration: line-through;color:red">È importante ressaltar que existe um cache de rotas, então uma modificação pode demandar um certo tempo para surtir efeito</p>
A tabela de roteamento atualmente não é armazenada em um cache global, existe apenas um cache para o kernel não reprocessar a rota em casos rápidos, é importante entender como esse sistema funciona, [[Cache de Roteamento Linux|aqui]] temos uma explicação.
# Exemplos

Obtendo a rota de loopback(localhost), a partir do endereço de loopback(redundante)
```bash
ip route get to 127.0.0.1 f 127.0.0.1
ip route get 127.0.0.1 f 127.0.0.1
```

Obtendo a rota para acessar o gateway pelo endereço 192.168.15.4
```bash
ip route get to 192.168.15.1 from 192.168.15.4
```

Obtendo a mesma rota porém através do endereço 192.168.15.12

```bash
ip route get to 192.168.15.1 from 192.168.15.12
```

Especificando usuario na query

```bash
ip route get to 192.168.15.1 from 192.168.15.12 uid 1000
```

Verificando rota de acesso a um sevidor DNS publico, especificando o usuario

```bash
ip route get to 8.8.8.8 from 192.168.15.12 uid 1000
```