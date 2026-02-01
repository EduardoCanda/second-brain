**Transport Layer Secutrity (TLS)** é um protocolo de segurança de criptografia, usado para proteger a comunicação entre duas partes da rede. Este protocolo garante:
- Confidencialidade;
- Integridade;
- Auntenticação;

O protocolo opera acima do [[TCP]] e abaixo dos protocolos de aplicação (HTTP, SMTP, IMAP).
Na camada OSI, o TLS é frequentemente associaco á camada 6 (apresentação), embora na prática seja tratado como parte da pilha de aplicação.


## TLS Handshake:
Antes de trafegar dados, o cliente e servidor realizam um **handshake TLS** para negociar segurança.

####  Quem inicia o TLS Handshake?
**Sempre o CLIENTE**

Exemplos de cliente:
- Navegador (Chrome, Firefox)
- `curl`
- `wget`
- Um app mobile
- Um serviço backend

O **servidor nunca inicia** o handshake TLS por conta própria.


#### Por que o handshake existe?

Para responder 3 perguntas críticas:
1. Quem é o servidor? (autenticação)
2. Como vamos criptografar? (algoritmos)
3. Qual chave vamos usar? (chave de sessão)

Sem handshake, não existe comunicação segura.

#### Passo a passo simplificado:

**1 - ClientHello**
- Versão TLS suportada
- Cipher suites
- Random do cliente

**2 - ServerHello**
- Cipher suite escolhida
- Certificado digital
- Random do servidor

**3 - Validação do certificado**
- Cliente verifica:
	- Autoridade certificadora (CA)
	- Validade
	- Domínio
		
**4 - Troca de chaves**
- Geração de chave de sessão simétrica

**5 - Handshake finalizado**
- Comunicação segura começa
```
CLIENTE                          SERVIDOR
  |                                  |
  | --- TCP Handshake -------------->|
  |                                  |
  | --- ClientHello ---------------->|
  |                                  |
  | <--- ServerHello + Certificado --|
  |                                  |
  | --- Validação do Certificado --->|
  |                                  |
  | --- Troca de Chaves ------------>|
  |                                  |
  | --- Finished ------------------->|
  | <--- Finished -------------------|
  |                                  |
  | === Comunicação Criptografada ===|

```

# Importante entender
-  TLS NÃO é automático
-  TLS não começa com o servidor
-  TLS sempre vem depois do TCP
-  TLS não criptografa a conexão inteira, só **após o handshake**
