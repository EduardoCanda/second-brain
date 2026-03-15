# ufw

## O que é

`ufw` (Uncomplicated Firewall) é um frontend simplificado para netfilter, comum em Ubuntu/Debian, focado em operação rápida de regras de host.

## Para que serve

- Proteger servidores com política simples de entrada/saída
- Abrir portas de serviços de forma padronizada (ex.: SSH, HTTP, HTTPS)
- Aplicar limites básicos contra brute force
- Gerenciar regras IPv4/IPv6 sem escrever sintaxe completa de iptables

## Quando usar

- Servidor único, VM ou bastion com necessidades de firewall de host (não de roteador complexo)
- Times que precisam de baixa curva de aprendizado operacional
- Ambientes em que firewalld não é padrão e `ufw` já vem integrado no SO

## Exemplos de uso

```bash
# Estado atual
ufw status verbose

# Política padrão segura
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH e HTTPS
ufw allow 22/tcp
ufw allow 443/tcp

# Limitar tentativas de SSH
ufw limit 22/tcp

# Ativar firewall
ufw enable
```

## Exemplos de saída

```text
$ ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     LIMIT IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
22/tcp (v6)                LIMIT IN    Anywhere (v6)
443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

Leitura prática:
- `Status: active` confirma que regras estão aplicadas.
- `routed disabled` indica que UFW não está roteando tráfego entre interfaces (importante para NAT/forward).
- Regras `v6` precisam existir quando IPv6 está habilitado no host.

## Dicas de troubleshooting

- Em acesso remoto, sempre permita SSH antes de `ufw enable` para evitar lockout.
- Se serviço continua inacessível, valide aplicação escutando (`ss -lntup`) e rota.
- Confira `ufw status numbered` para remover regra correta por índice.
- Para tráfego roteado/NAT, revise `/etc/default/ufw` e regras em `/etc/ufw/before.rules`.

## Flags importantes

- `status verbose`: estado completo e políticas padrão
- `status numbered`: lista indexada para delete seguro
- `allow|deny|reject|limit`: ações principais
- `--dry-run`: simula mudança sem aplicar
- `logging on|off|low|medium|high`: controle de auditoria

## Boas práticas

- Padronize baseline: `deny incoming`, `allow outgoing`.
- Use comentários em regras (`ufw allow 443/tcp comment 'nginx-prod'`).
- Revise regras órfãs periodicamente em servidores antigos.
- Mantenha logging em nível adequado para incidentes sem gerar ruído excessivo.

## Referências

- `man ufw`
- Ubuntu UFW docs: https://help.ubuntu.com/community/UFW
