---
tags:
  - Linux
  - NotaBibliografica
ferramenta: cli
---
O **Netplan** é uma ferramenta de configuração de rede **baseada em YAML** utilizada em distribuições Linux modernas, como **Ubuntu (a partir da versão 17.10)**, Debian e outras baseadas em systemd. Ele foi criado para simplificar e padronizar a configuração de interfaces de rede, substituindo métodos legados como arquivos no `/etc/network/interfaces` (Debian) ou scripts no `/etc/sysconfig/network-scripts/` (RHEL).

---

## **1. Para que serve o Netplan?**
- **Configurar interfaces de rede** (Ethernet, Wi-Fi, VLANs, bridges, bonds, etc.).
- **Suportar backends** como `systemd-networkd` e `NetworkManager`.
- **Gerar automaticamente** configurações para os serviços de rede subjacentes.
- **Oferecer sintaxe limpa** usando arquivos YAML.

---

## **2. Onde o Netplan é usado?**
- **Distribuições**: Ubuntu Server/Desktop, Debian, Pop!_OS e outras baseadas em systemd.
- **Backends principais**:
  - `systemd-networkd` (padrão para servidores).
  - `NetworkManager` (comum em desktops).

---

## **3. Estrutura Básica de um Arquivo Netplan**
Os arquivos de configuração ficam em `/etc/netplan/` com extensão `.yaml` (ex: `/etc/netplan/01-netcfg.yaml`).  
Um exemplo simples para uma interface Ethernet com IP estático:

```yaml
network:
  version: 2
  renderer: networkd  # Ou "NetworkManager"
  ethernets:
    enp0s3:
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

---

## **4. Configurações Comuns no Netplan**
### **A. DHCP (IP Dinâmico)**
```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: true
      dhcp6: false
```

### **B. Wi-Fi (Com Autenticação WPA2)**
```yaml
network:
  version: 2
  wifis:
    wlp2s0:
      access-points:
        "MinhaRedeWiFi":
          password: "senha123"
      dhcp4: true
```

### **C. VLANs**
```yaml
network:
  version: 2
  vlans:
    vlan10:
      id: 10
      link: enp0s3
      addresses: [10.0.10.2/24]
```

### **D. Bridge (Para Máquinas Virtuais)**
```yaml
network:
  version: 2
  bridges:
    br0:
      interfaces: [enp0s3]
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
```

### **E. Bonding (Agregação de Links)**
```yaml
network:
  version: 2
  bonds:
    bond0:
      interfaces: [enp0s3, enp0s4]
      parameters:
        mode: active-backup
      addresses: [192.168.1.100/24]
```

---

## **5. Comandos Essenciais do Netplan**
| Comando                          | Descrição                                                                 |
|----------------------------------|--------------------------------------------------------------------------|
| `sudo netplan apply`             | Aplica as configurações sem reiniciar o sistema.                         |
| `sudo netplan try`               | Aplica temporariamente e reverte se não for confirmado em 120 segundos.  |
| `sudo netplan generate`          | Gera configurações para o backend (networkd/NetworkManager) sem aplicar. |
| `sudo netplan --debug apply`     | Aplica com logs detalhados para troubleshooting.                         |

---

## **6. Vantagens do Netplan**
✅ **Sintaxe limpa**: Facilidade de leitura e escrita com YAML.  
✅ **Backend flexível**: Funciona com `systemd-networkd` e `NetworkManager`.  
✅ **Suporte a recursos avançados**: VLANs, bridges, bonding, Wi-Fi, etc.  
✅ **Integração com cloud-init**: Usado em instâncias de nuvem.  

---

## **7. Limitações**
❌ **Não suporta todas as opções avançadas** de backends legados.  
❌ **Menos documentação** comparado a ferramentas tradicionais.  

---

## **8. Troubleshooting**
### **Problema: Configuração Não Aplicada**
- Verifique erros de sintaxe YAML:
  ```bash
  sudo netplan --debug generate
  ```
- Confira logs do `systemd-networkd`:
  ```bash
  journalctl -u systemd-networkd
  ```

### **Problema: Interface Não Reconhecida**
- Liste interfaces disponíveis:
  ```bash
  ip link show
  ```
- Use o nome correto no arquivo YAML (ex: `enp0s3`, `eth0`).

---

## **9. Comparação com Métodos Legados**
| **Ferramenta**               | **Arquivo de Configuração**       | **Backend**                     |
|------------------------------|----------------------------------|--------------------------------|
| **Netplan**                  | `/etc/netplan/*.yaml`           | `systemd-networkd` ou `NetworkManager` |
| **ifupdown** (Debian)        | `/etc/network/interfaces`        | `ifupdown`                     |
| **Network-Scripts** (RHEL)   | `/etc/sysconfig/network-scripts/ifcfg-eth0` | `network.service` |

---

## **10. Conclusão**
O Netplan é a **forma moderna e padronizada** de configurar redes em distribuições Linux baseadas em systemd. Seu uso é especialmente vantajoso em **servidores Ubuntu** e ambientes de nuvem.  

Precisa de um **exemplo específico** (ex: configuração IPv6, bond LACP)? Posso detalhar!