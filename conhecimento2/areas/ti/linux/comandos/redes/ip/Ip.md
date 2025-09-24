---
tags:
  - Linux
  - Redes
  - Fundamentos
ferramenta: cli
---
O Comando ip tem uma enorme quantidade de variações possíveis, com ele é possível gerenciar de maneira geral todos os tipos de configurações da pilha de protocolos TCP/IP, com isso temos uma excelente ferramenta que trás uma sintaxe muito parecida com os comando utilizados em roteadores/dispositivos de redes. Um dos principáis casos de uso desse comando é a possibilidade de realizar investigação de problemas de redes através de alterações temporárias em interfaces/endereçamentos de rede e com isso resolver o problema, sem necessidade de uma configuração mais agressiva.

Esse comando apresenta uma série de objetos, em que cada objeto representa um tipo de ação que pode ser realizada em nossa rede e interfaces, porém é importante ressaltar que essas alterações só ficaram disponíveis em memória, caso haja necessidade de persistir as configurações será necessário aplicar as mesmas em [[arquivos de configuração de rede]], existe também o comando [[nmcli]], que pode trabalhar com configurações permanentes.

Além de ser possível alterar configurações de dispositivos, é possível trabalhar com [[Namespaces de Rede|namespaces]], podendo abranger ainda mais o leque de possibilidades de utilização deste comando, um exemplo de utilização utilizando namespaces é utilizando o objeto  [[ip Netns]].

# Executando e acessando objetos de maneira resumida

È possível executar/acessar instruições/objetos do comando ip de uma forma resumida, todos os objetos/ações vão seguir esse mesmo padrão abaixo

* `ip address [COMANDO]
* `ip addres [COMANDO]
* `ip addre [COMANDO]
* `ip addr [COMANDO]
* `ip add [COMANDO]
* `ip ad [COMANDO]
* `ip a [COMANDO] 

## Argumentos comumente utilizados no agrupamento de comandos de ip

- `valid_lft` → Tempo de vida total do IP antes de expirar, o tempo é medido em segundos.
- `preferred_lft` → Tempo antes de o IP ser marcado como obsoleto.
* `secondary` -> O Ip é considerado secundário na interface
* `broadcast` -> Endereço de broadcast da rede em que o host foi endereçado
* `dev` -> Dispositivo alvo do endereçamento
* `permanent` -> Persiste a configuração para que não seja apagada automaticamente
* `scope` -> Configuração utilizada para segregar acesso ao ip configurado.
# Detalhamento de comandos

[[ip-address]]: Trabalha com endereçamento de ips
[[Ip Link]]: Trabalha com configurações de dispositivos de rede
[[ip Netns]]: Trabalha com gerenciamento de namespaces de redes
