# Protocolos de Rede

Este índice resume os principais protocolos de rede, suas camadas no Modelo OSI e links para estudo detalhado.

| Protocolo                               | Camada (OSI)          | Função Principal                            | Nota                           |
| --------------------------------------- | --------------------- | ------------------------------------------- | ------------------------------ |
| [[ARP]]                                 | Camada 2 - Enlace     | Resolve endereços IP para endereços MAC.    | Usado em LANs.                 |
| [[IP]]                                  | Camada 3 - Rede       | Entrega de pacotes entre redes.             | Base para IPv4/IPv6.           |
| [[ICMP]]                                | Camada 3 - Rede       | Diagnóstico e controle.                     | Usado em `ping`, `traceroute`. |
| [[TCP]] | Camada 4 - Transporte | Comunicação confiável, orientada a conexão. | Usado em HTTP, SSH, etc.       |
| [[UDP]]                                 | Camada 4 - Transporte | Comunicação simples, sem conexão.           | Usado em DNS, streaming.       |
| DHCP                                    | Camada 7 - Aplicação  | Distribui IPs automaticamente.              | Facilita administração.        |
| [[DNS]]                                 | Camada 7 - Aplicação  | Resolve nomes de domínio para IPs.          | Essencial para navegação.      |
| [[HTTP]]                                | Camada 7 - Aplicação  | Comunicação web.                            | Inclua HTTPS, HTTP/2, HTTP/3.  |
| [[SSH]]                                 | Camada 7 - Aplicação  | Acesso remoto seguro.                       | Substitui Telnet.              |
| [[Telnet]]                              | Camada 7 - Aplicação  | Acesso remoto não criptografado.            | Usado apenas em testes.        |

> 💡 **Dica:** revise a relação entre protocolos e camadas no arquivo [[Fundamentos/Redes/01 - Modelo OSI/Overview|Overview]]
