---
tags:
  - Fundamentos
  - Redes
---
O **TLS (Transport Layer Security)** é um protocolo de segurança projetado para garantir **privacidade** e **integridade** na comunicação entre sistemas, amplamente usado em **HTTPS**, **e-mails (SMTP/IMAP)**, **VPNs** e outros serviços que exigem criptografia. Ele substituiu o antigo **SSL (Secure Sockets Layer)** e opera entre as camadas de **transporte (TCP)** e **aplicação (HTTP, FTP, etc.)** no modelo OSI.

---

## **1. Objetivos do TLS**
- **Confidencialidade**: Criptografa os dados para evitar espionagem.
- **Integridade**: Detecta se os dados foram alterados em trânsito (via *hash*).
- **Autenticação**: Verifica a identidade do servidor (e opcionalmente do cliente) usando **certificados digitais**.

---

## **2. Como o TLS funciona?**
O TLS envolve duas fases principais:
1. **TLS Handshake** (Negociação segura usando criptografia assimétrica).
2. **Comunicação criptografada** (Usando criptografia simétrica para eficiência).

### **A. TLS Handshake (Exemplo em HTTPS)**
1. **Cliente Hello**  
   - O navegador envia:
     - Versões do TLS suportadas (ex: TLS 1.2, TLS 1.3).
     - Cipher suites suportadas (ex: `AES256-GCM-SHA384`).
     - Um número aleatório (*Client Random*).

2. **Servidor Hello**  
   - O servidor responde com:
     - A versão do TLS escolhida.
     - O cipher suite selecionado.
     - Seu **certificado digital** (contendo a chave pública).
     - Um número aleatório (*Server Random*).

3. **Verificação do Certificado**  
   - O cliente valida o certificado usando uma **Autoridade Certificadora (CA)** confiável (ex: Let's Encrypt, DigiCert).

4. **Troca de Chaves (Key Exchange)**  
   - O cliente gera um **Pre-Master Secret** (criptografado com a chave pública do servidor).
   - Ambos lados derivam a **chave de sessão simétrica** (usando *Client Random*, *Server Random* e *Pre-Master Secret*).

5. **Conclusão do Handshake**  
   - Ambos enviam uma mensagem **"Finished"** (criptografada) para confirmar que o handshake foi bem-sucedido.

### **B. Comunicação Criptografada**  
- A partir deste ponto, os dados são transmitidos usando **criptografia simétrica** (ex: AES) para melhor desempenho.

---

## **3. Componentes Principais**
| Componente               | Descrição                                                                 |
|--------------------------|--------------------------------------------------------------------------|
| **Certificado Digital**  | Assinado por uma CA, contém a chave pública e identidade do servidor.    |
| **Cipher Suites**        | Combina algoritmos para: troca de chaves, criptografia e integridade.     |
| **Chave Pública/Privada** | Usada no handshake (ex: RSA, ECDHE).                                   |
| **Chave de Sessão**      | Gerada durante o handshake (ex: AES-256).                                |

---

## **4. Algoritmos Usados no TLS**
| Função                  | Algoritmos Comuns (TLS 1.2/1.3)                                          |
|-------------------------|--------------------------------------------------------------------------|
| **Troca de Chaves**     | RSA, ECDHE, DH (Diffie-Hellman).                                         |
| **Criptografia**        | AES (GCM/CCM), ChaCha20-Poly1305 (TLS 1.3).                              |
| **Integridade**         | SHA-256, SHA-384 (HMAC).                                                 |
| **Curvas Elípticas**    | P-256, X25519 (para ECDHE).                                              |

---

## **5. TLS 1.2 vs. TLS 1.3**
| Característica          | TLS 1.2                          | TLS 1.3 (2018)                   |
|-------------------------|----------------------------------|----------------------------------|
| **Velocidade**          | 2-RTT (Round-Trip Time)         | 1-RTT (mais rápido).             |
| **Algoritmos**          | Suporta muitos (alguns inseguros). | Remove algoritmos obsoletos (ex: RSA, SHA-1). |
| **Forward Secrecy**     | Opcional (depende do cipher suite). | Obrigatório (sempre ativado).    |
| **Privacidade**         | SNI (Server Name Indication) em texto. | SNI criptografado (ESNI).        |

---

## **6. Exemplo de Handshake TLS 1.3 (Simplificado)**
1. **Cliente Hello**  
   - Envia cipher suites e *Client Random*.
   - Inclui uma **chave pública temporária** (para ECDHE).

2. **Servidor Hello**  
   - Escolhe um cipher suite.
   - Envia seu certificado e uma **chave pública temporária**.
   - Gera a **chave de sessão** e envia um **"Finished"**.

3. **Cliente Responde**  
   - Deriva a chave de sessão e envia **"Finished"**.

4. **Comunicação Segura**  
   - Dados trafegam com AES-256-GCM.

---

## **7. Vulnerabilidades e Mitigações**
- **POODLE**: Ataque em SSL 3.0 → Desative SSL.
- **BEAST**: Explora CBC no TLS 1.0 → Use TLS 1.2+.
- **Heartbleed**: Bug no OpenSSL → Atualize bibliotecas.
- **MITM**: Se o certificado for inválido → Sempre verifique CAs.

**Boas Práticas**:
- Use **TLS 1.2 ou 1.3**.
- Desative cipher suites fracos (ex: RC4, DES).
- Renove certificados regularmente.

---

## **8. Como Verificar uma Conexão TLS?**
- **Navegador**: Clique no 🔒 ao lado da URL → "Certificado".
- **OpenSSL** (Linux):
  ```sh
  openssl s_client -connect exemplo.com:443 -tls1_3
  ```
- **Wireshark**: Filtre por `tls.handshake`.

---

## **9. Conclusão**
O TLS é o padrão global para comunicações seguras na Internet, protegendo desde bancos online até APIs. Sua evolução (TLS 1.3) trouxe mais velocidade e segurança, eliminando vulnerabilidades antigas. 

Se precisar de **exemplos de configuração em servidores** (Apache, Nginx) ou **depuração de erros**, posso detalhar ainda mais!