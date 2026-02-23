Quando analisamos endereços IP, é importante distinguir entre **IP privado** (usado em redes locais) e **IP público** (visível na Internet).  
Apesar de ambos identificarem dispositivos na rede, eles operam em contextos diferentes e cumprem funções distintas.

---

## IP Privado

O **IP privado** identifica um dispositivo **dentro de uma rede local ([[LAN]])**.  
Esses endereços não são roteáveis na Internet e são atribuídos normalmente pelo roteador via [[DHCP]].

### Faixas reservadas para IPs privados:
- **10.0.0.0 – 10.255.255.255**  
- **172.16.0.0 – 172.31.255.255**  
- **192.168.0.0 – 192.168.255.255**

Esses endereços são visíveis apenas entre dispositivos conectados à mesma rede local.

Exemplo:
> Exibe o IP privado da máquina, como `192.168.0.15`.

---

## IP Público

O **IP público** identifica a rede na Internet.  
É atribuído pelo **provedor de Internet (ISP)** e é o endereço visível por sites e servidores externos.

Quando você acessa sites como “meuip.com.br”, o IP mostrado é o **público**.  
Esse endereço pertence ao roteador/modem que conecta sua rede à Internet.

---

## Relação com NAT

O roteador utiliza o processo de [[NAT]] (Network Address Translation) para permitir que **vários dispositivos com IPs privados compartilhem um único IP público**.  
Dessa forma, todos os dispositivos da rede doméstica acessam a Internet usando o mesmo endereço externo.

---

## Analogia

| Tipo de IP | Visibilidade | Atribuído por | Exemplo | Função |
|-------------|---------------|----------------|----------|---------|
| **Privado** | Apenas dentro da LAN | Roteador (DHCP) | 192.168.0.10 | Identifica o dispositivo na rede local |
| **Público** | Visível na Internet | Provedor (ISP) | 187.55.33.12 | Identifica a rede na Internet |

**Analogia:**  
O IP privado é o **número do apartamento** (válido dentro do prédio).  
O IP público é o **número do prédio** (visível para o carteiro).

---

## Notas Relacionadas
- [[IP]]
- [[DHCP]]
- [[NAT]]
