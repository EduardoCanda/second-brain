---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
Como podemos visualizar, o protocolo TCP implementa um **mecanismo de confirmação de recebimento**. Esse mecanismo garante que um segmento foi entregue com sucesso antes que os próximos segmentos sejam enviados, proporcionando confiabilidade na comunicação.

Essa confirmação é realizada através de um campo chamado **Número de Confirmação**, presente no cabeçalho TCP. Ele trabalha em conjunto com o **número de sequência**, que é negociado inicialmente durante o [[#Inicio Conexão TCP - Handshare 3 vias TCP| Handshake 3 vias]], e utilizado para rastrear os dados que foram transmitidos e recebidos corretamente.

> 💡 É importante destacar que o TCP realiza **confirmação de recebimento de bytes**, e não de segmentos inteiros.  
> Isso significa que os números de sequência e de confirmação sempre operam na **unidade de bytes**.

Além disso, o TCP possui um mecanismo de **retransmissão automática**. Caso a confirmação de recebimento não seja recebida dentro de um intervalo de tempo, o segmento é retransmitido.  
Esse tempo limite (**timeout**) é ajustado dinamicamente com base no **RTT (Round Trip Time)** — o tempo que um segmento leva para ir até o destino e retornar com a confirmação.
# Exemplo prático

Vamos simular uma comunicação entre um **cliente** e um **servidor**, com os seguintes passos:

1. Handshake de 3 vias
2. Envio de dados do cliente para o servidor
3. Confirmação (ACK) do servidor    
4. Envio de dados do servidor para o cliente
5. Confirmação (ACK) do cliente

---

### 🧱 Premissas iniciais:

- Cliente inicia com `seq = 1000`
- Servidor inicia com `seq = 3000`
- Cada dado enviado tem 5 bytes (`"HELLO"` ou `"WORLD"` por exemplo)

---

## 🚦 Etapa 1: Handshake de 3 vias

|Origem|Destino|Flags|Seq|Ack|Dados|
|---|---|---|---|---|---|
|Cliente|Servidor|SYN|1000|—|—|
|Servidor|Cliente|SYN, ACK|3000|1001|—|
|Cliente|Servidor|ACK|1001|3001|—|

🔍 _Observações:_

- O SYN **consome 1 unidade de sequência**
- O ACK **não consome sequência** (sem dados)

---

## 📤 Etapa 2: Cliente envia dados

|Origem|Destino|Flags|Seq|Ack|Dados|
|---|---|---|---|---|---|
|Cliente|Servidor|PSH, ACK|1001|3001|"HELLO"|

> Enviou 5 bytes → `seq = 1001` até `1005`  
> Próximo `seq` do cliente será `1006`

---

## 📥 Etapa 3: Servidor confirma recebimento

|Origem|Destino|Flags|Seq|Ack|Dados|
|---|---|---|---|---|---|
|Servidor|Cliente|ACK|3001|1006|—|

> Está dizendo: “Recebi até o byte 1005. Agora espero o 1006”

---

## 📤 Etapa 4: Servidor envia dados

|Origem|Destino|Flags|Seq|Ack|Dados|
|---|---|---|---|---|---|
|Servidor|Cliente|PSH, ACK|3001|1006|"WORLD"|

> Enviou 5 bytes → `seq = 3001` até `3005`  
> Próximo `seq` do servidor será `3006`

---

## 📥 Etapa 5: Cliente confirma recebimento

|Origem|Destino|Flags|Seq|Ack|Dados|
|---|---|---|---|---|---|
|Cliente|Servidor|ACK|1006|3006|—|

> Cliente confirma que recebeu até o byte 3005, e espera o 3006


## 🧠 Visualização rápida da evolução


```
Cliente: seq=1000 (SYN)      → depois → seq=1001 → seq=1006 
Servidor: seq=3000 (SYN-ACK) → depois → seq=3001 → seq=3006  

ACKs: 
Servidor → ack=1006 
Cliente  → ack=3006
```



