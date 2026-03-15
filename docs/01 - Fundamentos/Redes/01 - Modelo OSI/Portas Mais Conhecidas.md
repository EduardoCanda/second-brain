As portas são identificadores numéricos usados pelo protocolo **TCP** e **UDP** para diferenciar múltiplas aplicações ou serviços rodando em um mesmo dispositivo.  
Cada porta é representada por um número de **0 a 65535**, dividido em faixas:
- **0 – 1023**: Portas **bem conhecidas** (Well-known ports) → atribuídas a serviços padrão.  
- **1024 – 49151**: Portas **registradas** → associadas a softwares ou aplicações específicas.  
- **49152 – 65535**: Portas **dinâmicas/privadas** → geralmente usadas temporariamente (ephemeral ports).  

---
## Portas Comuns (Well-Known Ports)

| Porta | Protocolo | Serviço/Aplicação                     |
| ----- | --------- | ------------------------------------- |
| 20    | TCP       | FTP (transferência de dados)          |
| 21    | TCP       | FTP (controle)                        |
| 22    | TCP       | SSH (Secure Shell)                    |
| 23    | TCP       | Telnet                                |
| 25    | TCP       | SMTP (envio de e-mails)               |
| 53    | TCP/UDP   | DNS (resolução de nomes)              |
| 67    | UDP       | DHCP (servidor)                       |
| 68    | UDP       | DHCP (cliente)                        |
| 69    | UDP       | TFTP (Trivial File Transfer Protocol) |
| 80    | TCP       | HTTP                                  |
| 110   | TCP       | POP3 (recebimento de e-mails)         |
| 123   | UDP       | NTP (Network Time Protocol)           |
| 143   | TCP       | IMAP (acesso a e-mails)               |
| 161   | UDP       | SNMP (gerenciamento de redes)         |
| 389   | TCP/UDP   | LDAP (diretórios)                     |
| 443   | TCP       | HTTPS (HTTP seguro)                   |
| 465   | TCP       | SMTP seguro (SMTPS)                   |
| 514   | UDP       | Syslog (logs de sistemas)             |
| 587   | TCP       | SMTP (envio autenticado)              |
| 993   | TCP       | IMAPS (IMAP seguro)                   |
| 995   | TCP       | POP3S (POP3 seguro)                   |
| 3306  | TCP       | MySQL                                 |
| 3389  | TCP       | RDP (Remote Desktop Protocol)         |
| 5432  | TCP       | PostgreSQL                            |
| 8080  | TCP       | HTTP alternativo / proxy              |

---

## Notas Relacionadas
- [TCP](../03 - Protocolos/TCP/TCP.md)  
- [UDP](../03 - Protocolos/UDP.md)  
- [Camada 4 Transporte](Camadas/Camada 4 Transporte.md)  
- [DNS](../04 - Serviços de Rede/DNS/DNS.md)
