# resolvectl

## O que é

`resolvectl` é a CLI do `systemd-resolved`. Ela mostra como o host está resolvendo nomes por interface, domínios de busca, DNS configurados, estado de DNSSEC e cache local.

## Para que serve

- Inspecionar configuração DNS efetiva em máquinas com systemd.
- Descobrir qual interface e servidor DNS estão sendo usados.
- Verificar split DNS (domínios roteados para DNS diferentes).
- Limpar cache e revalidar resolução após mudanças.

## Quando usar

- Em hosts Linux modernos (Ubuntu, Debian, Fedora, etc.) com `systemd-resolved` ativo.
- Quando `/etc/resolv.conf` parece correto, mas a resolução real não bate.
- Em VPN corporativa onde domínios internos só resolvem em DNS específico.
- Após mudança de rede/interface e comportamento DNS ficou inconsistente.

## Exemplos de uso

```bash
# Visão geral do resolvedor
resolvectl status

# Consulta explícita via resolved
resolvectl query api.interno.empresa.local

# Mostrar DNS configurado por interface
resolvectl dns

# Limpar cache local
resolvectl flush-caches
```

## Exemplos de saída

```text
$ resolvectl status
Global
       Protocols: +LLMNR +mDNS +DNSOverTLS DNSSEC=no/unsupported
resolv.conf mode: stub

Link 2 (eth0)
    Current Scopes: DNS
         Protocols: +DefaultRoute +LLMNR -mDNS +DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 10.10.0.53
       DNS Servers: 10.10.0.53 10.10.0.54
        DNS Domain: corp.local
```

Leitura rápida do que importa:
- `Current DNS Server`: servidor DNS efetivamente em uso.
- `DNS Servers`: lista de fallback.
- `DNS Domain`: domínio de busca/split DNS por link.
- `resolv.conf mode: stub`: host usa resolved como stub local.

## Dicas de troubleshooting

- Se domínio interno não resolve, confirme no `status` se ele está vinculado ao link certo (VPN/LAN).
- Quando DNS muda e host continua com resposta antiga, execute `resolvectl flush-caches`.
- Compare `resolvectl query nome` com `dig @dns nome` para separar problema de cache local e servidor remoto.
- Se `resolvectl` não existir, o host pode não usar systemd-resolved (usar `dig/host/nslookup` e revisar NetworkManager).

## Flags/comandos importantes

- `status`: estado completo global e por interface.
- `query NOME`: resolve nome usando caminho do resolved.
- `dns [IFACE]`: exibe DNS configurado globalmente/por interface.
- `domain [IFACE]`: mostra domínios de roteamento e busca.
- `flush-caches`: limpa cache DNS local.
- `statistics`: mostra métricas de cache/hits/misses.

## Boas práticas

- Em incidentes de endpoint Linux, sempre coletar `resolvectl status` junto com `/etc/resolv.conf`.
- Validar DNS por interface após conectar/desconectar VPN.
- Evitar “corrigir” DNS só editando `/etc/resolv.conf` em hosts gerenciados por systemd/NetworkManager.
- Registrar antes/depois de `flush-caches` para comprovar efeito da ação.

## Referências

- `man resolvectl`
- `man systemd-resolved`
- Documentação do systemd: resolved e nss-resolve
