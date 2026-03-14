# resolvectl

## O que é

CLI do systemd-resolved para consultar e depurar resolução local. Resolve problemas de cache DNS e configuração por interface.

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
resolvectl status
resolvectl query kubernetes.default.svc.cluster.local
resolvectl flush-caches
```

## Exemplo de saída

```text
$ resolvectl status
... saída resumida ...
```

Analise campos como código de resposta, tempo de execução, destino efetivo, interface usada e mensagens de erro. Esses pontos normalmente indicam se o problema está em DNS, rota, porta, firewall ou TLS.

## Dicas de troubleshooting

- Rode o comando no mesmo contexto do problema (host, container, pod ou namespace)
- Compare resultado com e sem resolução de nomes para separar erro de DNS de erro de rede
- Cruze o resultado com logs da aplicação, métricas e eventos do sistema
- Faça testes de controle para um alvo conhecido saudável e compare diferenças

## Comparação com ferramentas similares

Não há substituto único; escolha com base na camada que você precisa observar (DNS, transporte, aplicação ou pacote).

## Flags importantes

- status: mostra configuração e DNS por link.
- query NOME: resolve nome explicitamente.
- dns IFACE: exibe DNS da interface.
- flush-caches: limpa cache do resolvedor local.

## Boas práticas

- Registre comandos e saídas relevantes no ticket/incidente
- Evite testes destrutivos em produção; priorize inspeção e leitura
- Execute múltiplos testes em camadas diferentes antes de concluir causa raiz
- Documente o que foi validado para acelerar troubleshooting futuro

## Referências

- man page: `man resolvectl`
- Documentação oficial da ferramenta/projeto
