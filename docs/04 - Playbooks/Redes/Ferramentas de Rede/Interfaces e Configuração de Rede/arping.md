# arping

## O que é

Ferramenta que envia requisições ARP na LAN para validar presença de host e resolução IP->MAC sem depender de ICMP.

## Para que serve

- Confirmar se um IP responde em camada 2 (mesma sub-rede)
- Detectar IP duplicado antes de subir interface/serviço
- Verificar reachability local mesmo quando `ping` está bloqueado
- Obter MAC real do destino para troubleshooting rápido

## Quando usar

- Gateway responde ARP mas não responde ICMP (firewall bloqueando ping)
- Provisionamento de IP fixo com risco de conflito
- Problema restrito à LAN/VLAN (antes de investigar roteamento)

## Exemplos de uso

```bash
arping -I eth0 10.10.20.1
arping -c 3 -I eth0 10.10.20.30
arping -D -I eth0 10.10.20.50
arping -U -I eth0 10.10.20.50
```

## Exemplos de saída

```text
$ arping -c 3 -I eth0 10.10.20.1
ARPING 10.10.20.1 from 10.10.20.15 eth0
Unicast reply from 10.10.20.1 [52:54:00:AA:BB:CC]  1.022ms
Unicast reply from 10.10.20.1 [52:54:00:AA:BB:CC]  0.811ms
Unicast reply from 10.10.20.1 [52:54:00:AA:BB:CC]  0.924ms
Sent 3 probes (1 broadcast(s))
Received 3 response(s)
```

Leitura prática:
- Resposta com MAC confirma conectividade L2 até o destino.
- Sem respostas indica problema local de domínio de broadcast/VLAN/interface.
- Em `-D`, qualquer resposta significa IP já em uso.

## Dicas de troubleshooting

- Use `-I` sempre para evitar testar pela interface errada.
- Se ARP funciona e ICMP não, avance investigação para firewall/ACL.
- Em IP duplicado, compare MAC retornado com inventário/DHCP logs.
- Em VMs, confirme se hypervisor permite ARP/GARP (políticas anti-spoof).

## Flags importantes

- `-I <iface>`: define interface de saída (essencial).
- `-c <n>`: quantidade de probes.
- `-D`: Duplicate Address Detection (detectar IP já ocupado).
- `-U`: envia Gratuitous ARP update.
- `-f`: finaliza no primeiro reply.

## Boas práticas

- Antes de atribuir IP manual, rode `arping -D` para evitar colisão.
- Em troubleshooting, guarde MAC retornado para rastrear porta no switch.
- Não extrapole resultado de `arping` para fora da sub-rede: ARP é local.

## Referências

- `man arping`
- iputils arping: https://github.com/iputils/iputils
- ARP RFC 826: https://www.rfc-editor.org/rfc/rfc826
