---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
# Inicio Conexão TCP - Handshare 3 vias TCP

O Inicio de toda conexão TCP começa em um processo conhecido como Handshake TCP, esse processo é divido em 3 passos que sempre é iniciado pelo cliente e segue o seguinte processo:

1. Cliente envia um segmento TCP com um número de sequencia aleatório e o BIT SYN ativado para o servidor, indicando que deseja iniciar uma conexão.

```
Cliente → Servidor
Flags: SYN
seq = 1000
```

2. O Servidor responde o Cliente com um Segmento com o bit SYN e o bit ACK ativado, confirmando o recebimento do primeiro segmento enviado para o cliente, ela também gera um novo número de sequencia aleatório .

```
Servidor → Cliente
Flags: SYN, ACK
seq = 3000
ack = 1001  ← confirmando o SYN do cliente (1000 + 1)****
```

3. O Cliente envia um novo segmento TCP confirmando o recebimento do SYN ACK e envia também um novo segmento com o bit ACK ativado dando assim o inicio da conexão.

```
Cliente → Servidor
Flags: ACK
seq = 1001
ack = 3001  ← confirmando o SYN do servidor (3000 + 1)****
```


![[handshake-3-vias-syn-tcp.png]]

Neste processo de abertura de conexão são trocadas informações como:

- Tamanho da Janela TCP
- Tamanho de Cada Segmento TCP
# Fim Conexão TCP - Handshake de 4 vias TCP

O **encerramento da conexão TCP** não é simultâneo, cada lado **encerra sua transmissão independentemente** — ou seja, o cliente pode parar de enviar dados, mas ainda continuar recebendo dados do servidor (e vice-versa), esse processo acontece através do envio da flag **FIN (Finish)**, junto com um ACK, de forma ordenada.

---

## 📦 Etapas do _Four-Way Handshake_

Suponha que o **Cliente** deseja encerrar a conexão:

|Etapa|Origem|Destino|Flags|Seq|Ack|Observação|
|---|---|---|---|---|---|---|
|1|Cliente|Servidor|FIN, ACK|1006|3006|Cliente quer encerrar envio|
|2|Servidor|Cliente|ACK|3006|1007|Confirma recebimento do FIN|
|3|Servidor|Cliente|FIN, ACK|3006|1007|Servidor quer encerrar envio|
|4|Cliente|Servidor|ACK|1007|3007|Cliente confirma o FIN do servidor|

---

### ✅ Detalhes importantes

- O **FIN consome um número de sequência**, assim como o SYN.

- O ACK **não consome sequência**, pois não carrega dados.

- Entre a etapa 2 e 3, o servidor ainda pode continuar enviando dados — o fechamento é **unilateral por etapa**.

- Após o envio do último ACK, o lado que enviou entra em estado **TIME_WAIT**.

---

## 🕒 O que é TIME_WAIT?

Após o encerramento da conexão, o lado que **encerra por último** entra no estado `TIME_WAIT` por um período (normalmente 2×RTT).  
Esse tempo garante que **retransmissões atrasadas não causem confusão** com futuras conexões TCP entre os mesmos IPs e portas.

---

### 🧠 Exemplo completo com sequência:

1. Cliente: FIN, ACK   (seq=1006, ack=3006) 
2. Servidor: ACK       (seq=3006, ack=1007) 
3. Servidor: FIN, ACK  (seq=3006, ack=1007) 
4. Cliente: ACK        (seq=1007, ack=3007)`

---
## 📉 Estados TCP envolvidos

Durante o encerramento, os sockets TCP passam por vários estados. Os principais são:

- `ESTABLISHED`: conexão ativa
- `FIN_WAIT_1`: lado que iniciou o FIN
- `FIN_WAIT_2`: após receber ACK do FIN
- `CLOSE_WAIT`: aguardando para encerrar também
- `LAST_ACK`: enviou o FIN e espera ACK
- `TIME_WAIT`: após o encerramento completo, esperando o tempo de segurança
- `CLOSED`: conexão encerrada de fato

![[handshake-4-vias-fin-tcp.png]]
