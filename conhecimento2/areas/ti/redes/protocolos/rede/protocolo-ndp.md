---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
categoria: protocolo
---
O **NDP (Neighbor Discovery Protocol)** é o protocolo usado no **IPv6** para funções similares ao ARP (do IPv4), mas com recursos avançados como autoconfiguração de endereços e detecção de roteadores. Ele opera sobre o **ICMPv6** (Internet Control Message Protocol for IPv6) e é essencial para redes IPv6.

---

## **1. Para que serve o NDP?**
O NDP substitui e expande as funcionalidades do ARP (IPv4) com os seguintes objetivos:
1. **Descoberta de vizinhos** (Resolução de IPv6 → MAC).
2. **Autoconfiguração de endereços** (SLAAC – Stateless Address Autoconfiguration).
3. **Detecção de roteadores** (Descobrir gateways padrão).
4. **Verificação de duplicação de endereços (DAD – Duplicate Address Detection)**.
5. **Redirecionamento de roteadores** (Otimização de rotas).

---

## **2. Mensagens Principais do NDP**
O NDP utiliza **5 tipos de mensagens ICMPv6**:

| Tipo de Mensagem                | Código ICMPv6 | Função                                                               |
| ------------------------------- | ------------- | -------------------------------------------------------------------- |
| **Router Solicitation (RS)**    | 133           | Dispositivo pergunta: "Quem é o roteador nesta rede?"                |
| **Router Advertisement (RA)**   | 134           | Roteador responde: "Eu sou o roteador, aqui estão os prefixos IPv6." |
| **Neighbor Solicitation (NS)**  | 135           | Equivalente ao ARP Request: "Quem tem este IPv6? Informe seu MAC!"   |
| **Neighbor Advertisement (NA)** | 136           | Equivalente ao ARP Reply: "Meu IPv6 é X, e meu MAC é Y."             |
| **Redirect**                    | 137           | Roteador informa um caminho mais eficiente para um destino.          |

---

## **3. Como o NDP funciona?**
### **A. Descoberta de Roteadores (Router Discovery)**
1. Um host envia um **Router Solicitation (RS)** (multicast para `ff02::2`).
2. Roteadores respondem com **Router Advertisement (RA)** (multicast para `ff02::1`), contendo:
   - Prefixo da rede (ex: `2001:db8::/64`).
   - Endereço do roteador (gateway padrão).
   - Se o host deve usar **SLAAC** ou **DHCPv6**.

### **B. Resolução de Endereços (Neighbor Discovery)**
- **Equivalente ao ARP**, mas usando **Neighbor Solicitation (NS)** e **Neighbor Advertisement (NA)**.
- **Exemplo**:
  1. Host A (`2001:db8::1`) quer enviar um pacote para Host B (`2001:db8::2`).
  2. Se o MAC de B não estiver na **tabela de vizinhos**, A envia um **NS** (multicast para `ff02::1:ff00:2`).
  3. B responde com um **NA** contendo seu MAC.

### **C. Detecção de Duplicação de Endereços (DAD)**
- Antes de usar um novo endereço IPv6, um host envia um **NS** para verificar se ninguém já o está usando.
- Se não houver resposta, o endereço é considerado único.

### **D. Redirecionamento (Redirect)**
- Se um roteador perceber que existe um caminho mais eficiente para um destino, ele envia um **Redirect** ao host.

---

## **4. Tabela de Vizinhos (Neighbor Cache)**
- Similar à **ARP Table** no IPv4, armazena mapeamentos **IPv6 → MAC**.
- Pode ser visualizada em:
  - **Linux**: `ip -6 neigh show`
  - **Windows**: `netsh interface ipv6 show neighbors`

**Exemplo:**
```
IPv6 Address                  MAC Address        State
2001:db8::1                  00:1a:2b:3c:4d:5e REACHABLE
fe80::1a2b:3cff:fe4d:5e6f    00:1a:2b:3c:4d:5e STALE
```
- **Estados comuns**: `INCOMPLETE`, `REACHABLE`, `STALE`, `DELAY`, `PROBE`.

---

## **5. Diferenças entre ARP (IPv4) e NDP (IPv6)**
| Característica       | ARP (IPv4)               | NDP (IPv6)                     |
|----------------------|--------------------------|--------------------------------|
| **Protocolo base**   | ARP (próprio)            | ICMPv6                         |
| **Broadcast/Multicast** | Broadcast (`FF:FF:FF:FF:FF:FF`) | Multicast (`ff02::1:ffXX:XXXX`) |
| **Autoconfiguração** | Requer DHCP              | Suporta SLAAC (sem servidor)   |
| **Segurança**        | Vulnerável a spoofing    | Possui **SEcure Neighbor Discovery (SEND)** |
| **Mensagens**        | ARP Request/Reply        | NS, NA, RS, RA, Redirect       |

---

## **6. Vulnerabilidades e Mitigações**
- **Neighbor Spoofing (similar ao ARP Spoofing)**:
  - Um atacante pode enviar **NA falsos** para redirecionar tráfego.
  - **Defesa**: Usar **SEND (RFC 3971)** com criptografia e assinaturas.

---

## **7. Exemplo Prático**
### **Capturando tráfego NDP com `tcpdump` (Linux)**
```sh
tcpdump -i eth0 icmp6 and \( host 2001:db8::1 \)
```
- Filtra mensagens ICMPv6 (NDP) envolvendo um host específico.

### **Mensagem Neighbor Solicitation (NS)**
```plaintext
Type: 135 (Neighbor Solicitation)
Source: 2001:db8::1
Target: 2001:db8::2
Options: Source Link-Layer Address (MAC de quem pergunta)
```
- Enviada para o grupo multicast `ff02::1:ff00:2`.

---

## **8. Conclusão**
O **NDP** é um protocolo crucial para o IPv6, substituindo o ARP com funcionalidades avançadas como **autoconfiguração (SLAAC)**, **descoberta de roteadores** e **controle de redirecionamento**. Ele opera de forma mais eficiente usando **multicast** e possui mecanismos de segurança como **SEND**.

Se quiser explorar **configurações específicas** ou **análise de pacotes NDP**, posso fornecer mais detalhes!