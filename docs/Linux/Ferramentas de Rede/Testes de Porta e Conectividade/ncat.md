# ncat

## O que é

Implementação avançada do netcat no Nmap. Resolve cenários com TLS, proxy e automação mais robusta.

## Para que serve

- Diagnosticar comportamento de rede em serviços Linux
- Validar hipóteses durante troubleshooting de incidentes
- Coletar evidências para análise pós-incidente
- Apoiar observabilidade em ambientes de produção

## Quando usar

- Um serviço não consegue se comunicar com outro serviço
- Há suspeita de timeout, perda de pacote ou rota incorreta
- DNS, porta, firewall ou TLS podem estar causando falha
- É necessário validar conectividade em host, VM, container ou namespace


## Exemplos de uso

```bash
ncat -vz 10.0.0.20 443
ncat --ssl github.com 443
ncat -l 8080
```

## Exemplo de saída

```text
$ ncat -vz 10.0.0.20 443
... saída resumida ...
```

Analise campos como código de resposta, tempo de execução, destino efetivo, interface usada e mensagens de erro. Esses pontos normalmente indicam se o problema está em DNS, rota, porta, firewall ou TLS.

## Dicas de troubleshooting

- Rode o comando no mesmo contexto do problema (host, container, pod ou namespace)
- Compare resultado com e sem resolução de nomes para separar erro de DNS de erro de rede
- Cruze o resultado com logs da aplicação, métricas e eventos do sistema
- Faça testes de controle para um alvo conhecido saudável e compare diferenças

## Comparação com ferramentas similares

ncat vs nc: ncat é mais completo para testes avançados de conectividade.

## Flags importantes

- -h/--help: exibe ajuda e sintaxe.
- -v ou modo verboso: aumenta detalhes para diagnóstico.
- -n: evita resolução de nome quando aplicável.
- timeout/opções de tempo: ajuda a detectar lentidão e falhas intermitentes.

## Boas práticas

- Registre comandos e saídas relevantes no ticket/incidente
- Evite testes destrutivos em produção; priorize inspeção e leitura
- Execute múltiplos testes em camadas diferentes antes de concluir causa raiz
- Documente o que foi validado para acelerar troubleshooting futuro

## Referências

- man page: `man ncat`
- Documentação oficial da ferramenta/projeto
