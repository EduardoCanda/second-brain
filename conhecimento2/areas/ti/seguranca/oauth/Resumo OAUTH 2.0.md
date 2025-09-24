---
tags:
  - Fundamentos
  - Segurança
  - NotaPermanente
---
Quando pensamos em segurança e [[autenticacao-autorizacao]] atualmente existe um protocolo amplamente difundido no mundo moderno, ele é conhecido como [[Overview OAUTH 2.0|OAUTH 2.0]] e sua principal atribuição é cuidar de mecanismos de autorização delegada.

Por se tratar de um protoloco ele irá detalhar como o fluxo deve ser seguido, quais serão os padrões de comunicações adotados([[protocolo-https]]), e como deve seguir seu fluxo de trabalho.


# Compreensão basica

Basicamente ele funciona da seguinte forma:
	Eu como serviço financeiro **(Client)** desejo consultar todos os lançamentos de um determinado cliente **(Resource Owner)** para isso vou delegar a responsabilidade de autorização para o banco(**Authorization Server**) que irá me conceder um token que me permitirá acessar a funcionalidade de consulta de todos os extratos(**Resource Server**).

No Exemplo acima fica evidente o interesse do Serviço Financeiro(**Client**), em obter uma permissão para consultar os extratos do cliente, porém por uma questão de complience fica dificil deste, receber usuário e senha do cliente(**Resource Owner**), o que obviamente abriria uma série de brechas de segurança e compliance.

Pensando nisso o OAUTH se encaixa perfeitamente como estratégia de delegar essa responsabilidade para uma entidade externa(**Authorization Server**) a nós dois (**Client e Resource Owner**) que além de encapsular toda essa lógica, em muitos casos vai ser a plataforma que também oferece o serviço(**Resource Server**) para o usuário final(**Resource Owner**).

Enviei esse mesmo texto para o Chat GPT e ele complementou de uma forma incrível [[Detalhamento exemplo serviço financeiro PFM|nessa nota]].

[[Logica Funcional OAUTH 2.0|Aqui]] também tem uma nota básica de como é a lógica funcional ao pensar em OAUTH 2.0 e como deve-se raciocinar a respeito

# Maquina X Maquina 

Em comunicações M2M(Maquina para Maquina) o fluxo mais utilizado é o [[Fluxo Client Credentials OAUTH 2.0]], ele apresenta uma simplicidade muito grande além de poder trabalhar com grande escala, trazendo uma padronização para nosso backend.

Não se limitando somente para comunicação M2M, esse protocolo também pode trabalhar com o usuário final([[Exemplo Implementação Tanginvel OAUTH 2.0|Athorization Code Flow]]), podendo delegar esse mecanismo para um [[Tabelas de Participantes OAUTH 2.0|Authorization Server Público]], tirando proveito inclusive de serviços de cloud através da delegação de autorização.

[[Implementacao Própria Authorization Server OAUTH 2.0|Nessa nota]], é feito um exemplo ficticio com uma implementação própria de um [[Tabelas de Participantes OAUTH 2.0|Authorization Server Público]].
# Exemplos de fluxos

[[Exemplo implementação Fluxo Client Credentials OAUTH 2.0]]