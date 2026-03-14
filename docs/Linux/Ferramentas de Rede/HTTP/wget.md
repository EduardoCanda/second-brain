# wget

## O que é

Cliente de download não interativo para HTTP/HTTPS/FTP. Resolve validação de disponibilidade e transferência de conteúdo.

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
wget --spider -S https://example.com
wget -O /tmp/index.html https://example.com
wget --timeout=5 https://api.exemplo.com/health
```

## Exemplo de saída

```text
$ wget --spider -S https://example.com
... saída resumida ...
```

Analise campos como código de resposta, tempo de execução, destino efetivo, interface usada e mensagens de erro. Esses pontos normalmente indicam se o problema está em DNS, rota, porta, firewall ou TLS.

## Dicas de troubleshooting

- Rode o comando no mesmo contexto do problema (host, container, pod ou namespace)
- Compare resultado com e sem resolução de nomes para separar erro de DNS de erro de rede
- Cruze o resultado com logs da aplicação, métricas e eventos do sistema
- Faça testes de controle para um alvo conhecido saudável e compare diferenças

## Comparação com ferramentas similares

wget vs curl: wget prioriza download/espelhamento; curl prioriza requisições customizadas.

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

- man page: `man wget`
- Documentação oficial da ferramenta/projeto
