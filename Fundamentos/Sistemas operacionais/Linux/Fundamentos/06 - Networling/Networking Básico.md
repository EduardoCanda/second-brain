## Conceito Central

No Linux, **rede é responsabilidade do kernel**, controlada por ferramentas de espaço de usuário.

Tudo gira em torno de:
- Interfaces
- Endereços IP
- Rotas
- Portas
- DNS

---

## Interfaces de Rede

Interfaces são os pontos de conexão com a rede.

Exemplos:
- `eth0` → ethernet
- `wlan0` → wifi
- `lo` → loopback
- `docker0` → bridge do Docker

Comando principal:
- `ip link`

---

## Endereçamento IP

IP identifica um host na rede.

Tipos:
- IPv4
- IPv6

Comando:
- `ip addr`

CIDR:
- `192.168.1.10/24`

---

## Loopback

- Interface `lo`
- IP: `127.0.0.1`
- Comunicação local
- Não sai para a rede

---

## Rotas

Rota define **para onde o tráfego vai**.

- Gateway padrão → saída da rede
- Sem rota, não há comunicação externa

Comando:
- `ip route`

---

## DNS

DNS resolve nomes para IPs.

Arquivos e serviços:
- `/etc/resolv.conf`
- `systemd-resolved`
- `NetworkManager`

Teste:
- `dig`
- `nslookup`

---

## Portas

Portas identificam serviços.

- TCP / UDP
- 0–65535
- <1024 → privilegiadas

Exemplos:
- 22 → SSH
- 80 → HTTP
- 443 → HTTPS

---

## Sockets

Socket = IP + Porta + Protocolo

Comando:
- `ss -tulnp`

Substitui:
- `netstat`

---

## Ferramentas Essenciais

- `ip`
- `ss`
- `ping`
- `traceroute`
- `curl`
- `nc`

---

## Firewall (visão geral)

- `iptables` / `nftables`
- `ufw` (frontend comum)
- Atua sobre pacotes

---

## Troubleshooting Básico

1. Interface está up?
2. IP válido?
3. Rota padrão existe?
4. DNS resolve?
5. Porta está aberta?

---

## Erros Comuns

- Confundir IP local com público
- Ignorar rota padrão
- Debugar aplicação sem checar porta
- Usar `ifconfig` (obsoleto)

---

## Regra Prática

Se não conecta:
- Comece pela interface
- Depois IP
- Depois rota
- Depois DNS
- Por fim aplicação
