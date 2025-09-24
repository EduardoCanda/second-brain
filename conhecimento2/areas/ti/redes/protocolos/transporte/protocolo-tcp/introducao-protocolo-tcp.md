---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
---
O **TCP (Transmission Control Protocol)** é o segundo principal protocolo da camada de transporte na [[Areas/TI/Redes/Protocolos/Pilha de Protocolos TCP/IP]], sendo o par do [[protocolo-udp]]. Diferentemente do UDP, o TCP foi projetado para oferecer **confiabilidade, controle de fluxo e ordenação de dados**, tornando-se ideal para aplicações que exigem segurança e integridade na transmissão, como **HTTPS, HTTP, FTP, SSH**, entre outros.

# 🔁 Comunicação Orientada à Conexão

Ao contrário do UDP, o TCP é um protocolo **orientado à conexão**, o que significa que ele precisa estabelecer uma **comunicação bidirecional (handshake)** antes de qualquer troca de dados. Uma vez estabelecida, a comunicação permanece **ativa e sincronizada entre as duas partes** até que a conexão seja encerrada formalmente.

# ✅ Confirmação de Recebimento e Retransmissão

Uma das principais características do TCP é seu mecanismo de **confirmação de recebimento**. Cada segmento enviado requer uma confirmação por parte do receptor. Caso a confirmação não ocorra dentro de um tempo determinado, o segmento pode ser **retransmitido automaticamente**, garantindo a entrega. Esse recurso aumenta significativamente a **confiabilidade da comunicação**, diferentemente do UDP, onde a perda de pacotes não é gerenciada nativamente.

# 📦 Ordenação e Reconstrução dos Dados

O TCP também garante que os dados sejam **reconstruídos na ordem correta** no destino. Isso é possível graças ao campo de **número de sequência** presente no cabeçalho TCP, que indica a posição exata do primeiro byte de cada segmento transmitido. Com isso, mesmo que os segmentos cheguem fora de ordem, o receptor consegue **reordená-los corretamente**.

Além disso, esse número de sequência é fundamental para os mecanismos de **controle de fluxo (Janela TCP)** e **confirmação de recebimento**, sendo parte essencial da lógica de **comunicação full-duplex** e da técnica de **[[fullduplex-piggybacking|Piggybacking]]**, onde os segmentos podem carregar simultaneamente dados e confirmações.

# Segue abaixo as principais características do protocolo TCP

[[cabecalho-tcp]]
[[conexao-tcp]]
[[confirmacao-recebimento]]
[[fullduplex-piggybacking]]
[[janela-deslizante-tcp]]
