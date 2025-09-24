---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
No Protocolo TCP existe um mecanismo para controle de fluxo e melhorias de performance, caso esse mecanismo não existisse a transferencia de dados poderia ser extremamente prejudicada, uma vez que um conjunto de segmentos só poderiam um a um, pois seria necessária a confirmação(ACK) individual de cada segmento para assim seguir com a transferência.

Pensando nisso foi criado o mecanismo de Janela Deslizante que permite que vários segmentos possam ser enviados de uma única vez, e a confirmação de recebimento por sua vez irá confirmar um agrupamento de bytes.

# Campo Janela TCP (TCP Window)

O **campo de Janela TCP** é configurado pelo **receptor dos dados**, e informa ao emissor **quantos bytes ele ainda é capaz de receber sem sobrecarregar o buffer**. Esse valor pode ser **ajustado dinamicamente** durante a conexão, conforme a disponibilidade de recursos no lado receptor.

Um ponto importante é que **cada lado da conexão possui sua própria janela TCP**, o que permite um **controle de fluxo bidirecional**. Isso significa que o cliente e o servidor podem **ajustar independentemente suas janelas** de recepção, garantindo que o tráfego se mantenha fluido e sem perdas, mesmo com velocidades ou capacidades distintas em cada ponta.



![[janela-deslizante-tcp.png]]


# Exemplo 1: Ilustrativo – "Conversa entre Cliente e Servidor"

Imagine que você (cliente) está baixando um arquivo de um servidor. Seu computador tem um buffer de recepção com **capacidade de 10.000 bytes**, mas, no momento, ele já tem **6.000 bytes ocupados**, processando os dados recebidos.

Então, ele envia para o servidor:

`"Ei servidor, minha janela TCP agora é 4000!"`

➡ Isso significa: "Pode continuar me enviando até **4.000 bytes** antes que eu fique sem espaço."

Se o servidor respeitar esse limite, tudo funciona bem. Mas se tentar enviar mais que isso, o cliente **não vai confirmar o recebimento**, e o TCP **vai pausar a transmissão** até a janela ser atualizada (quando o buffer for liberado).

---

# Exemplo 2: Técnico – Sequência de pacotes

| Evento                          | Seq. | Ack. | Janela TCP | Observação                                        |
| ------------------------------- | ---- | ---- | ---------- | ------------------------------------------------- |
| Cliente envia solicitação (SYN) | 100  | -    | -          | Início da conexão                                 |
| Servidor responde (SYN-ACK)     | 500  | 101  | 10.000     | Servidor com janela inicial de 10.000 bytes       |
| Cliente envia ACK               | 101  | 501  | 8.000      | Cliente informa que pode receber mais 8.000 bytes |
| Servidor envia 6.000 bytes      | 501  | -    | -          | Cliente processa parte dos dados recebidos        |
| Cliente envia ACK               | -    | 6501 | 2.000      | Cliente reduziu janela (ainda tem 2.000 livres)   |
| Cliente processa +4.000 bytes   | -    | -    | -          | Libera espaço no buffer                           |
| Cliente envia novo ACK          | -    | 6501 | 6.000      | Cliente informa nova janela disponível            |

➡ Aqui vemos como a **janela é atualizada dinamicamente** com base no espaço disponível no buffer de recepção.  
Se em algum momento a janela for reduzida para 0, o emissor entra em **espera (zero window)** e aguarda o próximo update da janela.

---

### 🧠 Conclusão prática

- A **janela TCP evita sobrecarga** do receptor.
    
- Cada lado tem sua **própria janela** → controle **bidirecional**.
    
- O campo é crucial para implementar o **controle de fluxo dinâmico** no TCP.
    
- O valor da janela pode ser alterado **a qualquer momento**, via header TCP.

---

Se quiser, posso também gerar um **diagrama visual** com as setas e buffers para representar esses exemplos de forma gráfica. Deseja isso?