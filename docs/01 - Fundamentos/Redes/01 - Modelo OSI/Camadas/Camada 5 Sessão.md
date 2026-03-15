Uma vez que os dados são traduzidos ou formatados pela camada de apresentação, a camada de sessão irá criar e manter a conexão para o outro computador no qual os dados são destinados.

Esta camada também é responsável por encerrar a conexão em caso da mesma não ser usada por algum tempo ou  se perder.

Ocasionalmente a sessão pode conter "checkpoints" se houver perda de dados, os dados mais recentes serão salvos e enviados como deveriam terem sido.

Vale ressaltar que cada sessão é única. Significa que os dados não pode trafegar em diferentes sessões, mas podem trafegar entre sessões.