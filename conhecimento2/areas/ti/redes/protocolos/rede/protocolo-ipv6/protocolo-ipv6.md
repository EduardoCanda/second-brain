---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
O **IPv6 (Internet Protocol version 6)** é a versão mais recente do protocolo IP, projetada para substituir o **IPv4** devido ao esgotamento de endereços. Ele introduz melhorias em **escalabilidade, segurança e desempenho**, além de um espaço de endereçamento vastly maior. Vamos explorar seu funcionamento em detalhes:

---

## **1. Principais Características do IPv6**
| **Recurso**               | **Descrição**                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| **Endereços de 128 bits** | Permite ~340 undecilhões (3.4 × 10³⁸) de endereços únicos (vs. 4.3 bilhões do IPv4). |
| **Formato dos Endereços** | Hexadecimal, separado por `:` (ex: `2001:0db8:85a3::8a2e:0370:7334`).      |
| **Autoconfiguração**      | **SLAAC** (Stateless Address Autoconfiguration) permite que dispositivos gerem seu próprio endereço. |
| **Cabeçalho Simplificado** | Menos campos que o IPv4, melhorando eficiência no roteamento.              |
| **Segurança Integrada**   | Suporte nativo a **IPsec** (criptografia e autenticação).                   |
| **Multicast Eficiente**   | Elimina o broadcast do IPv4, substituindo por multicast direcionado.        |

---

## **2. Estrutura de um Endereço IPv6**
Um endereço IPv6 tem **128 bits**, representados em **8 grupos de 16 bits** (hexadecimal):
```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```
- **Regras de abreviação**:
  - Zeros à esquerda podem ser omitidos: `2001:db8:85a3:0:0:8a2e:370:7334`.
  - Grupos consecutivos de zeros podem ser substituídos por `::` (uma vez por endereço):  
    `2001:db8:85a3::8a2e:370:7334`.

---

## **3. Tipos de Endereços IPv6**
| **Tipo**          | **Prefixo** | **Função**                                                                 | **Exemplo**                          |
|--------------------|------------|---------------------------------------------------------------------------|--------------------------------------|
| **Unicast**       | -          | Comunicação um-para-um (similar ao IPv4).                                 | `2001:db8::1` (endereço global).     |
| **Multicast**     | `ff00::/8` | Comunicação um-para-muitos (ex: vídeo streaming).                         | `ff02::1` (todos os nós na rede local). |
| **Anycast**       | -          | Entrega para o "mais próximo" de um grupo de dispositivos (ex: CDNs).     | Usa endereços Unicast.               |
| **Link-Local**    | `fe80::/10` | Comunicação apenas na rede local (não roteável).                          | `fe80::1%eth0` (interface `eth0`).   |

---

## **4. Como o IPv6 Funciona?**
### **A. Autoconfiguração (SLAAC)**
1. O dispositivo obtém o **prefixo da rede** (ex: `2001:db8::/64`) via **Router Advertisement (RA)**.
2. Gera um **sufixo de 64 bits** usando:
   - **Método EUI-64**: Baseado no MAC da interface.
   - **Aleatório**: Para maior privacidade.
3. Resultado: Endereço completo (ex: `2001:db8::1a2b:3cff:fe4d:5e6f`).

### **B. Alocação Dinâmica (DHCPv6)**
- Usado quando **SLAAC não é suficiente** (ex: para enviar configurações como DNS).
- Dois modos:
  - **Stateful**: O servidor DHCPv6 atribui endereços.
  - **Stateless**: Apenas envia informações adicionais (DNS, etc.).

### **C. Comunicação Básica**
- **Neighbor Discovery Protocol (NDP)**: Substitui o ARP do IPv4, resolvendo endereços IPv6 para MAC.
- **ICMPv6**: Usado para mensagens de erro e descoberta de vizinhos.

---

## **5. Cabeçalho IPv6 vs. IPv4**
| **Campo**               | **IPv4**                      | **IPv6**                      |
|-------------------------|-------------------------------|-------------------------------|
| **Tamanho do Endereço** | 32 bits                       | 128 bits                      |
| **Cabeçalho**           | 20 bytes + opções             | 40 bytes fixos + extensões    |
| **Fragmentação**        | Feita por roteadores          | Feita apenas pelo remetente   |
| **Checksum**            | Presente                      | Removido (delegado a TCP/UDP) |
| **Campos obsoletos**    | IHL, TOS, Fragment Offset     | Eliminados para simplificação |

---

## **6. Exemplo de Configuração (Linux)**
### **Atribuir um Endereço IPv6 Estático**
```bash
# Adicionar endereço IPv6 à interface eth0
sudo ip -6 addr add 2001:db8::1/64 dev eth0

# Habilitar a interface
sudo ip link set eth0 up

# Verificar
ip -6 addr show eth0
```

### **Configurar Roteamento IPv6**
```bash
# Adicionar rota padrão
sudo ip -6 route add default via 2001:db8::1

# Verificar rotas
ip -6 route show
```

---

## **7. Migração do IPv4 para IPv6**
- **Pilha Dupla (Dual Stack)**: Dispositivos executam IPv4 e IPv6 simultaneamente.
- **Túneis (6in4, Teredo)**: Encapsula IPv6 em IPv4 para transição gradual.
- **NAT64/DNS64**: Permite que dispositivos IPv6 acessem recursos IPv4.

---

## **8. Segurança no IPv6**
- **IPsec**: Suportado nativamente (criptografia de ponta a ponta).
- **Problemas comuns**:
  - **Neighbor Discovery Spoofing**: Mitigado com **RA Guard** e **SEcure Neighbor Discovery (SEND)**.
  - **Exposição de endereços MAC**: Evitado usando endereços temporários aleatórios.

---

## **9. Ferramentas para Testar IPv6**
| **Comando**          | **Função**                                  |
|----------------------|--------------------------------------------|
| `ping6`              | Testar conectividade IPv6.                 |
| `traceroute6`        | Rastrear rota para um destino IPv6.        |
| `ip -6 addr show`    | Listar endereços IPv6 das interfaces.      |
| `dig AAAA exemplo.com` | Consultar DNS para IPv6 (registro AAAA). |

---

## **10. Conclusão**
O IPv6 resolve o esgotamento de endereços do IPv4 e introduz melhorias em **desempenho, segurança e autoconfiguração**. Embora sua adoção ainda esteja em progresso, é essencial para o futuro da Internet. 

Se precisar de **exemplos de configuração em roteadores (Cisco, MikroTik)** ou **soluções para problemas de compatibilidade**, posso detalhar!