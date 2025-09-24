---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
O **SSH (Secure Shell)** é um protocolo de rede criptografado utilizado para **acesso remoto seguro**, **execução de comandos** e **transferência de arquivos** entre dispositivos. Ele substitui protocolos inseguros como **Telnet**, **FTP** e **rsh**, garantindo confidencialidade e integridade dos dados.

---

## **1. Para que serve o SSH?**
- **Acesso remoto seguro** a servidores (Linux, routers, etc.).
- **Execução de comandos** remotamente.
- **Transferência de arquivos** (com `scp` ou `sftp`).
- **Tunelamento de portas** (redirecionamento seguro de tráfego).
- **Automação de tarefas** (via chaves públicas).

---

## **2. Como o SSH funciona?**
O SSH opera na **porta 22** (por padrão) e usa criptografia assimétrica e simétrica para estabelecer uma conexão segura. O processo envolve:

### **A. Estabelecimento da Conexão (Handshake)**
1. **Negociação da versão do SSH** (ex: SSH-2.0).
2. **Troca de chaves públicas** (autenticação do servidor).
   - O cliente verifica se o servidor é confiável (comparando com `~/.ssh/known_hosts`).
3. **Geração de uma chave de sessão simétrica** (usada para criptografar a comunicação).

### **B. Autenticação do Cliente**
- **Métodos comuns**:
  1. **Senha** (autenticação por credenciais).
  2. **Chave pública-privada** (mais seguro, sem senha).
     - O cliente envia uma assinatura criptográfica gerada com sua chave privada.
     - O servidor verifica usando a chave pública armazenada (`~/.ssh/authorized_keys`).

### **C. Comunicação Criptografada**
- Todos os dados são criptografados usando algoritmos como **AES** (simétrico) e protegidos contra adulteração com **HMAC**.

---

## **3. Principais Componentes do SSH**
| Componente          | Descrição                                                                 |
|---------------------|--------------------------------------------------------------------------|
| **ssh-client**      | Inicia a conexão (ex: `ssh user@servidor`).                              |
| **ssh-server**      | Recebe conexões (serviço `sshd`).                                        |
| **scp/sftp**        | Transferência segura de arquivos.                                        |
| **ssh-keygen**      | Gera pares de chaves (RSA, ECDSA, Ed25519).                              |
| **ssh-agent**       | Gerencia chaves privadas em memória (evita digitar senhas repetidamente).|

---

## **4. Tipos de Criptografia no SSH**
### **A. Criptografia Assimétrica (Handshake)**
- Usada para autenticação e troca de chaves.
  - **Algoritmos comuns**: RSA, ECDSA, Ed25519.
  - O servidor tem uma **chave privada** (`/etc/ssh/ssh_host_*_key`) e uma **chave pública** distribuída aos clientes.

### **B. Criptografia Simétrica (Sessão)**
- Usada para criptografar a comunicação após o handshake.
  - **Algoritmos comuns**: AES (128/256-bit), ChaCha20.

### **C. Hash para Integridade (HMAC)**
- Garante que os dados não foram alterados.
  - **Algoritmos comuns**: SHA-256, SHA-3.

---

## **5. Exemplo de Uso do SSH**
### **A. Conexão Básica**
```sh
ssh usuario@192.168.1.100
```
- Se for a primeira conexão, o cliente pede para confirmar a **chave pública do servidor**.

### **B. Autenticação por Chave Pública**
1. Gerar chaves no cliente:
   ```sh
   ssh-keygen -t ed25519
   ```
2. Copiar a chave pública para o servidor:
   ```sh
   ssh-copy-id usuario@192.168.1.100
   ```
3. Conectar sem senha:
   ```sh
   ssh usuario@192.168.1.100
   ```

### **C. Transferência de Arquivos com SCP**
```sh
scp arquivo.txt usuario@192.168.1.100:/home/usuario/
```

### **D. Tunelamento de Portas (Port Forwarding)**
- **Local Forwarding** (encaminha uma porta local para o servidor):
  ```sh
  ssh -L 8080:localhost:80 usuario@192.168.1.100
  ```
  (Acessar `localhost:8080` no cliente redireciona para a porta `80` do servidor.)

---

## **6. Arquivos de Configuração Importantes**
| Arquivo               | Descrição                                                                 |
|-----------------------|--------------------------------------------------------------------------|
| `~/.ssh/config`       | Configurações personalizadas para conexões SSH (ex: alias, portas).       |
| `~/.ssh/known_hosts`  | Armazena as chaves públicas de servidores confiáveis.                     |
| `~/.ssh/authorized_keys` | Chaves públicas permitidas para autenticação no servidor.              |
| `/etc/ssh/sshd_config` | Configuração do servidor SSH (ex: desativar login por senha).           |

---

## **7. Segurança do SSH**
### **A. Boas Práticas**
1. **Desativar login como `root`**:
   ```plaintext
   PermitRootLogin no
   ```
   (No `/etc/ssh/sshd_config`).

2. **Usar autenticação por chave** (em vez de senha):
   ```plaintext
   PasswordAuthentication no
   ```

3. **Alterar a porta padrão (22)**:
   ```plaintext
   Port 2222
   ```

4. **Limitar usuários permitidos**:
   ```plaintext
   AllowUsers usuario1 usuario2
   ```

### **B. Ataques Comuns**
- **Brute Force**: Tentativas de adivinhar senhas.
  - **Defesa**: Usar `fail2ban` para bloquear IPs maliciosos.
- **Man-in-the-Middle (MITM)**: Se o servidor não for autenticado corretamente.
  - **Defesa**: Sempre verificar a chave pública do servidor.

---

## **8. SSH vs. Alternativas**
| Protocolo    | Criptografia | Porta Padrão | Uso Principal                     |
|-------------|------------|------------|----------------------------------|
| **SSH**     | Sim (AES, RSA) | 22        | Acesso remoto seguro.             |
| **Telnet**  | Não         | 23        | Acesso remoto inseguro (obsoleto).|
| **RDP**     | Sim         | 3389      | Acesso gráfico remoto (Windows).  |

---

## **9. Conclusão**
O SSH é um protocolo essencial para administração remota segura, combinando **criptografia forte**, **autenticação flexível** e **recursos avançados** como tunelamento. Sua configuração adequada é crucial para evitar ataques.

Se quiser se aprofundar em **configurações avançadas** ou **solução de problemas**, posso fornecer exemplos mais detalhados!