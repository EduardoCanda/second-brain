O **IP (Internet Protocol)** é o protocolo responsável pelo endereçamento e roteamento dos pacotes de dados em redes. Ele funciona na **Camada de Rede** do modelo OSI e permite que dispositivos se comuniquem entre si por meio de endereços únicos.

---

## Estrutura do Endereço IP

Um endereço IP identifica de forma única cada dispositivo em uma rede.  
Existem dois formatos principais:

### IPv4
- Formato de **32 bits** (4 octetos).
- Representado em decimal, separado por pontos.
- Exemplo: `192.168.0.1`
- Capacidade de aproximadamente **4,3 bilhões de endereços**.
- Pode ser dividido em:
  - **Endereço de rede** (identifica a rede).
  - **Endereço de host** (identifica o dispositivo dentro da rede).

### IPv6
- Formato de **128 bits**.
- Representado em hexadecimal, separado por dois pontos.
- Exemplo: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Suporte a uma quantidade praticamente ilimitada de endereços.
- Criado para substituir o IPv4 devido ao esgotamento de endereços.

---

## Tipos de Endereço IP

- **Público**: acessível pela internet, fornecido pelo provedor (ISP).  
- **Privado**: usado dentro de redes locais (LAN). Exemplos em IPv4:  
  - `10.0.0.0 – 10.255.255.255`  
  - `172.16.0.0 – 172.31.255.255`  
  - `192.168.0.0 – 192.168.255.255`  

---

## Funções do IP

1. **Endereçamento** – cada dispositivo recebe um IP único.  
2. **Roteamento** – define o caminho dos pacotes entre origem e destino.  
3. **Fragmentação** – divide pacotes grandes em menores para transmissão.  

---

## Protocolos Relacionados

- **TCP (Transmission Control Protocol)**: garante entrega confiável dos pacotes.  
- **UDP (User Datagram Protocol)**: transmissão rápida, sem garantia de entrega.  
- **ICMP (Internet Control Message Protocol)**: usado para mensagens de controle e diagnóstico (ex: `ping`).  

---
## Notas Relacionadas
- [Camada 3 Rede](../01 - Modelo OSI/Camadas/Camada 3 Rede.md)  
- [TCP](TCP/TCP.md)  
- [UDP](UDP.md)  
- [ICMP](ICMP.md) 