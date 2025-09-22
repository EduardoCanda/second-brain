O ARP é um protocolo usado em redes IPv4 para mapear endereços lógicos (IP) em endereços físicos (MAC).
Ele trabalha na transição entre a Camada 3 (Rede) e a Camada 2 (Enlace) do [[Modelo OSI]].

Em outras palavras:
    Quando um computador precisa enviar um pacote para um IP na mesma rede local, ele usa o ARP para descobrir qual é o endereço MAC correspondente a esse IP.

🔎 Como funciona o ARP (passo a passo)

1️⃣ Consulta ARP (ARP Request)
O host que quer enviar um pacote faz um broadcast na rede local:

“Quem tem o IP 192.168.0.10? Responda com seu MAC!”

2️⃣ Resposta ARP (ARP Reply)
O host dono do IP 192.168.0.10 responde diretamente ao solicitante:

“Eu tenho esse IP, meu MAC é AA:BB:CC:DD:EE:FF.”

3️⃣ Atualização da Tabela ARP
O host que fez a pergunta grava essa informação em sua tabela ARP (cache), para não precisar perguntar novamente por um tempo.

⸻

📋 Tabela ARP

A tabela ARP contém pares de IP → MAC armazenados temporariamente no host.
Você pode ver a tabela ARP no seu sistema:
	•	Windows: arp -a
	•	Linux/Mac: ip neigh ou arp -n

⸻

🧠 Pontos importantes
	•	O ARP só funciona em redes locais (LAN) → se o IP de destino está em outra rede, o ARP resolve o MAC do gateway (roteador), e não do host final.
	•	Para IPv6, o ARP foi substituído pelo NDP (Neighbor Discovery Protocol).
	•	ARP é stateless → se um host muda de MAC, ele simplesmente envia uma atualização (gratuitous ARP) para que todos atualizem suas tabelas.

⸻

⚠️ Segurança

O ARP não tem autenticação → isso permite ataques como ARP Spoofing, em que um invasor envia respostas falsas, fazendo com que o tráfego seja redirecionado para ele (ataque Man-in-the-Middle).

⸻

🧩 Resumo rápido (para revisão)
	•	O que faz: Resolve IP em MAC.
	•	Camadas envolvidas: Rede (IP) → Enlace (MAC).
	•	Tipo de tráfego: ARP Request (broadcast) + ARP Reply (unicast).
	•	Importância: Essencial para comunicação dentro da LAN.
