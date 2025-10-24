O powershell é foi designiado para automatizar tarefas e gerenciar as configurações do Windows. Ele combina linha de comando com uma linguagem de script feita em cima do .NET Framework.

Ele é orientado a objeto, oque significa que ele interagir com dados complexos e lidar com o sistema de maneira mais eficiente.

Inicialmente ele era disponível somente no Windows, mas já possui suas versões disponíveis para [[Linux]] e [[MacOS]] também.

---
## Sintaxe básica: Verb-Noun

Os comandos do Powershell são conhecidos como **cmdlets** (pronuncia-se *command-lets*). Eles são muito poderosos, comparados aos comandos tradicionais do [[cmd]].

Eles possuem um padrão de sintáxe Verbo-Acao.

Por exemplo:
```shell
Get-Content # Comando utilizado para ler um arquivo
```



---
## Cmdlets básicos:
Para listar todos os comandos, funções e alias disponíveis no sistema Windows que o Powershell estiver operando, podemos usar o **Get-Command**.

Provávelmente retornará uma lista enorme de cmdlets. É possível filtra-los por tipo. Por exemplo: 

```shell
Get-Command -CommandType "Function"
```

Dessa forma, retonando uma lista mais enxuta. Os filtros podem ser por nomes, tipo de comando, versão, etc.