O DNS funciona como a “agenda telefônica” da Internet.
Ele traduz nomes de domínio legíveis por humanos (como www.google.com) em endereços IP (como 142.250.217.4) que os computadores usam para se comunicar.

⸻

🔄 Funcionamento da Consulta DNS (Passo a Passo)

Quando você digita www.google.com no navegador:

1️⃣ Verificação local
O sistema operacional verifica se já tem o IP armazenado em:
	•	Cache do navegador
	•	Cache do sistema operacional
	•	Arquivo hosts (se configurado)

Se encontrar, não precisa fazer consulta externa.

⸻

2️⃣ Consulta ao DNS Recursivo (Resolver)
Se o IP não está no cache, seu computador pergunta ao DNS Recursivo (geralmente do seu provedor de internet ou de serviços como 8.8.8.8 do Google):

“Qual é o IP de www.google.com?”

⸻

3️⃣ Consulta ao Servidor Raiz (Root)
O DNS Recursivo pergunta aos Servidores Raiz:

“Quem sabe onde está o domínio .com?”

Os servidores raiz respondem com o endereço dos TLD Servers responsáveis por .com.

⸻

4️⃣ Consulta ao Servidor TLD (.com)
O DNS Recursivo pergunta ao TLD Server de .com:

“Quem sabe onde está google.com?”

O TLD Server responde com o endereço dos servidores autoritativos para google.com.

⸻

5️⃣ Consulta ao Servidor Autoritativo
O DNS Recursivo pergunta ao servidor autoritativo:

“Qual é o IP de www.google.com?”

Ele responde com o IP correto (ex.: 142.250.217.4).

⸻

6️⃣ Resposta ao Cliente + Cache
O DNS Recursivo envia a resposta para seu computador e armazena no cache (por um tempo definido no campo TTL – Time To Live) para consultas futuras.

⸻

🧠 Tipos de Registro DNS Comuns

---

🧩 Resumo Rápido
	•	Camada: Aplicação (OSI 7)
	•	Função: Traduz nomes → IPs
	•	Consulta: Pode ser recursiva ou iterativa
	•	Cache: Reduz tempo de resolução e tráfego de rede
