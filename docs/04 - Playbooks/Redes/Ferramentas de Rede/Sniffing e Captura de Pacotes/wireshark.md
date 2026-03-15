# wireshark

## O que é

Analisador gráfico de protocolos de rede com dissecação profunda de pacotes. Excelente para investigar fluxos complexos (TLS, HTTP/2, DNS, VoIP) com contexto visual.

## Para que serve

- Entender sequência completa de uma sessão (do SYN ao FIN/RST).
- Inspecionar handshake TLS, certificados, ALPN e negociação de versões.
- Reconstituir streams TCP para visualizar payload de aplicação.
- Correlacionar latência entre camadas (rede x aplicação).

## Quando usar

- `tcpdump`/`tshark` já mostraram sintoma, mas falta causa raiz detalhada.
- Há necessidade de análise visual por pacote, com follow stream e gráficos.
- Você precisa apresentar evidência técnica clara para outros times.
- Investigação envolve protocolos com muitos campos e extensões.

## Exemplos de uso

```bash
# Abrir captura já coletada
wireshark -r incidente-api.pcap

# Iniciar captura imediata em interface específica
wireshark -i eth0 -k

# Capturar só DNS (capture filter BPF)
wireshark -i eth0 -f "udp port 53"
```

## Exemplos de saída

No Wireshark a saída é visual (lista de pacotes + detalhes + bytes).
Filtros práticos no campo de display filter:

```text
tcp.flags.syn == 1 && tcp.flags.ack == 0
dns && ip.addr == 10.10.20.15
tls.handshake.type == 1
http.response.code >= 500
```

Leitura rápida:

- Muitos SYN sem SYN-ACK: problema de caminho/firewall/ACL.
- `Server Hello` ausente após `Client Hello`: bloqueio/interceptação TLS ou incompatibilidade.
- Retransmissões TCP frequentes: perda, congestionamento ou MTU.

## Dicas de troubleshooting

- Aplique filtro de captura antes de iniciar para evitar arquivos gigantes.
- Use “Follow TCP Stream” para validar conteúdo e ordem das mensagens.
- Marque pacotes críticos (time reference) para medir intervalos com precisão.
- Compare “Statistics > Conversations” entre cenário saudável e degradado.
- Em ambientes Linux remotos, capture com tcpdump e analise o `.pcap` localmente no Wireshark.

## Flags importantes

- `-i <iface>`: define interface.
- `-k`: inicia captura imediatamente.
- `-f "<capture-filter>"`: filtro BPF na captura.
- `-r arquivo.pcap`: abre arquivo de captura.
- `-Y "<display-filter>"`: já abre aplicando filtro de visualização.

## Boas práticas

- Não compartilhar `.pcap` bruto sem revisão (pode conter dados pessoais/sigilosos).
- Salvar profile de análise por tipo de incidente (DNS, TLS, API).
- Documentar no ticket quais filtros e streams foram usados como evidência.
- Preferir análise offline em estação segura quando captura contém produção.

## Referências

- `man wireshark`
- https://www.wireshark.org/docs/wsug_html_chunked/
- Cheat Sheet de filtros: https://wiki.wireshark.org/DisplayFilters
