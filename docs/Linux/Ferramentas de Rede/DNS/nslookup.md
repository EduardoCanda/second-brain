# nslookup

## O que é

Ferramenta clássica para fazer consultas DNS em resolvedores configurados no sistema ou informados manualmente. Resolve dúvidas rápidas de resolução de nomes e registros.

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
nslookup google.com
nslookup -type=mx gmail.com
nslookup 8.8.8.8
```

## Exemplo de saída

```text
$ nslookup google.com
... saída resumida ...
```

Analise campos como código de resposta, tempo de execução, destino efetivo, interface usada e mensagens de erro. Esses pontos normalmente indicam se o problema está em DNS, rota, porta, firewall ou TLS.

## Dicas de troubleshooting

- Rode o comando no mesmo contexto do problema (host, container, pod ou namespace)
- Compare resultado com e sem resolução de nomes para separar erro de DNS de erro de rede
- Cruze o resultado com logs da aplicação, métricas e eventos do sistema
- Faça testes de controle para um alvo conhecido saudável e compare diferenças

## Comparação com ferramentas similares

nslookup vs dig: nslookup é direto para checagens rápidas; dig é melhor para análise aprofundada.

## Flags importantes

- -type=TIPO: consulta tipo específico.
- -debug: saída detalhada.
- servidor DNS no fim do comando: força resolvedor.
- -port=PORTA: usa porta DNS customizada.

## Boas práticas

- Registre comandos e saídas relevantes no ticket/incidente
- Evite testes destrutivos em produção; priorize inspeção e leitura
- Execute múltiplos testes em camadas diferentes antes de concluir causa raiz
- Documente o que foi validado para acelerar troubleshooting futuro

## Referências

- man page: `man nslookup`
- Documentação oficial da ferramenta/projeto
