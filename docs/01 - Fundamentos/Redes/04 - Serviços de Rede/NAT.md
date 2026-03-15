NAT - Network Address Translation

O NAT (Tradução de Endereços de Rede) é um recurso da [Camada 3 Rede](../01 - Modelo OSI/Camadas/Camada 3 Rede.md) utilizado para mapear endereços IP privados em endereços IP públicos (e vice-versa).

Ele foi criado principalmente para economizar o uso de endereços IPv4 públicos, permitindo que redes privadas inteiras se conectem à Internet usando apenas um ou poucos endereços públicos.

---

🧩 Funções do NAT
	•	Traduzir endereços IP privados (não roteáveis na Internet) em endereços IP públicos.
	•	Ocultar a topologia da rede interna, funcionando como uma camada de segurança.
	•	Permitir que múltiplos dispositivos compartilhem um único IP público.

---

🔑 Tipos de NAT
	1.	Static NAT (1:1)
	•	Mapeia um IP privado fixo para um IP público específico.
	•	Exemplo: Servidor interno sempre acessado pelo mesmo IP público.
	2.	Dynamic NAT
	•	Um conjunto de IPs privados é mapeado dinamicamente para um conjunto de IPs públicos disponíveis.
	•	Mais flexível que o estático, mas limitado pela quantidade de IPs públicos.
	3.	PAT (Port Address Translation) – também chamado de NAT Overload
	•	Vários IPs privados compartilham um único IP público, diferenciando as conexões pelas portas.
	•	É o tipo mais usado em roteadores domésticos.
	•	Exemplo: 192.168.0.10:5023 → 187.22.15.7:40001

---

📊 Vantagens
	•	Economia de endereços IPv4.
	•	Adiciona uma camada de segurança (IPs internos não ficam visíveis).
	•	Flexibilidade na configuração de redes internas.

---

⚠️ Desvantagens
	•	Pode causar problemas em aplicações que exigem conexões diretas (VoIP, jogos online, P2P).
	•	Aumenta a complexidade na tradução de endereços e portas.
	•	Quebra o modelo end-to-end da Internet.

---

⚙️ Exemplo Prático

Rede interna:
	•	PC1 → 192.168.0.2
	•	PC2 → 192.168.0.3

IP público do roteador: 200.100.50.10
	•	Quando o PC1 acessa www.google.com, o roteador traduz:
	•	Origem (PC1): 192.168.0.2:54000 → 200.100.50.10:40001
	•	Quando o PC2 acessa o mesmo site:
	•	Origem (PC2): 192.168.0.3:54001 → 200.100.50.10:40002

O servidor na Internet só vê o IP 200.100.50.10, mas diferencia as conexões pelas portas.
