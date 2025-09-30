A Camada de Transporte é a quarta camada do [[Modelo OSI]] e tem como principal função garantir a entrega confiável e ordenada dos dados entre aplicações em diferentes dispositivos.

Ela atua como um intermediário entre a Camada de Rede e a Camada de Aplicação, cuidando de como os dados serão entregues, e não apenas para onde.

⸻

🧩 Funções Principais
	•	Segmentação e Reassembly: Divide mensagens grandes em segmentos menores e garante que eles sejam remontados corretamente no destino.
	•	Controle de Fluxo: Evita que um emissor rápido sobrecarregue um receptor mais lento.
	•	Controle de Erros: Detecta e retransmite segmentos corrompidos ou perdidos.
	•	Multiplexação/Demultiplexação: Permite que múltiplas aplicações compartilhem a mesma conexão de rede (identificação via portas).

⸻

🔑 Protocolos Importantes
	•	[[TCP (Transmission Control Protocol)]]
	•	Confiável (usa confirmação de recebimento - ACK).
	•	Conexão orientada (usa handshake de 3 vias).
	•	Garante ordem dos pacotes.
	•	Exemplo de uso: HTTP, HTTPS, SSH, FTP.
	•	[[UDP (User Datagram Protocol)]]
	•	Não confiável (sem ACK ou retransmissão).
	•	Sem conexão, mais rápido e leve.
	•	Útil em aplicações em tempo real.
	•	Exemplo de uso: DNS, VoIP, streaming.

⸻

📊 Identificação (Portas)
	•	Cada aplicação que usa a camada de transporte é identificada por um número de porta.
	•	Tipos de portas:
	•	Bem conhecidas (0–1023): usadas por serviços padrão (ex.: 80 = HTTP, 22 = SSH).
	•	Registradas (1024–49151): atribuídas a aplicações específicas.
	•	Dinâmicas/Privadas (49152–65535): usadas temporariamente por clientes.

⸻

⚙️ Exemplo de Funcionamento
	1.	Um cliente abre uma conexão TCP com um servidor web na porta 80.
	2.	A Camada de Transporte do cliente gera um número de porta temporário (ex.: 50231) para identificar sua aplicação.
	3.	O servidor recebe o pedido na porta 80 e envia a resposta de volta para a porta 50231 do cliente.
	4.	A Camada de Transporte garante que a mensagem chegue completa e ordenada à aplicação.