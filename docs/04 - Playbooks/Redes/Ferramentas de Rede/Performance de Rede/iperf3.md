# iperf3

## O que é

Ferramenta de benchmark de rede cliente/servidor para medir **throughput TCP/UDP**, **jitter** e **perda** entre dois pontos.
É a versão mais usada hoje para validar capacidade real de link em datacenter, cloud e VPN.

## Para que serve

- Medir banda útil entre origem e destino (não só link teórico)
- Comparar tráfego de upload vs download (`-R`)
- Detectar gargalo de single stream vs múltiplos fluxos (`-P`)
- Medir qualidade para tráfego sensível (UDP com jitter/loss)
- Gerar saída em JSON para automação e baseline de performance

## Quando usar

- Antes/depois de mudança de MTU, QoS, rota, firewall ou túnel VPN
- Quando aplicação está lenta e você precisa separar problema de rede vs aplicação
- Em validação de capacidade (ex.: "link de 1 Gbps entrega quanto na prática?")
- Em incidentes com "rede oscila" para ter métrica objetiva e repetível

## Exemplos de uso

```bash
# servidor
iperf3 -s

# teste TCP básico (cliente -> servidor)
iperf3 -c 10.0.0.20 -t 20

# teste de download (servidor -> cliente)
iperf3 -c 10.0.0.20 -R -t 20

# múltiplos fluxos para contornar limite por fluxo único
iperf3 -c 10.0.0.20 -P 8 -t 20

# UDP a 200 Mbps com relatório por segundo
iperf3 -c 10.0.0.20 -u -b 200M -i 1 -t 15
```

## Exemplo de saída

```text
$ iperf3 -c 10.0.0.20 -P 4 -t 10
[SUM]   0.00-10.00  sec  1.09 GBytes   936 Mbits/sec    sender
[SUM]   0.00-10.00  sec  1.08 GBytes   928 Mbits/sec    receiver
```

Como interpretar:
- `sender` x `receiver`: diferença grande pode indicar perda/retransmissão
- `Mbits/sec`: throughput efetivo agregado
- Em UDP, observe principalmente `jitter` e `lost/total datagrams`

## Dicas de troubleshooting

- Sempre testar nos **dois sentidos** (normal e `-R`); assimetria aponta para QoS/policing
- Se throughput travar em valor baixo com RTT alto, testar mais streams (`-P 4`, `-P 8`)
- Em UDP, aumente `-b` gradualmente até identificar ponto de perda
- Validar CPU durante teste (`top`/`mpstat`), pois host saturado simula gargalo de rede
- Em container/Kubernetes, executar no mesmo namespace de rede do workload

## Comparação com ferramentas similares

- **iperf3 vs iperf**: iperf3 tem JSON nativo e métricas modernas, mas não conversa com servidor iperf legado
- **iperf3 vs speedtest**: iperf3 mede entre pontos que você controla; speedtest mede Internet com muitos fatores externos

## Flags importantes

- `-s`: modo servidor
- `-c <host>`: modo cliente
- `-R`: inverte direção do teste
- `-P <n>`: múltiplos fluxos paralelos
- `-u`: teste UDP
- `-b <taxa>`: alvo de banda em UDP (ou pacing em alguns cenários)
- `-t <seg>`: duração do teste
- `-i <seg>`: intervalo de relatório
- `-J`: saída JSON

## Boas práticas

- Rodar 3 a 5 testes e usar mediana (evita conclusão por pico isolado)
- Evitar horários de pico quando objetivo for baseline
- Fixar janela de teste (ex.: sempre 20s) para comparabilidade histórica
- Registrar RTT, MTU, número de fluxos e direção junto do resultado
- Não usar em produção sem alinhar janela: `iperf3` pode consumir banda relevante

## Referências

- `man iperf3`
- https://software.es.net/iperf/
