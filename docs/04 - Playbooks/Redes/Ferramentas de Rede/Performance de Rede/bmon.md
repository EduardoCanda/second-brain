# bmon

## O que é

Bandwidth Monitor em modo terminal para observar estatísticas de interface (taxa, pacotes, erros, drops) em tempo real.

## Para que serve

- Acompanhar throughput e saúde da interface durante incidentes
- Detectar aumento de erros/drops junto com degradação de performance
- Observar várias interfaces de uma vez (físicas, VLAN, bridge, bond)

## Quando usar

- Você precisa de mais detalhe de interface do que o `nload` oferece
- Há suspeita de problema em NIC/camada 2 (drops, overruns, colisões)
- Durante testes de carga para verificar estabilidade de link

## Exemplos de uso

```bash
# visão padrão
bmon

# apenas interface específica
bmon -p eth0

# atualização a cada 1s
bmon -r 1
```

## Exemplo de saída

```text
Interfaces: eth0
RX:  820.4Mbit/s   packets 74213/s   errs 0   drop 12
TX:  790.1Mbit/s   packets 70110/s   errs 0   drop 0
```

Como interpretar:
- `errs`/`drop` crescendo durante pico aponta gargalo de interface/driver/queue
- diferença grande entre RX e TX pode indicar assimetria de tráfego
- `packets/s` alto com bitrate moderado pode sugerir pacote pequeno em excesso

## Dicas de troubleshooting

- Comparar counters do bmon com `ip -s link` para validar tendência
- Se houver drops, verificar ring buffer (`ethtool -g`) e backlog (`net.core.netdev_max_backlog`)
- Em VM, checar limites do hypervisor/virtio quando houver perda sob carga
- Monitorar CPU de softirq (`mpstat -P ALL`) para excluir gargalo de processamento

## Comparação com ferramentas similares

- **bmon vs nload**: bmon oferece mais métricas de interface, nload é mais minimalista
- **bmon vs iftop**: bmon foca interface; iftop foca conversa entre endpoints

## Flags importantes

- `-p <if>`: seleciona interface
- `-r <seg>`: taxa de atualização
- `-o <modo>`: tipo de saída (curses/ascii)
- `-b`: saída em bits por segundo

## Boas práticas

- Monitorar simultaneamente interface física e virtual (ex.: `eth0` e `cni0`)
- Salvar evidência de counters antes/depois do incidente
- Padronizar janela de observação (ex.: 5 min) para comparação entre eventos
- Cruzar com métricas de erro de switch/roteador quando possível

## Referências

- `man bmon`
- https://github.com/tgraf/bmon
