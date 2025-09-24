---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
  - todo
categoria: logs
ferramenta: fluentbit
---
- [x] Entender pontos fundamentais das configurações de INPUT ✅ 2025-09-03

> O INPUT é utilizado para a entrada de nosso pipeline,a fonte de dados e contendo plugins nativos como o tail que funciona como o [[tail|comando tail]] mais informações sobre ele [[fluentbit-input|aqui]]
> Existe a possibilidade de implementar o mecanismo de resiliência para armazenar chunks em storage, para isso utilize a opção storage.type filesystem

- [ ] Entender pontos fundamentais das configurações de PARSER

- [ ] Entender pontos fundamentais das configurações de FILTER

- [x] Entender pontos fundamentais das  configurações de OUTPUT ✅ 2025-09-09

> Essa configuração reflete para onde os dados do nosso pipeline serão enviados, aqui são utilizados plugins como [[loki]].
> Nessa sessão é possível configurar pontos de resilitência como o numero máximo de retentativas de envio para o destino em um eventual erro antes do descarte do chunk.

- [x] Entender pontos fundamentais das  configurações de SERVICE ✅ 2025-09-09

> Trata-se de configurações a respeito do comportamento global do fluentbit, como: storage, configurações de web server, configurações de parsers, nível de log e flush.

- [x] Entender como funciona os chunks  e como os chunks são armazenados ✅ 2025-09-09

> Os chunks são agrupamentos de dados do fluentbit, eles representam um agrupamento de logs coletados e funcionam de maneira analoga a um diretório de logs.
> Dependendo da configuração storage, eles são armazenados em memória(RAM) ou em disco.
> O Tamanho de um chunk pode variar conforme o flush configurado.

- [x] Entender configurações de buffer e storage ✅ 2025-09-09

>  São essencias para trabalhar a resiliência do fluent-bit, por se tratar de uma ferramenta de transferência de logs(Forwarder), ele trabalha com inter-dependências, e caso alguma dependencia tenha alguma disponibilidade, existe a necessidade de armazenar os eventos, no período em que o OUTPUT estiver indisponível.
> Pensando nisso existe tanto a possibilidade de configurar esse armazenamento em memória(memory), tanto em disco(filesystem), e aumentando um pouco o contexto para o nível de kubernetes, precisamos pensar se esse armazenamento será em um disco efêmero, ou um volume persistente.
> Boa parte dessas configurações ficam em SERVICE, porém se extendem para INPUT e OUTPUT.
> Os chunks são enviados diretamente para a configuração específicada.

- [x] Implementar volume persistente para armazenamento temporário de chunks ✅ 2025-09-09

> Essa meta foi necessária, por se tratar de um problema durante a simulação de falhas no OUTPUT, quando o container era reiniciado, todos os chunks armazenados se perderam, havendo necessidade de implementar um mecanismo de persistência.
> Durante a implementação desse mecanismo obtive alguns problemas, principalmente ao provisionar persistência para o [[loki]]
    
    
- [x] Simular falhas nos outputs observando o storage como vai crescendo a medida que o volume de chunks se acumulam. ✅ 2025-09-09

> Esse comportamento foi simulado exatamente como o esperado, e tive que realizar algumas configurações adicionais para resolver pois configurando somente o storage no SERVICE não era efetivo.
> Durante os testes a aplicação descartava os chunks e aparentemente havia persistência em disco, porém após um determinado tempo/retentativa o mesmo era descartado.
> Foi necessário alterar na sessão OUTPUT, para retirar a configuração de descarte de chunks após retentativa, e feito isso o problema foi resolvido. Entretanto ainda havia um problema para ser resolvido, quando o pod era reiniciado os dados se perdiam, mesmo mapeando os dados para um host path, isso aconteceu por conta que o armazenamento era feito no  armazenamento efêmero.


- [x] Configurar grace period de encerramento, preservando os chunks persistidos. ✅ 2025-09-10

- [ ] Entender como funciona o Routing
- [ ] Habilitar coleta de metricas via [[servicemonitor-crd|service monitor]]