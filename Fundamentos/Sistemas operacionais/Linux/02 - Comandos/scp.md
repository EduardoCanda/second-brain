SCP ou Secure Copy utiliza a autenticação e criptografia do protocolo [[SSH]] para copiar arquivos. 

Trabalha no modelo remente e destinatário, permitindo:
-  Copiar arquivos e diretórios da máquina atual para um servidor remoto
-  Copiar arquivos e diretórios do servidor remoto para a máquina atual.

---
## Exemplos práticos:

### Máquina atual -> servidor remoto:
	scp important.txt ubuntu@192.168.1.30:/home/ubuntu/transferred.txt

### Servidor remoto -> máquina atual
	scp ubuntu@192.168.1.30:/home/ubuntu/documents.txt notes.txt 
	