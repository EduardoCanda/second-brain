---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---

Um **segmento TCP** é composto por um **cabeçalho fixo de 20 bytes** (mínimo) e pode conter **campos opcionais e os dados (payload)**. Ele é usado para controle, confiabilidade e transporte de dados entre dois hosts.

---

## 📦 Estrutura Geral do Cabeçalho TCP

![[estrutura-segmento-tcp.png]]
---

## 🧩 Campo a Campo

### 1. **Porta de Origem (16 bits)**

- Identifica a **porta de origem** no host emissor.
    
- Ex: 49152 (porta aleatória escolhida pelo cliente).
    

---

### 2. **Porta de Destino (16 bits)**

- Identifica a **porta de destino** no host receptor.
    
- Ex: 80 (HTTP), 443 (HTTPS), 22 (SSH).
    

---

### 3. **Número de Sequência (Sequence Number) (32 bits)**

- Informa o número do **primeiro byte dos dados** sendo enviados naquele segmento.
    
- Usado para **reconstruir a ordem dos dados** e garantir confiabilidade.
    
- No handshake, é o **número inicial aleatório (ISN)**.
    

---

### 4. **Número de Confirmação (Acknowledgment Number) (32 bits)**

- Informa o **próximo número de sequência esperado** pelo receptor.
    
- Só é válido quando a flag **ACK** está ativa.
    
- Ex: Se recebeu até o byte 1000, envia ack = 1001.
    

---

### 5. **Tamanho do Cabeçalho (Data Offset) (4 bits)**

- Indica o **tamanho do cabeçalho TCP** em múltiplos de 4 bytes(quantidade de linhas do cabeçalho).
    
- Mínimo: 5 (20 bytes), valor máximo: 15 (60 bytes, se houver muitas opções).
    

---

### 6. **Reservado (3 bits)**

- Reservado para uso futuro.
    
- Sempre definido como zero nos segmentos atuais.
    

---

### 7. **Flags (9 bits)**

Cada bit representa um controle diferente. São:

|Flag|Nome|Função|
|---|---|---|
|NS|ECN Nonce|Controle de congestionamento|
|CWR|Congestion Window Reduced|Indica congestionamento controlado|
|ECE|ECN Echo|Indica congestionamento detectado|
|URG|Urgent|Habilita o campo Ponteiro de Urgência|
|ACK|Acknowledge|Número de confirmação é válido|
|PSH|Push|Solicita entrega imediata dos dados|
|RST|Reset|Reinicia a conexão|
|SYN|Synchronize|Início da conexão (handshake)|
|FIN|Finish|Solicita finalização da conexão|

---

### 8. **Janela de Recepção (Window Size) (16 bits)**

- Indica **quantos bytes o receptor está preparado para receber**.
    
- É o mecanismo de **controle de fluxo** do TCP ([[janela-deslizante-tcp|janela deslizante]]).
    

---

### 9. **[[checksum-ipv4|checksum-ipv4]] (16 bits)**

- Utilizado para verificar **erros no cabeçalho e nos dados**.
    
- Inclui também o **pseudo-cabeçalho IP** (endereços IP, protocolo, etc.) no cálculo.
    
- Valida a integridade do segmento.
    

---

### 10. **Ponteiro de Urgência (Urgent Pointer) (16 bits)**

- Indica a posição do **último byte urgente** nos dados.
    
- Só é válido se a flag **URG** estiver ativada.
    
- Pouco usado atualmente.
    

---

### 11. **Opções TCP (0–40 bytes)**

- Campo opcional com funcionalidades extras.
    
- Exemplo: **MSS (Maximum Segment Size)**, **Timestamp**, **SACK (Selective Acknowledgment)**.
    
- Alinha o tamanho do cabeçalho para múltiplos de 4 bytes.
    
|**Kind**|**Nome da Opção**|**Tamanho (bytes)**|**Usada em**|**Descrição**|**RFC / Observações**|
|---|---|---|---|---|---|
|`0`|End of Option List (EOL)|1|Qualquer segmento|Indica o fim das opções|RFC 793|
|`1`|No Operation (NOP)|1|Qualquer segmento|Byte de preenchimento (padding)|Usado para alinhamento|
|`2`|Maximum Segment Size (MSS)|4|SYN|Informa o tamanho máximo de segmento aceito|RFC 879|
|`3`|Window Scale|3|SYN|Expande a janela para além dos 65.535 bytes|RFC 7323|
|`4`|SACK Permitted|2|SYN|Informa suporte a SACK|RFC 2018|
|`5`|SACK|Variável (10+ bytes)|Pós-perda|Lista blocos de dados recebidos fora de ordem|RFC 2018|
|`8`|Timestamp|10|SYN e dados|Timestamps para RTT e PAWS|RFC 7323|
|`28`|User Timeout Option (UTO)|4|SYN|Define timeout customizado de inatividade|RFC 5482|
|`29`|TCP Authentication Option|Variável|Segurança|Protege pacotes TCP com autenticação HMAC|RFC 5925|
|`34`|TCP Fast Open (TFO) Cookie|Variável|SYN|Permite envio de dados no SYN inicial com cookie de validação|RFC 7413|
![[opcoes-segmento-tcp.png]]



### 12. **Dados (Payload)**

- O conteúdo da aplicação.
    
- Pode variar de 0 até o **tamanho máximo do segmento TCP** (geralmente 1460 bytes com MTU padrão de 1500).
    

---

## 🧠 Curiosidades úteis

- O **número de sequência e de confirmação** são em bytes, não em pacotes.
    
- O campo **janela TCP** é dinâmico, adaptando-se à condição da rede.
    
- O campo **checksum** é obrigatório e protege a integridade de todo o segmento.
    
- Flags como **SYN**, **ACK** e **FIN** são combinadas para controlar o ciclo de vida da conexão.