O **UDP** é um protocolo da **camada de transporte** do modelo OSI e do conjunto TCP/IP.  
Ele é considerado um protocolo **não orientado à conexão** e **não confiável**, pois não garante a entrega, a ordem ou a integridade dos pacotes transmitidos.  

Apesar disso, é amplamente utilizado em aplicações que priorizam **velocidade e baixo overhead** em vez de confiabilidade.

---

## Características do UDP
- **Sem conexão**: não há estabelecimento de conexão entre cliente e servidor.  
- **Sem controle de fluxo**: não garante que o receptor consiga lidar com a taxa de dados enviada.  
- **Sem confirmação de entrega**: não há ACK (acknowledgment) como no TCP.  
- **Pacotes independentes**: cada datagrama é tratado de forma autônoma.  
- **Mais rápido que TCP**: menor latência, já que não há verificação ou retransmissão.  

---

## Estrutura do Segmento UDP
O cabeçalho do UDP é simples, com apenas 8 bytes, dividido em:  
- **Porta de origem** (16 bits)  
- **Porta de destino** (16 bits)  
- **Tamanho** (16 bits)  
- **Checksum** (16 bits) – usado para verificação básica de erros  

---

## Casos de Uso do UDP
- **Streaming de áudio e vídeo** (YouTube, Spotify, Netflix).  
- **Chamadas VoIP** (WhatsApp, Skype, Zoom).  
- **Jogos online** (baixa latência é essencial).  
- **Protocolos como DNS e DHCP**, que precisam de respostas rápidas.  

---

## Comparação com TCP
- **TCP**: confiável, garante ordem, possui controle de fluxo → mais lento.  
- **UDP**: não confiável, sem garantia de ordem, sem controle de fluxo → mais rápido.  

---

## Notas Relacionadas
- [[Camada 4 Transporte]]  
- [[TCP]]  
- [[Overview]]  
- [[DHCP]]
