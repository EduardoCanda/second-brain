# arp

## O que é

Comando legado do net-tools para ler/manipular cache ARP (mapeamento IPv4 -> MAC) no host local.

## Para que serve

- Verificar se o host resolveu MAC do gateway/destino local
- Identificar entradas ARP incompletas ou stale
- Limpar cache ARP para forçar nova resolução
- Criar entrada estática em cenários específicos de laboratório

## Quando usar

- `ping` ao gateway falha mas link físico está up
- Suspeita de conflito ARP, MAC flapping ou equipamento trocado
- Troubleshooting de problema local em mesma sub-rede/VLAN

## Exemplos de uso

```bash
arp -an
arp -an | grep 10.10.20.1
arp -d 10.10.20.1
arp -s 10.10.20.50 00:11:22:33:44:55
```

## Exemplos de saída

```text
$ arp -an
? (10.10.20.1) at 52:54:00:aa:bb:cc [ether] on eth0
? (10.10.20.200) at <incomplete> on eth0
```

Leitura prática:
- `<incomplete>` indica que ARP request saiu, mas ninguém respondeu.
- MAC mudando constantemente para o mesmo IP pode indicar conflito ou ataque ARP spoofing.

## Dicas de troubleshooting

- Sempre compare com `ip neigh` (ferramenta moderna equivalente).
- Se entrada está `<incomplete>`, valide VLAN, porta de switch e ACL L2.
- Limpe cache (`arp -d`) e teste de novo para diferenciar dado stale de falha real.
- Em ambiente cloud, confira política de anti-spoofing da interface virtual.

## Flags importantes

- `-a` / `-n`: lista cache ARP (normalmente sem resolver nomes).
- `-d <ip>`: remove entrada ARP.
- `-s <ip> <mac>`: cria entrada ARP estática.
- `-i <iface>`: restringe operação à interface.

## Boas práticas

- Não mantenha ARP estático em produção sem necessidade clara.
- Prefira `ip neigh` para novos procedimentos operacionais.
- Registre MAC/IP observados em incidentes para cruzar com logs de switch.

## Referências

- `man arp`
- `man ip-neighbour`
- ARP RFC 826: https://www.rfc-editor.org/rfc/rfc826
