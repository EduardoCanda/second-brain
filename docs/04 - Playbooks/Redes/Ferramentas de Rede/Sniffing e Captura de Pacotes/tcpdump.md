# tcpdump

## O que é

Sniffer de pacotes em linha de comando com filtros BPF (Berkeley Packet Filter). É a ferramenta mais rápida para validar, direto no host Linux, se os pacotes **estão saindo**, **estão chegando** e **como estão chegando**.

## Para que serve

- Confirmar handshake TCP (SYN, SYN-ACK, ACK) em portas específicas.
- Identificar retransmissões, resets (`RST`) e timeouts em conexões.
- Verificar consultas/respostas DNS sem depender do log da aplicação.
- Validar se tráfego foi bloqueado por firewall (pacote sai e não volta).
- Gerar `.pcap` para análise posterior no Wireshark.

## Quando usar

- Aplicação reporta `Connection timed out` ou `Connection refused`.
- Suspeita de problema de rota, NAT, MTU, ACL/security group ou firewall local.
- Serviço em container/pod funciona localmente, mas falha entre nós.
- Você precisa de evidência de rede em incidente (antes de envolver time externo).

## Exemplos de uso

```bash
# Ver tráfego HTTPS sem resolução de nome
sudo tcpdump -i eth0 -nn tcp port 443

# Confirmar DNS (query e response)
sudo tcpdump -i any -nn "udp port 53"

# Capturar somente tráfego entre cliente e servidor
sudo tcpdump -i eth0 -nn host 10.10.20.15 and host 10.10.30.40

# Salvar captura para análise profunda
sudo tcpdump -i eth0 -nn -s 0 -w incidente-api.pcap host 10.10.30.40
```

## Exemplos de saída

```text
14:03:20.100001 IP 10.10.20.15.54012 > 10.10.30.40.443: Flags [S], seq 120001, win 64240, options [mss 1460,sackOK,TS val 123 ecr 0], length 0
14:03:20.100210 IP 10.10.30.40.443 > 10.10.20.15.54012: Flags [S.], seq 998100, ack 120002, win 65160, options [mss 1460,sackOK,TS val 456 ecr 123], length 0
14:03:20.100240 IP 10.10.20.15.54012 > 10.10.30.40.443: Flags [.], ack 1, win 502, options [TS val 124 ecr 456], length 0
```

Leitura rápida:

- `[S]` = cliente tentou abrir conexão.
- `[S.]` = servidor respondeu (porta aberta e caminho OK).
- Sem `[S.]` após vários `[S]` = perda/bloqueio no caminho.
- `[R]` cedo na sessão = porta fechada ou recusa ativa.

## Dicas de troubleshooting

- Capture nos **dois lados** (cliente e servidor) quando possível; elimina dúvidas de caminho.
- Use `-nn` para evitar atraso com DNS reverso durante incidente.
- Comece com filtro amplo (host/porta) e vá refinando; filtro excessivo pode esconder o problema.
- Se suspeitar de MTU, procure ICMP `fragmentation needed`.
- Em Kubernetes, valide namespace certo (`ip netns`, `nsenter`) antes de capturar.

## Flags importantes

- `-i <iface>`: interface de captura (`eth0`, `ens5`, `any`).
- `-nn`: desativa resolução de hostname e serviço (mais fiel e rápido).
- `-s 0`: captura pacote completo (sem truncar payload).
- `-w arquivo.pcap`: grava em arquivo.
- `-c <N>`: encerra após `N` pacotes (útil em scripts).
- `-A` / `-X`: exibe payload ASCII / hex+ASCII (cuidado com dados sensíveis).
- `-vvv`: aumenta nível de detalhe do decode.

## Boas práticas

- Defina janela de captura curta e objetivo claro (ex.: “erro entre 14:00 e 14:05”).
- Masque/controle acesso a `.pcap` (pode conter credenciais/tokens).
- Prefira filtros BPF no início para reduzir volume e ruído.
- Salve junto no incidente: comando usado, horário e interface capturada.

## Referências

- `man tcpdump`
- https://www.tcpdump.org/manpages/tcpdump.1.html
- Wireshark Capture Filters (BPF): https://wiki.wireshark.org/CaptureFilters
