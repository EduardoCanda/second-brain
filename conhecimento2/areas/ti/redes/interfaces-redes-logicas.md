---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
As **interfaces de rede lógicas** são entidades virtuais que permitem a comunicação em uma rede sem depender exclusivamente de hardware físico. Elas são criadas por software e funcionam como "adaptadores de rede virtuais", possibilitando funcionalidades avançadas como redundância, segmentação e gerenciamento flexível do tráfego.  

---

## **1. O Que São Interfaces Lógicas?**  
São representações virtuais de interfaces de rede, que **não correspondem a um dispositivo físico** (como uma placa de rede Ethernet ou Wi-Fi). Elas são configuradas no sistema operacional ou em dispositivos de rede (roteadores, switches) para:  
- **Dividir uma interface física em múltiplas virtuais** (VLANs, subinterfaces).  
- **Criar túneis seguros** (VPNs, GRE, IPsec).  
- **Fornecer redundância** (bonding/agregação de links).  
- **Isolar tráfego** (para segurança ou QoS).  

---

## **2. Tipos Comuns de Interfaces Lógicas**  

### **A. VLAN (Virtual LAN)**  
- **O que faz**: Divide uma rede física em várias redes lógicas independentes.  
- **Como funciona**:  
  - Uma interface física (ex: `eth0`) é dividida em subinterfaces como `eth0.10` (VLAN 10) e `eth0.20` (VLAN 20).  
  - O tráfego é separado por tags (IEEE 802.1Q).  
- **Exemplo de uso**:  
  ```sh
  # Configurar VLAN 10 em Linux
  ip link add link eth0 name eth0.10 type vlan id 10
  ip addr add 192.168.10.1/24 dev eth0.10
  ip link set eth0.10 up
  ```

### **B. Subinterfaces**  
- **O que faz**: Permite que uma única interface física tenha múltiplos endereços IP ou funcione em várias redes.  
- **Exemplo**:  
  - `eth0:0` (IP `192.168.1.10`) e `eth0:1` (IP `192.168.1.11`) na mesma placa de rede.  

### **C. Túneis (VPNs e Interfaces Virtuais)**  
- **Tipos**:  
  - **TAP/TUN**: Interfaces virtuais para VPNs (ex: OpenVPN).  
  - **GRE/IPsec**: Túneis para conectar redes remotas.  
- **Exemplo (TUN no OpenVPN)**:  
  ```sh
  # Interface tun0 criada pelo OpenVPN
  ip addr show tun0
  ```

### **D. Bonding/Agregação de Links**  
- **O que faz**: Combina múltiplas interfaces físicas em uma única lógica para aumentar largura de banda ou redundância.  
- **Modos comuns**:  
  - **mode=0 (balance-rr)**: Round-robin (balanceamento).  
  - **mode=1 (active-backup)**: Failover (redundância).  
- **Exemplo (Linux)**:  
  ```sh
  # Criar bond0 com eth1 e eth2
  ip link add bond0 type bond
  ip link set eth1 master bond0
  ip link set eth2 master bond0
  ip link set bond0 up
  ```

### **E. Loopback (lo)**  
- **O que faz**: Interface virtual que permite a um dispositivo comunicar consigo mesmo.  
- **IP padrão**: `127.0.0.1` (IPv4) ou `::1` (IPv6).  
- **Uso**: Testes locais, serviços internos (ex: banco de dados rodando em `localhost`).  

---

## **3. Vantagens das Interfaces Lógicas**  
✅ **Flexibilidade**: Criar redes virtuais sem hardware adicional.  
✅ **Isolamento**: Separar tráfego (ex: VLANs para departamentos).  
✅ **Redundância**: Agregação de links para alta disponibilidade.  
✅ **Segurança**: Túneis criptografados (VPNs) ou filtragem por VLAN.  

---

## **4. Exemplos Práticos**  
### **Cenário 1: VLANs em um Escritório**  
- **Interface física**: `eth0` no switch.  
- **Interfaces lógicas**:  
  - `eth0.10` (VLAN 10 → Departamento Financeiro).  
  - `eth0.20` (VLAN 20 → TI).  
- **Resultado**: O tráfego das VLANs é isolado, mesmo usando a mesma infraestrutura física.  

### **Cenário 2: VPN com Interface TUN**  
- **Interface física**: `eth0` (conexão internet).  
- **Interface lógica**: `tun0` (criada pelo OpenVPN).  
- **Resultado**: Tráfego criptografado entre o cliente e a rede remota.  

---

## **5. Como Visualizar Interfaces Lógicas?**  
- **Linux**:  
  ```sh
  ip link show  # Lista todas as interfaces (físicas e lógicas)
  ifconfig      # Método tradicional (menos detalhes)
  ```
- **Windows**:  
  ```powershell
  Get-NetAdapter | Where-Object { $_.Virtual -eq $true }
  ```

---

## **6. Conclusão**  
Interfaces lógicas são **ferramentas poderosas** para gerenciar redes de forma eficiente, seja para segmentação (VLANs), redundância (bonding) ou segurança (VPNs). Elas permitem que uma única infraestrutura física suporte múltiplos requisitos lógicos, reduzindo custos e aumentando a flexibilidade.  

Se precisar de **exemplos de configuração em roteadores Cisco ou Windows**, posso detalhar!