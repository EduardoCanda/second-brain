# dig

## O que é

Ferramenta avançada para consulta DNS com saída detalhada. Resolve análises de delegação, autoridade e respostas específicas por tipo de registro.

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
dig google.com
dig google.com +short
dig @8.8.8.8 google.com A
```

## Exemplo de saída

```text
$ dig google.com
... saída resumida ...
```

Analise campos como código de resposta, tempo de execução, destino efetivo, interface usada e mensagens de erro. Esses pontos normalmente indicam se o problema está em DNS, rota, porta, firewall ou TLS.

## Dicas de troubleshooting

- Rode o comando no mesmo contexto do problema (host, container, pod ou namespace)
- Compare resultado com e sem resolução de nomes para separar erro de DNS de erro de rede
- Cruze o resultado com logs da aplicação, métricas e eventos do sistema
- Faça testes de controle para um alvo conhecido saudável e compare diferenças

## Comparação com ferramentas similares

dig vs nslookup: dig oferece saída mais rica e opções avançadas para troubleshooting detalhado.

## Flags importantes

- +short: saída compacta, ótima para scripts.
- @servidor: consulta um DNS específico.
- -t TIPO: define o tipo de registro.
- -x IP: lookup reverso PTR.

## Boas práticas

- Registre comandos e saídas relevantes no ticket/incidente
- Evite testes destrutivos em produção; priorize inspeção e leitura
- Execute múltiplos testes em camadas diferentes antes de concluir causa raiz
- Documente o que foi validado para acelerar troubleshooting futuro

## Referências

- man page: `man dig`
- Documentação oficial da ferramenta/projeto
