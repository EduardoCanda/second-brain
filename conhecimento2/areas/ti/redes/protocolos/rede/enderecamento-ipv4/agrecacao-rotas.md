---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
Durante nossa configuração de redes, podemos agregar rotas em nosso [[roteamento]], com isso podemos simplificar nossa tabela de roteamento em nosso dispositivo a ideia é simples, caso eu tenho duas subredes próximas, é possível representar uma faixa de endereçamento que tenha abrangência de ambas as redes.

Cabe lembrar que em nenhum momento estão sendo criadas novas redes, isso serve apenas para representar uma faixa de endereçamento ambigua, e simplificar nossa tabela de roteamento.

# Tabela de roteamento exemplo

192.168.0.0/24 via 192.168.0.1
192.168.1.0/24 via 192.168.0.1

# Agregando as duas rotas

Com o exemplo acima podemos então substituir essas duas entrada por uma entrada simplificada.

192.168.0.0/23 via 192.168.0.1

Nessa entrada criamos uma representação para o roteador, já que a partir de agora ele poderá direcionar pacotes seguindo o seguinte range

192.168.0.0/23 a 192.168.1.255/23

1200
123F
