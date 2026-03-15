# iptables

## O que é

`iptables` é a interface clássica do kernel netfilter para filtrar tráfego e aplicar NAT (SNAT, DNAT e MASQUERADE) em Linux.

> Em distros modernas, o backend pode ser `iptables-nft` (compatibilidade sobre nftables) ou `iptables-legacy`.

## Para que serve

- Controlar tráfego de entrada (`INPUT`), saída (`OUTPUT`) e encaminhamento (`FORWARD`)
- Publicar serviços internos com DNAT/port forwarding
- Fazer saída de sub-redes privadas para internet com SNAT/MASQUERADE
- Implementar política padrão de bloqueio com exceções explícitas

## Quando usar

- Hosts legados que já têm automações em `iptables-save`/`iptables-restore`
- Troubleshooting de Kubernetes/CNI antigo, Docker ou appliances que ainda escrevem regras em `iptables`
- Cenários onde você precisa inspecionar rapidamente contadores por regra (`-v`) para saber se o pacote “bateu”

## Exemplos de uso

```bash
# Ver regras com contadores e sem DNS reverso
iptables -L -n -v --line-numbers

# Ver regras de NAT
iptables -t nat -L -n -v --line-numbers

# Liberar HTTPS de entrada
iptables -A INPUT -p tcp --dport 443 -m conntrack --ctstate NEW -j ACCEPT

# DNAT: publicar 203.0.113.10:443 para 10.0.10.20:8443
iptables -t nat -A PREROUTING -d 203.0.113.10 -p tcp --dport 443 -j DNAT --to-destination 10.0.10.20:8443

# MASQUERADE para saída da rede 10.0.10.0/24
iptables -t nat -A POSTROUTING -s 10.0.10.0/24 -o eth0 -j MASQUERADE
```

## Exemplos de saída

```text
$ iptables -L INPUT -n -v --line-numbers
Chain INPUT (policy DROP 120 packets, 8400 bytes)
num   pkts bytes target  prot opt in  out source      destination
1      12   720 ACCEPT  tcp  --  *   *   0.0.0.0/0   0.0.0.0/0    tcp dpt:22 ctstate NEW
2    3200  210K ACCEPT  all  --  lo  *   0.0.0.0/0   0.0.0.0/0
3       0     0 ACCEPT  tcp  --  *   *   0.0.0.0/0   0.0.0.0/0    tcp dpt:443 ctstate NEW
```

Leitura prática:
- `policy DROP` indica bloqueio por padrão: só passa o que casar em regra `ACCEPT`.
- Regra com `pkts/bytes = 0` sugere que o tráfego esperado não está chegando nessa chain/interface.
- `--line-numbers` ajuda a remover/inserir regra na posição correta sem erro operacional.

## Dicas de troubleshooting

- Verifique roteamento primeiro (`ip route`) antes de culpar firewall.
- Compare contadores antes/depois do teste: `iptables -L -n -v`.
- Se DNAT funciona mas resposta não volta, cheque `FORWARD`, `rp_filter` e regra de `POSTROUTING`.
- Confirme política de `FORWARD` (muito ambiente falha por `DROP` padrão).
- Em ambiente com firewalld/ufw, valide quem está gerenciando as regras para evitar “briga” de ferramentas.

## Flags importantes

- `-L`: lista regras por chain
- `-t nat|mangle|raw`: escolhe tabela
- `-n`: não resolve DNS (mais rápido e menos ruído)
- `-v`: mostra contadores de pacotes/bytes
- `--line-numbers`: numera regras para alteração segura
- `-S`: exibe regras em formato próximo de restore/script

## Boas práticas

- Defina política padrão explícita (`DROP`/`ACCEPT`) e documente exceções.
- Permita `ESTABLISHED,RELATED` para reduzir regras redundantes.
- Versione snapshot com `iptables-save` antes de mudanças.
- Aplique mudanças via script idempotente (evita drift manual).
- Em produção, prefira janela controlada e teste de rollback imediato.

## Referências

- `man iptables`
- `man iptables-extensions`
- Netfilter project: https://www.netfilter.org/
