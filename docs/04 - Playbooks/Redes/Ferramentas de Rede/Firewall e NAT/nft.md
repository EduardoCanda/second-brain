# nft

## O que é

`nft` é a CLI do nftables, framework moderno do netfilter para filtro de pacotes, NAT e classificação de tráfego com sintaxe unificada.

## Para que serve

- Substituir `iptables/ip6tables/ebtables/arptables` em um único modelo
- Criar regras com melhor legibilidade e atomicidade de carga
- Aplicar NAT IPv4/IPv6 e políticas por interface, rede, porta, conjunto (set) e mapa (map)
- Fazer tracing de decisão de regra em troubleshooting avançado

## Quando usar

- Novas implantações Linux (preferência atual sobre iptables)
- Ambientes com muitas regras, necessidade de performance e manutenção previsível
- Casos em que você precisa atualizar regras sem estado intermediário inconsistente

## Exemplos de uso

```bash
# Listar o ruleset completo
nft list ruleset

# Ver apenas uma tabela
nft list table inet filter

# Regra simples: permitir SSH de rede administrativa
nft add rule inet filter input ip saddr 10.10.0.0/16 tcp dport 22 ct state new accept

# NAT de saída
nft add table ip nat
nft 'add chain ip nat postrouting { type nat hook postrouting priority 100; }'
nft add rule ip nat postrouting ip saddr 10.0.10.0/24 oifname "eth0" masquerade

# Tracing em tempo real
nft monitor trace
```

## Exemplos de saída

```text
$ nft list chain inet filter input
table inet filter {
  chain input {
    type filter hook input priority filter; policy drop;
    ct state established,related accept
    iif "lo" accept
    tcp dport { 22, 443 } ct state new accept
  }
}
```

Leitura prática:
- `policy drop` + regras explícitas = postura default deny.
- `ct state established,related accept` evita quebrar conexões já abertas.
- Set `{ 22, 443 }` reduz repetição e melhora manutenção.

## Dicas de troubleshooting

- Use `nft monitor trace` para seguir o pacote chain por chain.
- Em migração de iptables, valide backend com `iptables -V` (`nf_tables` vs `legacy`).
- Se regra parece correta e ainda falha, confirme hook/família (`ip`, `ip6`, `inet`) e prioridade.
- Verifique se há flush/carga automática por systemd, cloud-init ou ferramenta de configuração.

## Flags importantes

- `list ruleset`: auditoria completa
- `-a`: mostra handles (IDs) para remover regra de forma exata
- `-n`: saída numérica (sem resolução)
- `-s`: inclui contadores/estado na listagem
- `monitor trace`: rastreia caminho de avaliação

## Boas práticas

- Estruture regras por tabela/família e nomes consistentes de chains.
- Prefira `sets` e `maps` para listas grandes de IPs/portas.
- Faça deploy com arquivo (`nft -f ruleset.nft`) para garantir atomicidade.
- Armazene ruleset versionado e valide sintaxe em CI antes de aplicar.
- Mantenha uma regra de acesso administrativo segura para evitar lockout remoto.

## Referências

- `man nft`
- Wiki nftables: https://wiki.nftables.org/
- Netfilter project: https://www.netfilter.org/
