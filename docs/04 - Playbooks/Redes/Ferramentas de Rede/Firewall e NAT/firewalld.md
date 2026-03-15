# firewalld

## O que é

`firewalld` é um gerenciador dinâmico de firewall (backend nftables/iptables) orientado a zonas, muito usado em RHEL, Rocky, Alma e Fedora.

## Para que serve

- Aplicar políticas diferentes por contexto de rede (`public`, `internal`, `dmz`, etc.)
- Alterar regras em runtime sem reiniciar serviço de rede
- Gerenciar serviços, portas, rich rules, forward e NAT de forma declarativa
- Integrar com NetworkManager para associar interfaces a zonas

## Quando usar

- Servidores com múltiplas interfaces/rede (ex.: WAN + LAN + VPN)
- Ambientes enterprise com necessidade de configuração persistente e auditável
- Operação diária onde time prefere abstração de “serviços” ao invés de regras low-level

## Exemplos de uso

```bash
# Ver zonas ativas e interfaces
firewall-cmd --get-active-zones

# Inspecionar zona public
firewall-cmd --zone=public --list-all

# Liberar HTTPS em runtime e persistir
firewall-cmd --zone=public --add-service=https
firewall-cmd --zone=public --add-service=https --permanent

# Abrir porta customizada
firewall-cmd --zone=public --add-port=8443/tcp --permanent

# Recarregar regras persistentes
firewall-cmd --reload
```

## Exemplos de saída

```text
$ firewall-cmd --zone=public --list-all
public (active)
  target: default
  interfaces: eth0
  services: cockpit dhcpv6-client ssh https
  ports: 8443/tcp
  protocols:
  forward: no
  masquerade: no
  rich rules:
```

Leitura prática:
- `(active)` confirma zona em uso por interface.
- `services` e `ports` mostram o que está efetivamente permitido.
- `masquerade: no` indica que não há NAT de saída nessa zona.

## Dicas de troubleshooting

- Diferencie runtime vs permanente (`--runtime-to-permanent`) para não perder regra após reboot.
- Se porta foi liberada e ainda falha, valide binding da aplicação (`0.0.0.0` vs `127.0.0.1`).
- Confirme zona correta da interface (`firewall-cmd --get-active-zones`).
- Em troubleshooting profundo, compare com `nft list ruleset` para validar backend.

## Flags importantes

- `--zone=<zona>`: define contexto da regra
- `--list-all` / `--list-all-zones`: inventário de política
- `--add-service` / `--add-port`: libera serviço/porta
- `--permanent`: persiste alteração em disco
- `--reload`: reaplica configuração persistente
- `--runtime-to-permanent`: salva estado runtime atual

## Boas práticas

- Defina zona padrão conscientemente (`public` não deve ser “depósito” de exceções).
- Prefira `services` (com descrição semântica) antes de abrir portas soltas.
- Evite alterações manuais diretas em backend nft/iptables quando firewalld é o orquestrador.
- Versione arquivos de zona e use automação (Ansible, por exemplo) para consistência.

## Referências

- `man firewall-cmd`
- firewalld docs: https://firewalld.org/documentation/
- RHEL Security Guide (firewalld)
