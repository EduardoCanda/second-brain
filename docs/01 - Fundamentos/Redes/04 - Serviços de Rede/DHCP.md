DHCP (Dynamic Host Configuration Protocol), serve para atrelar um endereço [IP](../03 - Protocolos/IP.md).

Ha varias maneiras de atrelar um endereço [IP](../03 - Protocolos/IP.md) à um dispositivo na rede. Pode ser inserido manualmente, fisicamente ou a forma mais comum que é a automática.

É aí que o DHCP entra. Este protocolo serve para atribuir um endereço IP a quem estiver pedindo, de maneira dinâmica. Alocando endereços IPs disponíveis no momento.

O processo é feito em quatro etapas, e é conhecido como DORA (Discovery, Offer, Request, Acknowledgment)

```mermaid
sequenceDiagram
    participant Cliente
    participant Servidor_DHCP

    Cliente->>Servidor_DHCP: DHCP Discover (broadcast)
    Note right of Cliente: "Tem algum servidor DHCP disponível?"

    Servidor_DHCP-->>Cliente: DHCP Offer
    Note left of Servidor_DHCP: "Posso te oferecer este IP + config"

    Cliente->>Servidor_DHCP: DHCP Request
    Note right of Cliente: "Quero usar esse IP ofertado"

    Servidor_DHCP-->>Cliente: DHCP Acknowledge (ACK)
    Note left of Servidor_DHCP: "IP reservado pra você"
```
