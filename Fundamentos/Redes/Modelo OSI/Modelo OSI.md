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
## 1 - Física (Physical)
Esta camada simplesmente se refere ao componentes físicos usados em uma rede. Dispositivos que usam sinais elétricos para transferir dados entre si em sistema binário(0 e 1).

Um exemplo de disso seria os cabos de internet RJ45.

---
## 2 - Enlance de dados (Data link)
A camada de enlance de dados foca no endereçamento físico da transmissão. Na prática ela é responsável 
garantir que os dados sejam **entregues corretamente entre dois dispositivos na mesma rede física**.

Quando ela recebe um pacote da **camada de rede**, ela o encapsula em um **quadro (frame)**. Nesse processo:
- Adiciona o endereço físico (endereço **MAC**) de origem e destino.
- Pode incluir mecanismos de **detecção de erros** (ex.: CRC).
- Prepara os dados para serem enviados pela **camada física**.

###### Endereçamento físico (MAC):
Dentro de cada computador na rede, há um [[NIC (Network Interface Card)]], componente que provê o endereço [[MAC (Media Access Control)]]  que identifica o computador na  rede.

Portanto, quando um pacote é transmitido, é o **endereço MAC** que é usado para identificar o remetente. O MAC de destino também é identificado via [[ARP]] caso esteja na mesma rede.

Para concluir também é trabalho do enlace de dados apresentar os dados de maneira que seja adequada para transmissão.


---
## 3 - Rede (Network)
A camada de rede é onde acontece a magia de roteamento e remontagem de dados (desde o menor pacote até os grandes).

Primeiramente é definido a melhor rota onde os pacotes devem ser entregues. Para isso alguns protocolos nesta camada determinam qual é a "melhor rota". 

Protocolos como [[OSPF (Open Shortest Path First)]] e [[RIP (Routing Information Protocol)]] são utilizados para o critério da escolha da rota. Eles seguem os princípios como:
- Qual caminho mais curto? Ou seja, possui a menor quantidade de dispositivos que o pacote precisa atravessar.
- Qual caminho é o mais confiável? Os pacotes foram perdidos neste caminho antes?
- Qual caminho possui conexão física mais rápida? Este caminho utiliza conexão de cobre (lenta) ou fibra (rápida)?

Nesta camada tudo é tratado com endereços [[IP (Internet Protocol)]]

---
## 4 - Transporte (Transport)
...

---
## 5 - Sessão (Session)
Uma vez que os dados são traduzidos ou formatados pela camada de apresentação, a camada de sessão irá criar e manter a conexão para o outro computador no qual os dados são destinados.

Esta camada também é responsável por encerrar a conexão em caso da mesma não ser usada por algum tempo ou  se perder.

Ocasionalmente a sessão pode conter "checkpoints" se houver perda de dados, os dados mais recentes serão salvos e enviados como deveriam terem sido.

Vale ressaltar que cada sessão é única. Significa que os dados não pode trafegar em diferentes sessões, mas podem trafegar entre sessões.

---
## 6 - Apresentação (Presentation)
Esta camada é responsável por normalizar o tráfego de dados. Não importa qual client transmita o pacote, os dados precisam ser manuseados da mesma forma.

A camada de apresentação age como uma tradutora da e para a camada de aplicação. Portanto, o computador destino que está em um determinado formato irá entender os dados que foram enviados por outro computador em formato diferente.

Features de segurança como criptografia de dados (HTTPS, por exemplo) ocorrem nesta camada.

---
## 7 - Aplicação (Application)
A camada de aplicação é a mais familiar para nós. Basicamente ela age camada onde o usuário final irá utilizar o software.

Todo e qualquer software que utilize uma interface gráfica para enviar ou receber dados.