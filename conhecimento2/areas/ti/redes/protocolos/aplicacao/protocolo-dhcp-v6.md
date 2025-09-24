---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
O **DHCPv6 (Dynamic Host Configuration Protocol for IPv6)** é um protocolo utilizado para atribuir **endereços IPv6** e outros parâmetros de configuração a dispositivos em uma rede de forma dinâmica. Ele é a versão IPv6 do DHCP tradicional (DHCPv4), mas com diferenças significativas devido às características do IPv6, como autoconfiguração automática (**SLAAC**). Vamos explorar seu funcionamento em detalhes:

---

## **1. Objetivos do DHCPv6**
- Atribuir **endereços IPv6** dinamicamente.
- Fornecer **outras configurações** como:
  - Servidores DNS (via **Option 23**).
  - Prefixos de domínio (Option 24).
  - Informações de NTP (Option 56).
- Funcionar em conjunto com **SLAAC** (Stateless Address Autoconfiguration) ou substituí-lo quando necessário.

---

## **2. Modos de Operação do DHCPv6**
O DHCPv6 pode operar de duas formas principais:

### **A. Modo Stateful**
- O servidor DHCPv6 **atribui endereços IPv6 completos** aos clientes (similar ao DHCPv4).
- Usado quando **SLAAC não é suficiente** (ex: redes que exigem controle centralizado).

### **B. Modo Stateless**
- Os clientes geram seus endereços via **SLAAC** (usando o prefixo da rede anunciado por roteadores).
- O servidor DHCPv6 **apenas fornece informações adicionais** (DNS, NTP, etc.).
- Mais comum em redes IPv6 modernas.

---

## **3. Funcionamento do DHCPv6 (Processo Básico)**
O DHCPv6 usa os seguintes tipos de mensagens (todos via **UDP porta 547 (servidor)** e **546 (cliente)**):

### **Passo a Passo (Stateful DHCPv6)**
1. **Solicitação do Cliente (Solicit)**:
   - O cliente envia uma mensagem **Solicit** (multicast para `ff02::1:2`) para descobrir servidores DHCPv6.

2. **Oferta do Servidor (Advertise)**:
   - Servidores DHCPv6 respondem com **Advertise** (unicast ou multicast), indicando que estão disponíveis.

3. **Requisição do Cliente (Request)**:
   - O cliente escolhe um servidor e envia **Request** para solicitar um endereço IPv6 e configurações.

4. **Confirmação do Servidor (Reply)**:
   - O servidor envia **Reply** com:
     - Endereço IPv6 atribuído.
     - Tempo de vida (**lease time**).
     - Outras opções (DNS, NTP, etc.).

5. **Renovação do Endereço (Renew/Rebind)**:
   - O cliente renova o endereço enviando **Renew** (para o servidor original) ou **Rebind** (para qualquer servidor) antes do lease expirar.

---

## **4. Mensagens DHCPv6**
| Mensagem          | Descrição                                                                 |
|-------------------|--------------------------------------------------------------------------|
| **Solicit**       | Cliente procura servidores DHCPv6.                                       |
| **Advertise**     | Servidor anuncia sua disponibilidade.                                    |
| **Request**       | Cliente solicita configurações.                                          |
| **Confirm**       | Cliente verifica se o endereço ainda é válido (após mudança de rede).    |
| **Renew**         | Cliente pede para renovar o lease.                                       |
| **Rebind**        | Cliente tenta renovar com qualquer servidor (se o original não responder).|
| **Reply**         | Servidor envia configurações ao cliente.                                 |
| **Release**       | Cliente libera o endereço antes do lease expirar.                        |
| **Decline**       | Cliente rejeita um endereço inválido.                                    |

---

## **5. DHCPv6 vs. SLAAC**
| Característica       | **DHCPv6 (Stateful)**          | **SLAAC**                           |
|----------------------|-------------------------------|-------------------------------------|
| **Endereçamento**    | Servidor atribui endereços.   | Cliente gera seu próprio endereço.  |
| **Controle**         | Centralizado.                 | Descentralizado.                    |
| **Configurações Adicionais** | Suporta DNS, NTP, etc. | Apenas prefixo da rede (sem DNS).   |
| **Uso Típico**       | Redes empresariais.           | Redes domésticas/ISP.               |

---

## **6. Exemplo de Configuração (Linux - ISC DHCPv6 Server)**
```sh
# Instalar o servidor DHCPv6 (Linux)
sudo apt install isc-dhcp-server

# Configurar /etc/dhcp/dhcpd6.conf
subnet6 2001:db8::/64 {
    range6 2001:db8::100 2001:db8::200;
    option dhcp6.name-servers 2001:db8::1;
    option dhcp6.domain-search "exemplo.com";
}
```

---

## **7. Segurança no DHCPv6**
- **Ataques comuns**:
  - **Spoofing de servidor DHCPv6**: Um atacante pode distribuir configurações falsas.
  - **Exaustão de endereços**: Clientes maliciosos consomem todos os endereços.
- **Proteções**:
  - **DHCPv6 Guard** (em switches): Filtra mensagens DHCPv6 não autorizadas.
  - **RA Guard**: Bloqueia anúncios de roteadores falsos.

---

## **8. DHCPv6 em Redes com e sem Roteador**
### **A. Rede com Roteador IPv6**
- O roteador envia **Router Advertisements (RAs)** com flags:
  - **Managed (M)**: "Use DHCPv6 para endereços."
  - **Other (O)**: "Use DHCPv6 apenas para configurações adicionais."

### **B. Rede sem Roteador**
- O cliente usa **Multicast Solicit** para encontrar um servidor DHCPv6.

---

## **9. Conclusão**
O DHCPv6 é essencial para redes IPv6 que precisam de **controle centralizado** de endereços e configurações. Ele complementa ou substitui o **SLAAC**, dependendo dos requisitos da rede. 

Se precisar de **exemplos de captura de pacotes** ou **configurações em dispositivos específicos** (Cisco, Windows Server), posso detalhar ainda mais!