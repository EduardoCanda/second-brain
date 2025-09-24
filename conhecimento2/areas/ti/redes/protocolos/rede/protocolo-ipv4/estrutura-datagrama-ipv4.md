---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
Quando um protocolo da camada superior (como TCP ou UDP) precisa enviar dados, o IPv4 **encapsula** esses dados em um **pacote IP**, que contém:

- **Cabeçalho IPv4** (mínimo de 20 bytes, podendo ir além com opções extras)
    
- **Payload (dados úteis)**
    

O cabeçalho IPv4 tem vários campos importantes:

| Campo                            | Tamanho (bits) | Descrição                                                                  | Funcionalidade Principal                                                 |     |
| -------------------------------- | -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --- |
| **Version**                      | 4              | Indica a versão do protocolo IP                                            | Deve ser `4` para IPv4                                                   |     |
| **IHL (Header Length)**          | 4              | Comprimento do cabeçalho em múltiplos de 32 bits                           | Permite identificar onde começa o payload                                |     |
| **Type of Service (ToS)** / DSCP | 8              | Define prioridade e tipo de tráfego (atualmente chamado de DSCP/ECN)       | Permite controle de QoS (Qualidade de Serviço)                           |     |
| **Total Length**                 | 16             | Tamanho total do pacote (cabeçalho + dados), em bytes                      | Garante que o receptor saiba onde o pacote termina                       |     |
| **Identification**               | 16             | Identificador do pacote                                                    | Usado para reconstituir fragmentos de um mesmo pacote                    |     |
| **Flags**                        | 3              | Controle de fragmentação                                                   | Bits: reservado, DF (Don’t Fragment), MF (More Fragments)                |     |
| **Fragment Offset**              | 13             | Indica a posição de um fragmento dentro do pacote original                 | Permite remontar pacotes fragmentados corretamente                       |     |
| **Time to Live (TTL)**           | 8              | Número máximo de saltos (hops)                                             | Evita que pacotes fiquem em loop indefinidamente na rede                 |     |
| **Protocol**                     | 8              | Protocolo da camada superior (ex: TCP = 6, UDP = 17)                       | Informa qual protocolo deve processar o payload                          |     |
| **Header Checksum**              | 16             | Soma de verificação do cabeçalho                                           | Permite detectar erros no cabeçalho                                      |     |
| **Source Address**               | 32             | Endereço IP de origem                                                      | Identifica o remetente do pacote                                         |     |
| **Destination Address**          | 32             | Endereço IP de destino                                                     | Indica para onde o pacote deve ser entregue                              |     |
| **Options** (opcional)           | Variável       | Campo usado para funções adicionais (ex: timestamp, segurança, roteamento) | Pouco usado, pode carregar info como "source route", "record route" etc. |     |
| **Padding** (se necessário)      | Variável       | Preenchimento para garantir múltiplo de 32 bits                            | Mantém o alinhamento correto do cabeçalho                                |     |
