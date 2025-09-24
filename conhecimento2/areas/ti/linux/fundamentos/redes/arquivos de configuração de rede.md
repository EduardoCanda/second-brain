---
tags:
  - Linux
  - Fundamentos
  - Redes
  - NotaBibliografica
---
Aqui estão exemplos de **arquivos de configuração de rede no Linux**, com explicações sobre cada um e como editá-los. Esses arquivos são essenciais para gerenciar interfaces, DNS, hosts estáticos e regras de firewall.

---

## **1. Configuração de Interfaces de Rede**
### **Arquivo: `/etc/network/interfaces`** (Debian/Ubuntu)  
Configura interfaces físicas e lógicas (IPv4/IPv6).  
```plaintext
# Interface loopback
auto lo
iface lo inet loopback

# Interface Ethernet estática
auto eth0
iface eth0 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4

# Interface com DHCP
auto eth1
iface eth1 inet dhcp

# VLAN (subinterface)
auto eth0.10
iface eth0.10 inet static
    address 10.0.10.2
    netmask 255.255.255.0
```

**Como aplicar**:  
```bash
sudo systemctl restart networking  # Debian/Ubuntu
```

---

### **Arquivo: `/etc/sysconfig/network-scripts/ifcfg-eth0`** (RHEL/CentOS/Fedora)  
Configura interfaces em distribuições baseadas em Red Hat.  
```plaintext
DEVICE=eth0
BOOTPROTO=static
IPADDR=192.168.1.100
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
DNS2=8.8.4.4
ONBOOT=yes
```

**Como aplicar**:  
```bash
sudo nmcli connection reload  # RHEL/CentOS
sudo ifup eth0
```

---

## **2. Configuração de DNS**
### **Arquivo: `/etc/resolv.conf`**  
Define servidores DNS (gerado automaticamente em sistemas com `systemd-resolved` ou `NetworkManager`).  
```plaintext
nameserver 8.8.8.8
nameserver 1.1.1.1
search exemplo.com
```

**Observação**: Em sistemas modernos, edite:  
- **Debian/Ubuntu**: `/etc/systemd/resolved.conf`  
- **RHEL/CentOS**: `/etc/NetworkManager/NetworkManager.conf`  

---

## **3. Mapeamento Estático de Hosts**
### **Arquivo: `/etc/hosts`**  
Mapeia nomes para IPs localmente (útil para testes ou bloquear sites).  
```plaintext
127.0.0.1   localhost
192.168.1.5 servidor.local
# Bloqueio de site (exemplo)
0.0.0.0     site-malicioso.com
```

---

## **4. Configuração de Firewall (iptables/nftables)**
### **Arquivo: `/etc/iptables/rules.v4`** (Regras IPv4 persistentes)  
```plaintext
*filter
# Política padrão: DROP
-P INPUT DROP
-P FORWARD DROP
-P OUTPUT ACCEPT

# Permitir tráfego local
-A INPUT -i lo -j ACCEPT

# Permitir SSH (porta 22)
-A INPUT -p tcp --dport 22 -j ACCEPT

# Permitir ping
-A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# Salvar regras
COMMIT
```

**Como carregar**:  
```bash
sudo iptables-restore < /etc/iptables/rules.v4
```

---

### **Arquivo: `/etc/nftables.conf`** (Substituto moderno do iptables)  
```plaintext
table inet filter {
    chain input {
        type filter hook input priority 0;
        # Permitir SSH
        tcp dport 22 accept
        # Permitir ping
        icmp type echo-request accept
    }
}
```

**Como aplicar**:  
```bash
sudo systemctl restart nftables
```

---

## **5. Configuração de Roteamento**
### **Arquivo: `/etc/iproute2/rt_tables`** (Tabelas de roteamento personalizadas)  
```plaintext
100    tabela_vpn
200    tabela_wifi
```

**Adicionar rota manualmente**:  
```bash
ip route add 10.8.0.0/24 dev tun0 table tabela_vpn
```

---

## **6. Configuração de Serviços de Rede**
### **Arquivo: `/etc/dhcp/dhclient.conf`** (Configuração DHCP cliente)  
```plaintext
# Solicitar um nome de host específico
send host-name "meu-pc-linux";

# Sobrescrever servidores DNS
supersede domain-name-servers 8.8.8.8;
```

---

## **7. Configuração de VPN (OpenVPN)**
### **Arquivo: `/etc/openvpn/client.conf`**  
```plaintext
client
dev tun
proto udp
remote vpn.exemplo.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
ca /etc/openvpn/ca.crt
cert /etc/openvpn/client.crt
key /etc/openvpn/client.key
```

**Iniciar a VPN**:  
```bash
sudo systemctl start openvpn@client
```

---

## **8. Dica: Ferramentas para Gerenciamento**
- **`nmcli`**: Interface de linha de comando do NetworkManager (moderno).  
  ```bash
  nmcli connection show
  nmcli connection modify "eth0" ipv4.addresses "192.168.1.100/24"
  ```
- **`ip`**: Substitui `ifconfig` (mais poderoso).  
  ```bash
  ip addr show  # Listar interfaces
  ip route add default via 192.168.1.1
  ```

---

## **9. Conclusão**  
Esses arquivos são a base da configuração de rede no Linux. Dependendo da distribuição, alguns caminhos podem variar (ex: **Netplan** no Ubuntu usa arquivos YAML em `/etc/netplan/`). Sempre faça backup antes de editar!  

Precisa de um exemplo específico (ex: **bonding, bridge ou IPv6**)? Posso detalhar!