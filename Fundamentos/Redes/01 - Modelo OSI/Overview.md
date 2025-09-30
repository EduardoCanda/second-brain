O modelo OSI é um **padrão conceitual** que divide a comunicação em **7 camadas**, cada uma com uma função específica. 

Ele ajuda a entender **como os dados são transmitidos de um computador para outro** em uma rede.

Pense nele como uma pilha, onde cada camada **adiciona ou interpreta informações** antes de entregar para a próxima.

---
# 📚 As 7 Camadas do Modelo OSI

| Camada | Nome                | Função                                                               | Exemplos                             |
| ------ | ------------------- | -------------------------------------------------------------------- | ------------------------------------ |
| **7**  | **Aplicação**       | Interface com o usuário e aplicações.                                | HTTP, HTTPS, FTP, SMTP, DNS          |
| **6**  | **Apresentação**    | Formata os dados para aplicação, criptografa e comprime.             | SSL/TLS, JPEG, MP3, UTF-8            |
| **5**  | **Sessão**          | Estabelece, gerencia e termina sessões de comunicação.               | RPC, NetBIOS, Controle de sessão TLS |
| **4**  | **Transporte**      | Garante entrega confiável, ordenada e sem duplicatas.                | TCP, UDP                             |
| **3**  | **Rede**            | Define endereçamento e roteamento de pacotes.                        | IP, ICMP, OSPF, BGP                  |
| **2**  | **Enlace de Dados** | Detecta e corrige erros de transmissão na rede local.                | Ethernet, Wi-Fi (802.11), PPP        |
| **1**  | **Física**          | Transmite bits em forma de sinais elétricos/ópticos/radiofrequência. | Cabos, Fibra, Rádio, Repetidores     |
