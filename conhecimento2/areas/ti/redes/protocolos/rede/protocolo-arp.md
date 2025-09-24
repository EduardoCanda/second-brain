---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
categoria:
---
O **ARP (Address Resolution Protocol)** é um protocolo fundamental em redes **Ethernet/IP** que mapeia endereços **IP** para endereços **MAC** (físicos) em uma rede local (LAN). Ele opera na **camada de enlace (Layer 2)** do modelo OSI e é essencial para a comunicação entre dispositivos em uma mesma sub-rede.

---

## **1. Para que serve o ARP?**
Quando um dispositivo quer enviar um pacote para outro na mesma rede, ele precisa saber:
- **Endereço IP** (Layer 3) → Conhecido (ex: `192.168.1.10`).
- **Endereço MAC** (Layer 2) → Precisa ser descoberto (ex: `00:1A:2B:3C:4D:5E`).

O ARP resolve isso consultando ou armazenando em uma tabela (**ARP Cache**) qual MAC corresponde a um IP.

---

## **2. Como o ARP funciona?**
O processo envolve dois tipos de mensagens:
1. **ARP Request (Broadcast)** – "Quem tem esse IP? Por favor, responda com seu MAC!"
2. **ARP Reply (Unicast)** – "Eu tenho esse IP, meu MAC é X."

### **Passo a Passo:**
1. **Dispositivo A** (`IP: 192.168.1.10`) quer enviar um pacote para **Dispositivo B** (`IP: 192.168.1.20`).
2. **A** verifica seu **ARP Cache** (tabela de mapeamento IP→MAC).
   - Se o MAC de **B** já estiver na cache, usa-o diretamente.
   - Se não, inicia um **ARP Request**.
3. **A** envia um **ARP Request** em **broadcast** (todos na rede recebem):
   - "Quem tem **192.168.1.20**? Meu IP é **192.168.1.10**, e meu MAC é **AA:BB:CC:DD:EE:FF**."
4. **B** reconhece seu IP e responde com um **ARP Reply** (unicast para **A**):
   - "Olá **192.168.1.10**, eu sou **192.168.1.20**, meu MAC é **00:1A:2B:3C:4D:5E**."
5. **A** armazena o MAC de **B** em seu **ARP Cache** e envia os dados.

---

## **3. Estrutura das Mensagens ARP**
O ARP usa um **formato fixo** em sua mensagem (tanto Request quanto Reply):

| Campo               | Tamanho (bytes) | Descrição                                      |
|---------------------|----------------|-----------------------------------------------|
| **Hardware Type**   | 2              | Tipo de rede (Ethernet = `1`).                |
| **Protocol Type**   | 2              | Protocolo (IPv4 = `0x0800`).                  |
| **HW Addr Length**  | 1              | Tamanho do MAC (6 para Ethernet).             |
| **Proto Addr Length** | 1            | Tamanho do IP (4 para IPv4).                  |
| **Operation**       | 2              | `1` = Request, `2` = Reply.                   |
| **Sender HW Addr**  | 6              | MAC de quem envia.                            |
| **Sender Proto Addr** | 4            | IP de quem envia.                             |
| **Target HW Addr**  | 6              | MAC de destino (00:00:00:00:00:00 no Request).|
| **Target Proto Addr** | 4            | IP de destino.                                |

### **Exemplo de ARP Request (em Wireshark/Hex):**
```
0000   ff ff ff ff ff ff  aa bb cc dd ee ff  08 06  00 01
0010   08 00  06  04  00 01  aa bb cc dd ee ff  c0 a8 01 0a
0020   00 00 00 00 00 00  c0 a8 01 14
```
- **MAC destino**: `ff:ff:ff:ff:ff:ff` (broadcast).
- **Operação**: `0001` (ARP Request).
- **IP alvo**: `192.168.1.20` (`c0 a8 01 14` em hex).

---

## **4. ARP Cache (Tabela ARP)**
Cada dispositivo mantém uma tabela temporária com mapeamentos **IP→MAC**.
- **No Windows**: `arp -a` no CMD.
- **No Linux**: `arp -n` ou `ip neigh`.

Exemplo:
```
Internet Address      Physical Address      Type
192.168.1.1          00-11-22-33-44-55    dynamic
192.168.1.20         00-1A-2B-3C-4D-5E    dynamic
```
- **Dynamic**: Descoberto via ARP (expira após alguns minutos).
- **Static**: Definido manualmente (não expira).

---

## **5. Tipos de ARP**
- **ARP Padrão (IPv4)**: Mapeia IP → MAC.
- **RARP (Reverse ARP)**: Mapeia MAC → IP (usado em discos sem sistema).
- **Proxy ARP**: Um roteador responde por outro dispositivo.
- **Gratuitous ARP**: Anúncio não solicitado (usado para detectar IP duplicado).

---

## **6. Vulnerabilidades do ARP**
- **ARP Spoofing/ARP Poisoning**: Um atacante envia respostas falsas para redirecionar tráfego (usado em ataques MITM).
  - **Defesa**: Usar **ARP Static** ou ferramentas como **ARPWatch**.

---

## **7. Conclusão**
O ARP é essencial para redes locais, permitindo a tradução de **IPs em MACs** para a entrega correta de quadros Ethernet. Embora simples, ataques como **ARP Spoofing** exigem cuidados em redes não confiáveis.

Se quiser ver exemplos práticos de captura de pacotes ARP ou configurações específicas, posso detalhar ainda mais!