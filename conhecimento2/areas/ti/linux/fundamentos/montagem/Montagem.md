---
tags:
  - Linux
  - Fundamentos
  - NotaPermanente
categoria: sistema_arquivos
---
No linux, o sistema de arquivos é muito diferente comparado ao windows, normalmente quando olhamos a raiz de diretórios "/" temos a tendencia de pensar que todos os diretórios subsequentes estará dentro do mesmo disco(Igual c:/ do windows), porém isso não acontece.

Os diretórios montados podem pertencer a diversos dispositivos, e mesmo assim ser representados dentro da mesma raiz, isso facilita muito a gestão de arquivos e traz uma visão unificada de todos arquivos de nosso sistema, para mais informações [[Estrutura de Diretorios|acesse aqui]].

Todos os dispositivos que são montados no nosso sistema devem ser do tipo de bloco, dispositivos de bloco são dispositivos que fazem leitura e escrita de dados em unidades fixas "blocos", esses blocos podem representar uma massa de dados maior dentro do sistema de arquivos desse dispositivo(512 bytes, 4KB etc...), e o acesso aos blocos desse dispositivo é feito diretamente, podendo haver saltos entre blocos, o sistema operacional se comunica com os dispositivos de blocos através de módulos especializados(drivers) como por exemplo os carregados no [[Initramfs]] que é um exemplo prático de montagem durante a inicialização do nosso sistema linux.

Nestes dispositivos de blocos, o bloco por si só representa a menor unidade endereçada, com isso existe a possibilidade de percas em memória pois caso um arquivo faça a alocação de 2 blocos e meio, esse terceiro bloco fica indisponível.Nesses dispositivos existe uma tabela logica para correlacionar os endereços lógicos dos blocos em endereços físicos no dispositivo.

Eles também apresentam mecanismos de escrita lazy, e caching para melhorias de performance.

Notas importantes sobre montagem: 

[[Configurações de propagação]]
[[Exemplos de dispositivos de blocos]]
[[Dispositivos Virtuais]]
[[Comandos Para Gerenciamento]]
[[Exemplos de Diretorios]]
[[Arquivos de Configuração]]
[[Identificadores de montagem]]
