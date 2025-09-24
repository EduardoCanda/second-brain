---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
O **HTTPS (HyperText Transfer Protocol Secure)** é uma versão segura do HTTP que combina **criptografia** ([[protocolo-tls|TLS/SSL]]) com o protocolo de transferência de dados da web. Ele garante **confidencialidade**, **integridade** e **autenticação** entre o cliente (navegador) e o servidor (site). Vamos detalhar seu funcionamento passo a passo:

---

## **1. Componentes do HTTPS**
| Componente              | Função                                                                          |
| ----------------------- | ------------------------------------------------------------------------------- |
| **HTTP**                | Protocolo de transferência de hipertexto (não criptografado).                   |
| **TLS/SSL**             | Adiciona criptografia, autenticação e integridade (TLS substitui SSL).          |
| **Certificado Digital** | Assinado por uma Autoridade Certificadora (CA), prova a identidade do servidor. |

---

## **2. Como o HTTPS Funciona? (Passo a Passo)**
O HTTPS opera em duas fases principais:
1. **Handshake TLS** (Negociação segura usando criptografia assimétrica).
2. **Comunicação criptografada** (Usando criptografia simétrica para eficiência).

### **A. Handshake TLS (Estabelecimento da Conexão Segura)**
Quando você acessa `https://exemplo.com`, ocorre o seguinte processo:

#### **Passo 1: Cliente Hello**
- O navegador envia ao servidor:
  - Versões do TLS suportadas (ex: TLS 1.2 ou 1.3).
  - **Cipher suites** suportadas (ex: `AES256-GCM-SHA384`).
  - Um número aleatório (**Client Random**).

#### **Passo 2: Servidor Hello**
- O servidor responde com:
  - A versão do TLS escolhida.
  - O **cipher suite** selecionado.
  - Seu **certificado digital** (contendo a chave pública).
  - Um número aleatório (**Server Random**).

#### **Passo 3: Verificação do Certificado**
- O navegador verifica:
  - Se o certificado é válido e assinado por uma **CA confiável** (ex: Let's Encrypt, DigiCert).
  - Se o domínio (`exemplo.com`) corresponde ao certificado.
  - Se o certificado não está expirado ou revogado.

#### **Passo 4: Troca de Chaves (Key Exchange)**
- O navegador gera um **Pre-Master Secret**:
  - Criptografado com a **chave pública** do servidor (do certificado).
  - Enviado apenas ao servidor (que decifra com sua **chave privada**).
- Ambos derivam a **chave de sessão simétrica** (usando `Client Random`, `Server Random` e `Pre-Master Secret`).

#### **Passo 5: Conclusão do Handshake**
- Cliente e servidor trocam mensagens **"Finished"** (criptografadas) para confirmar que o handshake foi bem-sucedido.

### **B. Comunicação Criptografada**
- A partir deste ponto, os dados são transmitidos usando **criptografia simétrica** (ex: AES-256) para melhor desempenho.
- Cada pacote é protegido contra adulteração com **HMAC** (Hash-based Message Authentication Code).

---

## **3. Detalhes Técnicos do Handshake (TLS 1.2 vs. TLS 1.3)**
| **Etapa**               | **TLS 1.2**                          | **TLS 1.3** (Mais Rápido e Seguro)         |
|-------------------------|--------------------------------------|--------------------------------------------|
| **Número de Round-Trips (RTTs)** | 2 RTTs (mais lento).           | 1 RTT (otimizado com "Zero-RTT" opcional). |
| **Algoritmos Suportados** | Permite algoritmos inseguros (ex: SHA-1, RSA). | Remove algoritmos obsoletos (só ECDHE, AES-GCM, etc.). |
| **Forward Secrecy**      | Opcional (depende do cipher suite).  | Obrigatório (sempre ativado).              |

---

## **4. Certificados Digitais no HTTPS**
- **Estrutura de um Certificado**:
  - **Domínio** (Common Name ou SANs).
  - **Chave pública** do servidor.
  - **Assinatura digital** da CA.
  - **Validade** (ex: 1 ano).
- **Tipos de Certificados**:
  - **DV (Domain Validation)**: Verifica apenas o domínio (mais barato).
  - **OV (Organization Validation)**: Verifica a organização por trás do domínio.
  - **EV (Extended Validation)**: Validação rigorosa (ex: exibe nome da empresa na barra de endereço).

---

## **5. Exemplo de uma Conexão HTTPS**
### **Capturando com OpenSSL (Linux/macOS)**
```sh
openssl s_client -connect exemplo.com:443 -servername exemplo.com -tls1_2
```
- Mostra detalhes do certificado, cipher suite e handshake.

### **Mensagem de Handshake TLS 1.2 (Simplificada)**
```plaintext
Client Hello:
  TLS Version: TLS 1.2
  Cipher Suites: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  Random: 5F3A...B2C1

Server Hello:
  TLS Version: TLS 1.2
  Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  Certificate: [Certificado de exemplo.com]
  Random: A1B2...C3D4

Key Exchange:
  Client Key Exchange (Pre-Master Secret criptografado)
  Change Cipher Spec (Ativa criptografia simétrica)

Encrypted Data:
  Dados trafegados via AES-256-GCM.
```

---

## **6. Vulnerabilidades e Mitigações**
- **Man-in-the-Middle (MITM)**:
  - **Defesa**: Certificados válidos e HSTS (HTTP Strict Transport Security).
- **Heartbleed (Bug no OpenSSL)**:
  - **Defesa**: Atualizar para OpenSSL > 1.0.1g.
- **Downgrade Attacks**:
  - **Defesa**: Desativar TLS 1.0/1.1 e usar TLS 1.2+.

---

## **7. Como Verificar uma Conexão HTTPS?**
- **Navegador**:
  - Clique no **🔒** na barra de URL → "Certificado".
  - Códigos de status:
    - **🔒 Verde**: EV Certificate.
    - **🔒 Cinza**: DV/OV Certificate.
    - **⚠️ Vermelho**: Certificado inválido ou conexão não criptografada.

- **Ferramentas Online**:
  - [SSL Labs Test](https://www.ssllabs.com/ssltest/) (analisa configuração TLS do servidor).

---

## **8. Conclusão**
O HTTPS é essencial para segurança na web, garantindo:
- **Criptografia**: Dados protegidos contra espionagem.
- **Autenticação**: Confirma que você está conectado ao site real.
- **Integridade**: Dados não são alterados em trânsito.

Se quiser se aprofundar em **configurações de servidores web** (Apache/Nginx) ou **depuração de erros comuns**, posso fornecer exemplos práticos!