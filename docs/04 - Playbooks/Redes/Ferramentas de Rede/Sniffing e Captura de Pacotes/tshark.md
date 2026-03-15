# tshark

## O que é

Versão CLI do Wireshark para captura e dissecação de protocolos. Ideal para ambientes sem interface gráfica e para automação em scripts/CI.

## Para que serve

- Extrair campos específicos de protocolos (DNS, TLS, HTTP, DHCP, etc.).
- Filtrar tráfego com display filter do Wireshark (`-Y`) em arquivos `.pcap`.
- Gerar relatórios rápidos de conversas, endpoints e estatísticas.
- Fazer troubleshooting reproduzível em servidores Linux headless.

## Quando usar

- Você já tem um `.pcap` e precisa responder perguntas objetivas rápido.
- Precisa automatizar análise de captura em pipeline de diagnóstico.
- Quer validar handshake TLS, SNI, códigos HTTP ou erros DNS por CLI.
- Não pode abrir Wireshark gráfico no servidor por segurança/acesso.

## Exemplos de uso

```bash
# Capturar tráfego HTTPS na interface
sudo tshark -i eth0 -f "tcp port 443"

# Listar apenas queries/respostas DNS de um pcap
tshark -r incidente.pcap -Y "dns" -T fields -e frame.time -e ip.src -e dns.qry.name -e dns.a

# Ver somente handshake TLS
tshark -r incidente.pcap -Y "tls.handshake" -T fields -e ip.src -e ip.dst -e tls.handshake.type

# Descobrir top conversas TCP
tshark -r incidente.pcap -q -z conv,tcp
```

## Exemplos de saída

```text
$ tshark -r incidente.pcap -Y "dns.flags.response == 0" -T fields -e ip.src -e dns.qry.name
10.10.20.15 api.interna.local
10.10.20.15 redis.interna.local
```

```text
$ tshark -r incidente.pcap -Y "tls.handshake.type == 1" -T fields -e ip.dst -e tls.handshake.extensions_server_name
10.10.30.40 api.empresa.com
```

Leitura rápida:

- Query DNS sem resposta correspondente indica perda, bloqueio ou servidor DNS indisponível.
- SNI diferente do hostname esperado pode explicar erro de certificado TLS.

## Dicas de troubleshooting

- Separe **capture filter** (`-f`, reduz o que entra) de **display filter** (`-Y`, filtra o que já foi capturado).
- Para automação, use `-T fields` com campos explícitos (`-e`) e evite saída “bonita”.
- Se o volume estiver alto, combine `-a duration:60` para capturas curtas.
- Sempre valide timezone/clock do host ao correlacionar com logs.
- Use `-n` para evitar resolução de nomes e acelerar análise.

## Flags importantes

- `-i <iface>`: interface de captura.
- `-f "<capture-filter>"`: filtro BPF na captura.
- `-Y "<display-filter>"`: filtro de dissecação Wireshark.
- `-r arquivo.pcap`: lê captura existente.
- `-T fields` + `-e campo`: saída estruturada para parsing.
- `-q -z <estatística>`: relatórios (conversas, endpoints, protocolos).
- `-w arquivo.pcap`: grava captura.

## Boas práticas

- Padronize comandos de coleta para incidentes recorrentes.
- Versione filtros úteis (DNS, TLS, HTTP) em runbooks da equipe.
- Remova/anonimize dados sensíveis ao compartilhar saída.
- Guarde comando e hash do arquivo `.pcap` para cadeia de evidência.

## Referências

- `man tshark`
- https://www.wireshark.org/docs/man-pages/tshark.html
- Wireshark Display Filters: https://wiki.wireshark.org/DisplayFilters
