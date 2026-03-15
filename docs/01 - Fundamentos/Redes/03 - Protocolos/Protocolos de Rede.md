Este índice resume os principais protocolos de rede, suas camadas no [Modelo OSI](../01 - Modelo OSI/Modelo OSI.md) e links para estudo detalhado.

| Protocolo  | Camada (OSI)          | Função Principal                            | Nota                           |
| ---------- | --------------------- | ------------------------------------------- | ------------------------------ |
| [ARP](../02 - LAN/ARP.md)    | Camada 2 - Enlace     | Resolve endereços IP para endereços MAC.    | Usado em LANs.                 |
| [IP](IP.md)     | Camada 3 - Rede       | Entrega de pacotes entre redes.             | Base para IPv4/IPv6.           |
| [ICMP](ICMP.md)   | Camada 3 - Rede       | Diagnóstico e controle.                     | Usado em `ping`, `traceroute`. |
| [TCP](TCP/TCP.md)    | Camada 4 - Transporte | Comunicação confiável, orientada a conexão. | Usado em HTTP, SSH, etc.       |
| [UDP](UDP.md)    | Camada 4 - Transporte | Comunicação simples, sem conexão.           | Usado em DNS, streaming.       |
| [DHCP](../04 - Serviços de Rede/DHCP.md)   | Camada 7 - Aplicação  | Distribui IPs automaticamente.              | Facilita administração.        |
| [DNS](../04 - Serviços de Rede/DNS/DNS.md)    | Camada 7 - Aplicação  | Resolve nomes de domínio para IPs.          | Essencial para navegação.      |
| [HTTP](../04 - Serviços de Rede/HTTP.md)   | Camada 7 - Aplicação  | Comunicação web.                            | Inclua HTTPS, HTTP/2, HTTP/3.  |
| [SSH](../05 - Segurança/SSH.md)    | Camada 7 - Aplicação  | Acesso remoto seguro.                       | Substitui Telnet.              |
| [Telnet](../05 - Segurança/Telnet.md) | Camada 7 - Aplicação  | Acesso remoto não criptografado.            | Usado apenas em testes.        |
