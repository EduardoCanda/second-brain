# The Dual Write Problem
## Definição:
Problema conhecido quando uma aplicação exerce duas operações de escrita simultaneamente. Por exemplo, salvar os dados no DB e postar uma mensagem no tópico kafka. No fluxo feliz, os dados seriam salvos e a mensagem postada seria consumida por todos os consumidores que estivessem escutando o broker.
![[Pasted image 20260829013159.png]]

**Exemplo**
O problema é quando os dados são salvos no DB e a mensagem falha ao ser enviada. Por qualquer motivo... O Kafka estava indisponível; Teve uma falha de rede; O servidor caiu bem na hora do post; anyway....
A imagem abaixo representa um cenário de falha no post da mensagem:
![[Pasted image 20260829014231.png]]

Neste caso, teremos uma falha na arquitetura proposta. Os processos que dependem do consumo dessas mensagens nunca irão acontecer e isso pode ser crítico para o projeto em questão.

## Correção:
Há um padrão de projeto feito para resolucionar esse tipo de problema.
**Transacional Outbox Pattern**.

### Transacional Outbox Pattern
![[Pasted image 20260831013643.png]]

Basicamente, essa Pattern mantém a arquitetura atual, com adições de uma nova tabela do DB, a "Outbox Table" e um consumer.

A **Outbox Table** vai servir como uma espécie de caixa postal. Toda vez que houver um evento de registro de usuário, essa tabela guardará o evento em si.
![[Pasted image 20260831014646.png]]

Com o evento criado, teremos o consumer lendo da Outbox Table.
![[Pasted image 20260831015449.png]]

A leitura nessa tabela é discutível. O consumer pode ficar fazer **connection pooling** no db de tempos em tempos; O consumer pode ser usado em um evento de registro na Outbox Table; No entanto isso não é o foco.

Uma vez que o consumer leu dessa tabela, ele ficará encarregado de postar a mensagem ao tópico kafka. Só depois da confirmação do post, nós atualizaremos a Outbox Table com o status de "PROCESSED" por exemplo.

E aí teremos certeza de que o usuário realmente foi criado e os processos que dependem do post dessa mensagem serão executados e a falha na arquitetura está corrigida.
