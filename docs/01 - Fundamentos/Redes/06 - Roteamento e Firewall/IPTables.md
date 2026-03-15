# IPTables (Fundamentos)

O **iptables** é o mecanismo clássico de firewall no Linux (baseado em Netfilter).
Ele permite criar regras para:

- aceitar (`ACCEPT`) tráfego;
- bloquear (`DROP`/`REJECT`) tráfego;
- registrar (`LOG`) tráfego;
- fazer NAT (`SNAT`, `DNAT`, `MASQUERADE`).

---

## 1) Estrutura mental: tables, chains e regras

No iptables, você trabalha com:

- **Tables** (contextos): `filter`, `nat`, `mangle`, `raw`, `security`
- **Chains** (pontos do fluxo): `INPUT`, `OUTPUT`, `FORWARD`, `PREROUTING`, `POSTROUTING`
- **Rules** (condições + ação): se casar, executa um alvo/target

```text
Table -> Chain -> Rule -> Target
```

---

## 2) Fluxo de pacote (ASCII simplificado)

```text
Pacote chegando pela interface
           |
           v
      [PREROUTING]  (nat/mangle)
           |
           v
   +---------------------+
   | Destino é local?    |
   +---------------------+
      | sim                    | não
      v                        v
   [INPUT] (filter)         [FORWARD] (filter)
      |                        |
      v                        v
   Processo local           [POSTROUTING] (nat)
                               |
                               v
                          Sai pela interface
```

Para tráfego gerado no próprio host:

```text
Processo local -> [OUTPUT] -> [POSTROUTING] -> Interface
```

---

## 3) Chains principais

- **INPUT**: tráfego que chega ao próprio host
- **OUTPUT**: tráfego que sai do próprio host
- **FORWARD**: tráfego roteado pelo host (host atuando como roteador)

Exemplo mental:

```text
Servidor web Linux:
- Requisição para porta 80 no servidor -> INPUT
- Resposta do servidor para cliente -> OUTPUT

Roteador Linux entre duas redes:
- Pacote passando de uma rede para outra -> FORWARD
```

---

## 4) Policy padrão e ordem das regras

As regras são lidas de cima para baixo dentro da chain.
Primeiro match normalmente decide o destino.

```text
[Rule 1] casa? sim -> ação e para
[Rule 2] nem é avaliada
```

Policy padrão (quando nenhuma regra casa):

- `ACCEPT` (permissivo)
- `DROP` (restritivo)

Boa prática em ambiente exposto: **default DROP + liberar apenas o necessário**.

---

## 5) Exemplo de regras essenciais

> Exemplo didático (ajuste para seu ambiente).

```bash
# Política padrão
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Permitir loopback
iptables -A INPUT -i lo -j ACCEPT

# Permitir conexões já estabelecidas
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Permitir SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Permitir HTTP e HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

---

## 6) NAT com IPTables (muito comum em roteadores)

Caso clássico: rede privada saindo para internet por um único IP público.

```text
LAN privada (192.168.0.0/24) ---> Roteador Linux ---> Internet
```

Regra típica com `MASQUERADE`:

```bash
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

ASCII da ideia:

```text
Antes do NAT: src=192.168.0.10 dst=8.8.8.8
Depois NAT : src=200.10.10.5  dst=8.8.8.8
```

---

## 7) Diferença rápida: DROP vs REJECT

- **DROP**: descarta silenciosamente.
- **REJECT**: descarta e responde erro (ex: `icmp-port-unreachable`).

```text
Cliente -> pacote -> firewall
DROP   => cliente fica aguardando timeout
REJECT => cliente recebe negação imediata
```

---

## 8) Comandos de inspeção e troubleshooting

```bash
iptables -L -n -v
iptables -t nat -L -n -v
iptables-save
```

Quando algo não funciona:

1. Verifique contadores de pacotes (`-v`) para saber se a regra está sendo atingida.
2. Confirme se a chain correta foi usada (`INPUT`, `FORWARD` ou `OUTPUT`).
3. Revise ordem das regras.
4. Verifique roteamento (`ip route`) e forwarding (`sysctl net.ipv4.ip_forward`).

---

## 9) IPTables + Routing Tables juntos

Resumo de ouro:

```text
Routing Table = escolhe caminho
IPTables      = filtra/transforma o tráfego no caminho
```

Se um pacote "some", normalmente o problema está em um desses dois lugares.

#redes #linux #iptables #firewall #fundamentos
