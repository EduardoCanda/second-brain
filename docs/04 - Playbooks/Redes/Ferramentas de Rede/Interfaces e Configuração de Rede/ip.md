# ip

## O que é

Ferramenta padrão do pacote **iproute2** para administrar pilha de rede no Linux (interfaces, endereços, rotas, vizinhos ARP/NDP, regras de policy routing e namespaces).

## Para que serve

- Inspecionar estado real das interfaces (`state`, MTU, qdisc, filas, erros)
- Validar endereçamento IPv4/IPv6 e gateway default
- Investigar caminho de saída com `ip route get`
- Conferir cache de vizinhos (`ip neigh`) para problemas de ARP/NDP
- Operar em troubleshooting avançado com `ip netns` e `ip rule`

## Quando usar

- Host “tem IP” mas não sai para a rede (suspeita de rota/gateway)
- Latência alta após mudança de MTU (ex.: VPN, túnel, cloud)
- Conectividade intermitente em Kubernetes/containers (veth, CNI, netns)
- Erro “No route to host” ou tráfego saindo pela interface errada

## Exemplos de uso

```bash
ip -br a
ip route show table main
ip route get 8.8.8.8
ip neigh show dev eth0
ip -s link show dev eth0
```

## Exemplos de saída

```text
$ ip -br a
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0             UP             10.10.20.15/24 fe80::5054:ff:fe12:3456/64

$ ip route get 8.8.8.8
8.8.8.8 via 10.10.20.1 dev eth0 src 10.10.20.15 uid 1000
    cache

$ ip neigh show dev eth0
10.10.20.1 lladdr 52:54:00:aa:bb:cc REACHABLE
10.10.20.200 FAILED
```

Leitura prática:
- `src` mostra o IP de origem que o kernel escolheu.
- `via` e `dev` confirmam gateway/interface de saída.
- Vizinho em `FAILED` geralmente indica problema L2 (VLAN, cabo, switch, ARP bloqueado).

## Dicas de troubleshooting

- Compare `ip route get <destino>` com o que você esperava da topologia.
- Use `ip -s link` para checar `dropped`, `errors`, `overruns` antes de culpar aplicação.
- Se houver VPN/túnel, confirme MTU e teste com `ping -M do -s 1472 <destino>`.
- Em container, rode no namespace correto: `ip netns exec <ns> ip a`.
- Para incidentes rápidos, salve snapshot: `ip a; ip r; ip neigh` no ticket.

## Flags importantes

- `-br` (brief): saída curta e ótima para triagem rápida.
- `-c` (color): facilita leitura em terminal.
- `-s` (statistics): inclui contadores de erro/perda.
- `-4` / `-6`: filtra por família IP.
- `-j` (json): ideal para automação e parsing em scripts.

## Boas práticas

- Prefira `ip` em vez de `ifconfig/route/arp` (ferramentas legadas).
- Em produção, priorize comandos de leitura; mude estado apenas com janela/rollback.
- Sempre correlacione saída de `ip` com regras de firewall (`nft`/`iptables`) e DNS.
- Padronize coleta de evidências em incidentes (mesmos comandos, mesma ordem).

## Referências

- `man ip`
- `man ip-address`, `man ip-route`, `man ip-neighbour`
- Documentação do iproute2: https://wiki.linuxfoundation.org/networking/iproute2
