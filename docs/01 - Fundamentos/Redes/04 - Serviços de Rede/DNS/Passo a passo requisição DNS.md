Passo a Passo
### 1 - Consulta inicial
O Client envia uma consulta ao Local DNS perguntando pelo IP de um domínio (ex.: www.exemplo.com).

### 1.1 Cache
Se o Local DNS já possuir a resposta em cache e o TTL for válido, ele retorna o IP imediatamente.
O fluxo termina aqui.

### 2 - Consulta ao Root DNS Server
Caso não haja cache, o Local DNS consulta um Root DNS Server para saber quem é responsável pelo TLD do domínio (ex.: .com).

### 3 -  Retorno do TLD
O Root DNS Server retorna os endereços dos TLD DNS Servers correspondentes ao TLD solicitado.

### 4 -  Consulta ao TLD DNS Server
O Local DNS consulta o TLD DNS Server perguntando qual é o Authoritative DNS Server do domínio (ex.: exemplo.com).

### 5 - Retorno do Authoritative DNS
O TLD DNS Server retorna o endereço do Authoritative DNS Server responsável pelo domínio.

### 6 -  Consulta ao Authoritative DNS
O Local DNS consulta diretamente o Authoritative DNS Server solicitando o registro do domínio (A/AAAA de www.exemplo.com).

### 7 -  Retorno do IP final
O Authoritative DNS Server retorna o IP do domínio.
O Local DNS armazena a resposta em cache (respeitando o TTL).
O IP é retornado ao Client, que então pode iniciar a conexão com o servidor de destino.

