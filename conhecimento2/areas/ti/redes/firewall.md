---
tags:
  - Fundamentos
  - Redes
---
Um **firewall** é um sistema de segurança de rede que **monitora e controla o tráfego de dados** entre redes distintas (como uma rede local e a internet), com base em **regras predefinidas**. Ele atua como uma "barreira" para bloquear acessos não autorizados, prevenir ataques e proteger sistemas contra ameaças externas ou internas.

---

## **1. Para que serve um firewall?**
- **Bloquear tráfego malicioso** (ex: hackers, malware).
- **Filtrar conexões indesejadas** (ex: portas abertas não utilizadas).
- **Proteger dados sensíveis** (ex: bancos de dados, servidores).
- **Registrar atividades suspeitas** (logs para auditoria).
- **Aplicar políticas de segurança** (ex: restringir acesso a sites).

---

## **2. Tipos de Firewall**
### **A. Por Localização**
| Tipo                | Descrição                                                                 |
|---------------------|--------------------------------------------------------------------------|
| **Firewall de Rede**  | Protege toda uma rede (ex: entre a LAN e a internet). Ex: Cisco ASA, pfSense. |
| **Firewall de Host**  | Instalado em dispositivos individuais (ex: Windows Defender Firewall, iptables no Linux). |

### **B. Por Tecnologia**
| Tipo                     | Como Funciona                                                                 | Exemplo de Uso                          |
|--------------------------|------------------------------------------------------------------------------|----------------------------------------|
| **Firewall de Pacotes (Stateless)** | Filtra pacotes com base em **IP, porta e protocolo** (sem analisar contexto). | Bloqueio básico de portas.             |
| **Firewall Stateful**     | Analisa **o estado da conexão** (ex: se pertence a uma sessão estabelecida).  | Proteção contra spoofing.              |
| **Firewall de Aplicação (Proxy)** | Inspeciona tráfego em **nível de aplicativo** (ex: HTTP, FTP).               | Bloquear downloads maliciosos.         |
| **Next-Generation Firewall (NGFW)** | Combina filtros tradicionais com **IDS/IPS, antivírus, VPN e deep packet inspection (DPI)**. | Empresas com segurança avançada. |

---

## **3. Como um Firewall Funciona?**
### **Regras Típicas de Filtragem**
Um firewall decide se **permite (ALLOW)** ou **nega (DENY)** tráfego com base em:
- **Endereço IP de origem/destino**.
- **Portas TCP/UDP** (ex: bloquear a porta 22 para SSH).
- **Protocolo** (TCP, UDP, ICMP).
- **Estado da conexão** (apenas para firewalls stateful).
- **Conteúdo do pacote** (para NGFW).

### **Exemplo de Regra (Linux - iptables)**
```sh
# Bloquear todo o tráfego SSH (porta 22) vindo do IP 192.168.1.100
iptables -A INPUT -s 192.168.1.100 -p tcp --dport 22 -j DROP
```

---

## **4. Firewall Hardware vs. Software**
| Tipo               | Vantagens                          | Desvantagens                     |
|--------------------|-----------------------------------|----------------------------------|
| **Hardware** (Ex: Cisco ASA, FortiGate) | Alto desempenho, dedicado a redes grandes. | Custo elevado, complexidade. |
| **Software** (Ex: Windows Firewall, iptables) | Flexível, gratuito (em alguns casos). | Pode sobrecarregar o sistema. |

---

## **5. Ameaças que um Firewall Pode Mitigar**
- **Ataques DDoS**: Limita conexões simultâneas.
- **Port Scanning**: Bloqueia varreduras de portas.
- **Malware**: NGFWs podem identificar tráfego malicioso.
- **Acessos não autorizados**: Restringe conexões a serviços internos.

---

## **6. Limitações de um Firewall**
- **Não protege contra ameaças internas** (ex: usuários maliciosos dentro da rede).
- **Não substitui antivírus/antimalware** (a menos que seja um NGFW).
- **Pode ser contornado** por técnicas como **túneis criptografados** (ex: VPNs não autorizadas).

---

## **7. Boas Práticas de Configuração**
1. **Política padrão DENY**: Bloquear tudo e liberar apenas o necessário.
2. **Atualizar regras regularmente**: Remover permissões obsoletas.
3. **Logs e monitoramento**: Registrar tráfego bloqueado para análise.
4. **Segmentação de rede**: Usar firewalls internos para dividir redes (ex: VLANs).

---

## **8. Exemplo de Uso em Redes Corporativas**
- **Perímetro**: Firewall hardware filtra tráfego internet/LAN.
- **Servidores**: Firewall de host restringe acessos ao banco de dados.
- **Usuários**: NGFW bloqueia sites perigosos e malware.

---

## **9. Ferramentas Populares**
| Nome               | Tipo                     | Plataforma           |
|--------------------|--------------------------|---------------------|
| **pfSense**        | Firewall de rede         | Software (FreeBSD)  |
| **iptables/nftables** | Firewall de host     | Linux               |
| **Cisco ASA**      | Firewall hardware        | Redes empresariais  |
| **Windows Defender Firewall** | Firewall de host | Windows           |

---

## **10. Conclusão**
Um firewall é a **primeira linha de defesa** em segurança de redes, mas deve ser combinado com outras medidas (como antivírus, VPNs e conscientização de usuários). Sua eficácia depende diretamente da **configuração correta** e da **atualização constante**. 

Se quiser **exemplos de configuração** ou **detalhes sobre NGFWs**, posso aprofundar!