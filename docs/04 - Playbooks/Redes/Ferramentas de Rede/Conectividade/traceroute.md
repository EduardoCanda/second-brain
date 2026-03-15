# traceroute

## O que é

Ferramenta para mapear os saltos (hops) até um destino, aumentando progressivamente o TTL e analisando respostas ICMP/UDP/TCP ao longo do caminho.

## Para que serve

- Descobrir em qual trecho da rota ocorre aumento de latência ou perda.
- Confirmar por quais redes/provedores o tráfego está passando.
- Comparar caminhos de ida entre ambientes diferentes (on-prem, cloud, VPN).
- Investigar assimetria de rota (quando um lado enxerga caminho muito diferente do outro).

## Quando usar

- `ping` mostra perda/latência alta e você precisa saber "onde" isso começa.
- Aplicação falha só para uma região/ASN/provedor específico.
- Suspeita de bloqueio por firewall em determinado salto.
- Mudança de rota após alteração de BGP, túnel ou link WAN.

## Exemplos de uso

```bash
# Padrão (normalmente UDP)
traceroute 8.8.8.8

# Sem resolver nomes dos hops (mais rápido e objetivo)
traceroute -n api.exemplo.com

# Simular tráfego HTTPS (TCP/443) para atravessar firewalls restritivos
traceroute -T -p 443 api.exemplo.com

# Reduzir número máximo de saltos
traceroute -m 15 10.20.30.40
```

## Exemplo de saída

```text
$ traceroute -n 8.8.8.8
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.0.1   1.123 ms  1.003 ms  0.950 ms
 2  10.10.0.1     4.880 ms  4.731 ms  4.692 ms
 3  * * *
 4  200.160.2.1  15.102 ms 14.993 ms 15.221 ms
 5  8.8.8.8      18.334 ms 18.205 ms 18.441 ms
```

Leitura prática da saída:

- Linha `* * *`: hop não respondeu (rate-limit/filtragem ICMP), não necessariamente falha de trânsito.
- Salto com latência alta **isolada** e hops seguintes normais: geralmente apenas controle-plane lento.
- Latência que sobe e permanece alta nos hops seguintes: degradação real a partir daquele ponto.
- Parada antes do destino: possível bloqueio na borda, rota incompleta ou destino não respondendo ao método usado.

## Dicas de troubleshooting

- Teste múltiplos métodos: UDP (padrão), ICMP (`-I`) e TCP (`-T`) para contornar políticas de firewall.
- Rode traceroute a partir dos dois lados (origem e destino) para evidenciar assimetria.
- Compare horário de pico vs fora de pico para identificar congestionamento temporal.
- Valide MTU quando houver comportamento estranho com pacotes maiores (usar `tracepath` em conjunto).

## Flags importantes

- `-n`: não faz DNS reverso dos hops.
- `-m <hops>`: TTL máximo.
- `-q <N>`: número de sondas por hop.
- `-w <seg>`: timeout por sonda.
- `-I`: usa ICMP Echo.
- `-T`: usa TCP SYN.
- `-p <porta>`: porta de destino (útil com `-T` para simular app real).

## Boas práticas

- Priorize `-n` em incidentes para reduzir ruído e tempo de execução.
- Alinhe método de teste com protocolo da aplicação (ex.: TCP/443 para APIs HTTPS).
- Salve saída completa com timestamp para comparação histórica entre incidentes.
- Não concluir "link quebrado" só por `* * *`; confirme com testes complementares (`mtr`, `tcpdump`, logs).

## Referências

- `man traceroute`
- Projeto traceroute for Linux: https://traceroute.sourceforge.net/
