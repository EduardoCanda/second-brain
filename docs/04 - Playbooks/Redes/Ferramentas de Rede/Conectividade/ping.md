# ping

## O que é

Ferramenta que envia requisições ICMP Echo Request para medir **alcance**, **latência** e **perda de pacotes** entre origem e destino.

## Para que serve

- Confirmar rapidamente se o host remoto responde no nível de rede (camada 3).
- Medir latência média e jitter básico (`time=` variando muito entre respostas).
- Detectar perda intermitente de pacotes antes de investigar aplicação (HTTP, DB, etc.).
- Validar se a resolução DNS está apontando para o IP esperado (quando usado com hostname).

## Quando usar

- Após alerta de timeout em aplicação e você precisa separar "problema de rede" de "problema de serviço".
- Antes de rodar ferramentas mais pesadas (`mtr`, `tcpdump`) para ter uma linha de base rápida.
- Em incidentes de VPN/site-to-site para validar alcance de gateway e hosts críticos.
- Em troubleshooting de Kubernetes/containers, executando do mesmo namespace/pod afetado.

## Exemplos de uso

```bash
# Teste básico de alcance e latência
ping -c 5 1.1.1.1

# Teste com hostname para validar também etapa de DNS
ping -c 5 api.exemplo.com

# Intervalo curto para capturar intermitência (cuidado em produção)
ping -c 20 -i 0.2 10.10.10.20

# Mostrar timestamp de cada resposta
ping -D -c 5 8.8.8.8
```

## Exemplo de saída

```text
$ ping -c 4 1.1.1.1
PING 1.1.1.1 (1.1.1.1) 56(84) bytes of data.
64 bytes from 1.1.1.1: icmp_seq=1 ttl=57 time=12.4 ms
64 bytes from 1.1.1.1: icmp_seq=2 ttl=57 time=11.8 ms
64 bytes from 1.1.1.1: icmp_seq=3 ttl=57 time=14.1 ms
64 bytes from 1.1.1.1: icmp_seq=4 ttl=57 time=12.0 ms

--- 1.1.1.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 11.8/12.5/14.1/0.9 ms
```

Leitura prática da saída:

- `packet loss > 0%`: indício de instabilidade, congestionamento, policing ou filtragem ICMP.
- `time=` alto e variável: possível fila em link, saturação ou rota subótima.
- `ttl` mudando entre respostas: pode indicar caminhos diferentes (ECMP/roteamento dinâmico).
- `unknown host`: falha de DNS, não de conectividade IP.

## Dicas de troubleshooting

- Se `ping hostname` falhar e `ping IP` funcionar, foque em DNS (`resolv.conf`, servidor DNS, search domain).
- Se nenhum destino externo responde, teste gateway local primeiro: `ip route` + ping no next-hop.
- ICMP pode ser bloqueado por firewall; ausência de resposta não prova indisponibilidade do serviço TCP.
- Em nuvem, valide regras de Security Group/NACL para ICMP antes de concluir queda de link.

## Flags importantes

- `-c <N>`: limita quantidade de pacotes (evita execução infinita).
- `-i <seg>`: define intervalo entre pacotes.
- `-W <seg>`: timeout para cada resposta.
- `-s <bytes>`: altera payload (útil para testes de MTU/fragmentação).
- `-4` / `-6`: força IPv4 ou IPv6.
- `-n`: não resolve DNS reverso (saída mais rápida e estável para diagnóstico).
- `-D`: adiciona timestamp por linha de resposta.

## Boas práticas

- Sempre registrar origem do teste (host/pod/namespace), horário e destino.
- Rodar pelo menos 20–50 pacotes quando investigar intermitência; 4 pacotes é só sanity check.
- Combinar com `mtr` quando houver perda para localizar em qual salto começa degradação.
- Não usar flood ping em produção sem autorização (`-f` pode impactar rede/alvo).

## Referências

- `man ping`
- iputils: https://github.com/iputils/iputils
- RFC 792 (ICMP): https://www.rfc-editor.org/rfc/rfc792
