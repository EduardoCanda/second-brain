---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
As portas são endereços utilizados para [[Camada de Transporte]] para identificar um determinado processo, são utilizadas tanto para identificar um servidor externo quanto para receber respostas, pode ser utilizadas tanto para o [[introducao-protocolo-tcp]] quanto para o [[protocolo-udp]] e tem a possibilidade de utilizar de 0 a 65535 endereços diferentes, ou seja 16 bits.

Ao se juntar com um Endereço de Ip se forma o conhecido socket, que representa um serviço no host, e esse socket deve ser único, caso haja dois programas usando o mesmo socket, irá ocorrer um erro. Para solucionar esse problema você pode trocar a porta em que determinada aplicação irá utilizar ou trocar o endereço ip que a aplicação irá utilizar.

**Exemplos de Sockets**

127.0.0.1:80 -> Servidor Web Localhost
\[::1\]:80 -> Servidor Web Localhost IPV6

# Portas Conhecidas - 0 a 1023

São portas amplamente utilizadas na redes, também conhecidas como portas de sistema, em #Linux  só podem ser associadas a um processo através de permissão de super usuário, são usadas por protocolos de transporte e serviços essenciais por isso todos tem obrigatóriamente tem uma [[RFC]].

Também são de uso exclusivo de servidores.


**Exemplos**

![[portas-conhecidas.png]]
# Portas Registradas - 1024 a 49,151

Portas usadas por aplicações que podem ou não fazer parte do sistema operacional, mas foram registradas pela IANA para evitar conflitos, geralmente não possuem RFC.

Podem ser utilizadas tanto para Clientes tanto para Servidores.+

Não é necessário ser root para utilizar esses endereços.

**Exemplos**

| Aplicação      | Porta padrão |
| -------------- | ------------ |
| PostgreSQL     | 5432         |
| MySQL/MariaDB  | 3306         |
| Docker daemon  | 2375         |
| [[prometheus]] | 9090         |
| Grafana        | 3000         |
# Portas Efêmeras ou Privadas -  49,152 a 65,535

São utilizadas pelo sistema operacional para conexões temporárias(Também conhecidas como portas dinamics/efêmeras), um exemplo prático é uma aba de um navegador, geralmente quando há uma requisição de uma pagina específica o sistema operacional dedica uma porta neste range para realizar essa conexão.

**Exemplo**


Cliente : \[fd12:ab34::1\]:49160
Servidor: \[2606:4700::\]:443

# Ferramentas para utilizar

[[netstat]]
[[ss]]