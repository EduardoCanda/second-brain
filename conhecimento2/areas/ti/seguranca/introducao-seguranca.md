---
tags:
  - Fundamentos
  - Segurança
  - NotaPermanente
---
Quando pensamos em segurança nos tempos atuais, precisamos entender que é um tema extremamente complexo, portanto dificil de examinar, pois ele aborda várias disciplinas que entram em sinergia para que ela seja efetiva.

È importante sempre ressaltar que em todas as camadas que a segurança é aplicada podemos ter conceitos e técnicas globais que são aplicados independente de onde a segurança é abordada como por exemplo [[criptografia-simetrica]] e [[criptografia-assimetrica]] que são usadas para transferência segura de dados entre um cliente e um servidor, garantindo que aqueles dados serão entregues e lidos somente por um participante autorizado para tal ação, além de ter a possíbilidade de ter um "tunning", quando nos referimos a performance dessa criptografia.

Também é importante ressaltar que existem padrões que são amplamente utilizados para transferencia de tokens como [[JWT]] e [[JWT#🕳️ **2. Token Opaco**|Token Opacos]] que são representação de credenciais assinadas por um servidor, podendo conter informações de autorização e por o JWT ser autocontido existe a possibilidade de [[Validacao Online X Offline Client Credentials OAUTH 2.0]] validação offline utilizando [[JWKS]] públicas.

# Equipes

Podemos entender como seguro um sistema que tenha equipes treinadas para atuar em um contexto de [[sre]], monitorando e atuando sempre que há problemas para impedir uma eventual indisponibilidade sistemica.

Eu entendo que um sistema seguro necessáriamente precisa de uma equipe multidisciplinar que entenda de todo contexto, lembrando sempre que nem toda falha que pode gerar impacto financeiro através de invasões significa necessáriamente que essa é a unica forma de risco, muitas vezes pode existir um risco de imagem a instituição devido a falhas comprometendo a confiabilidade de uma empresa e também sua reputação

# Aplicação

Também podemos falar sobre [[autenticacao-autorizacao]], que visa controlar e identificar eventuais participantes que venham a acessar o nosso sistema, mas não somente usuários, como também sistemas participantes de nossa integração, e pensando em integração podemos abordar [[Design Patterns]] que podem influenciar muito em toda nossa arquitetura, contribuindo para uma estabilidade e sucesso de nosso sistema, isso também pode refletir em muito na segurança de um sistema.

Essa questão pode abordam inclusive [[seguranca-aplicacoes]], implementando mecanismos de analíse estática de codigo para garantir que não só as questões de autorização sejam configuradas mas também que a aplicação acessada esteja segura em relação ao seu código.

Um ponto importantissimo a ser abordado também é o uso [[Resumo OAUTH 2.0]] em comunicações entre sistemas através de [[JWT|tokens de acesso]], oque pode facilitar em muito a gestão de segurança de autorização, uma vez que essa estratégia pode trazer benefícios como validação offline, para mais informações a respeito acesse [[Fluxo Client Credentials OAUTH 2.0]] e também [[Resumo OAUTH 2.0]].

Um outro ponto que podemos explorar é a possíbilidade de utilizar meios de [[multi-threading-imutabilidade-java]], sabendo configurar corretamente a aplicação para não expor o serviço de negócio a brechas de race condition entre outras vulnerabilidades de aplicação, além de configurar corretamente o [[resumo-gerenciamento-memoria-java|Garbage Collector]] para obter o máximo aproveitamento.
# Redes

Não se limita somente a camada de aplicação, podemos falar amplamente de configurações de redes, trazendo por exemplo configurações de [[protocolo-enderecamento-ipv4|endereçamento]], podendo segmentar toda infra-estrutura em redes diferentes, trabalhando com tanto [[protocolo-ipv4]] quanto o [[protocolo-ipv6]] além de implementar amplamente configurações de segurança como [[Security Groups|firewalls em cloud]], que garantem que instancias expecíficas tenham regras de entrada e saída bem explícitas.


# Questões importantes

[[gerenciamento-segredos]]
[[worloads-sensiveis-lpgd]]