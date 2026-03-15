# tracepath

## O que é

Ferramenta de rastreamento de rota semelhante ao traceroute, focada em simplicidade e detecção de **Path MTU (pMTU)**, geralmente sem exigir privilégios elevados.

## Para que serve

- Identificar gargalos de MTU no caminho (blackhole de fragmentação).
- Mapear hops de forma rápida quando `traceroute` não está disponível.
- Validar se encapsulamentos (VPN, VXLAN, GRE) estão reduzindo MTU efetiva.
- Apoiar troubleshooting de conexões que "abrem", mas travam em payload maior.

## Quando usar

- Handshake TCP funciona, mas transferências maiores falham ou ficam lentas.
- Suspeita de problema após habilitar túnel/VPN/overlay.
- Ambiente sem privilégio root para usar traceroute completo.
- Necessidade de checar pMTU fim-a-fim rapidamente.

## Exemplos de uso

```bash
# Rota e pMTU para destino público
tracepath 8.8.8.8

# Sem resolução DNS dos hops
tracepath -n api.exemplo.com

# Limitar número de hops
tracepath -m 12 10.50.0.25
```

## Exemplo de saída

```text
$ tracepath 8.8.8.8
 1?: [LOCALHOST]                      pmtu 1500
 1:  192.168.0.1                       1.102ms
 2:  10.10.0.1                         4.771ms
 3:  no reply
 4:  200.160.2.1                      15.004ms
 5:  8.8.8.8                          18.220ms reached
     Resume: pmtu 1480 hops 5 back 6
```

Leitura prática da saída:

- `pmtu 1500` no início: MTU local de saída.
- `Resume: pmtu 1480`: caminho impõe MTU menor (comum em túneis).
- `no reply`: hop silencioso; se destino for alcançado, caminho segue funcional.
- Queda de pMTU + falha em aplicações com payload grande: forte indício de MTU mal ajustada.

## Dicas de troubleshooting

- Se pMTU cair (ex.: 1500 -> 1480), ajuste MTU/MSS em interfaces/túneis/firewall.
- Combine com `ping -M do -s <tam>` para validar tamanho máximo sem fragmentação.
- Em VPN IPsec/WireGuard, reserve overhead do túnel ao definir MTU da interface.
- Se o destino não é alcançado, compare com `traceroute -T -p 443` para separar bloqueio de método/protocolo.

## Flags importantes

- `-n`: sem resolução de nomes.
- `-m <hops>`: número máximo de saltos.
- `-l <bytes>`: tamanho inicial do pacote.
- `-p <porta>`: porta UDP inicial (varia por implementação).

## Boas práticas

- Usar `tracepath` como primeira verificação de MTU em incidentes de VPN/overlay.
- Documentar pMTU encontrado junto da topologia (link físico, túnel, cloud).
- Padronizar MTU por segmento de rede para evitar comportamento imprevisível.
- Após ajuste, repetir teste e anexar "antes/depois" no ticket.

## Referências

- `man tracepath`
- iputils (tracepath): https://github.com/iputils/iputils
