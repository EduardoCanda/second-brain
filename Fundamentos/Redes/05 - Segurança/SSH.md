SSH (Secure Shell) é um protocolo de rede que permite comunicação segura entre dois dispositivos.
Ele é usado principalmente para acesso remoto a servidores e transferência segura de arquivos.

---
🧩 Características Principais
	•	Criptografia ponta a ponta: Protege os dados contra espionagem durante o tráfego.
	•	Autenticação: Pode usar senha ou chave pública/privada.
	•	Integridade: Garante que os dados não sejam alterados no caminho.
	•	Confidencialidade: Ninguém além do cliente e servidor consegue ler o tráfego.

---
🔐 Componentes do SSH
	•	Servidor SSH: Software rodando no host remoto (ex.: sshd no Linux).
	•	Cliente SSH: Programa usado para conectar ao servidor (ex.: ssh no terminal).
	•	Porta padrão: TCP 22.

---
⚙️ Funcionamento Básico
	1.	O cliente inicia a conexão ao servidor na porta 22.
	2.	O servidor envia sua chave pública para o cliente.
	3.	O cliente e o servidor negociam a sessão criptografada.
	4.	O cliente se autentica (senha ou chave privada).
	5.	Uma vez autenticado, o cliente tem acesso ao terminal remoto de forma segura.

Comandos Comuns
# Conexão a um servidor remoto
ssh usuario@ip_do_servidor

# Conexão usando chave privada
ssh -i ~/.ssh/minha_chave usuario@servidor

# Copiar arquivos com SCP (sobre SSH)
scp arquivo.txt usuario@servidor:/caminho/destino

🔑 Autenticação por Chave
	•	Chave Privada: Guardada no cliente, nunca deve ser compartilhada.
	•	Chave Pública: Copiada para o servidor (em ~/.ssh/authorized_keys).
	•	Permite autenticação sem senha (mais segura).

---

🧠 Quando Usar
	•	Administração remota de servidores.
	•	Transferência de arquivos de forma segura (via SCP ou SFTP).
	•	Tunelamento e encaminhamento seguro de portas.

---

🔗 Notas Relacionadas
	•	[[TCP]] – SSH funciona sobre TCP.
	•	[[Criptografia Assimétrica]] – usada para autenticação.
	•	[[Portas Mais Conhecidas]] – SSH usa a porta 22.
