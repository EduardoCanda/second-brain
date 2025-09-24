---
tags:
  - Fundamentos
  - Segurança
---
Os **pilares da segurança da informação** são princípios fundamentais que garantem a proteção de dados e sistemas. Os três principais são **confidencialidade, integridade e [[autenticacao-autorizacao|autenticação]]**, mas outros pilares complementares (como **não-repúdio** e **disponibilidade**) também são essenciais. Vamos detalhar cada um:

---

## **1. Confidencialidade**  
**Definição**: Garantir que apenas **pessoas/autorizados** acessem informações sensíveis.  
**Como é implementado?**  
- **Criptografia** (ex: AES no [[protocolo-tls|TLS]], PGP em e-mails).  
- **Controle de acesso** (senhas, biometria, IAM).  
- **Mascaramento de dados** (ex: substituir dígitos de CPF por `***`).  

**Exemplos práticos**:  
- Um e-mail criptografado com **S/MIME**.  
- Um banco de dados médico com acesso restrito a médicos.  

---

## **2. Integridade**  
**Definição**: Garantir que os dados **não sejam alterados** de forma não autorizada.  
**Como é implementado?**  
- **Assinaturas digitais** (ex: RSA, ECDSA).  
- **Funções de *hash*** (ex: SHA-256 para verificar arquivos).  
- **Mecanismos de checksum** (ex: CRC, HMAC).  

**Exemplos práticos**:  
- Verificar se um arquivo baixado da internet tem o mesmo *hash* do original.  
- Blockchain (cada bloco contém o *hash* do anterior).  

---

## **3. Autenticação**  
**Definição**: Confirmar a **identidade** de um usuário, sistema ou dispositivo.  
**Como é implementado?**  
- **Senhas** (fator único).  
- **Certificados digitais** (ex: TLS, SSH com chaves públicas).  
- **Biometria** (impressão digital, reconhecimento facial).  
- **Multi-Fator (MFA)** (ex: SMS + token).  

**Exemplos práticos**:  
- Login no GitHub usando **SSH Key**.  
- Um cartão de banco com chip + PIN.  

---

## **4. Pilares Complementares**  

### **A. Não-Repúdio**  
**Definição**: Impedir que alguém negue a autoria de uma ação (ex: envio de um contrato).  
**Implementação**:  
- **Assinaturas digitais** (ex: DocuSign).  
- **Logs auditáveis** (registros com carimbo de tempo).  

### **B. Disponibilidade**  
**Definição**: Garantir que sistemas e dados estejam **acessíveis** quando necessário.  
**Implementação**:  
- **Redundância** (servidores em *failover*).  
- **Proteção contra DDoS** (ex: Cloudflare).  

### **C. Auditoria**  
**Definição**: Rastrear quem acessou/quando/onde (para investigações).  
**Implementação**:  
- **Logs de acesso** (ex: SIEM como Splunk).  

---

## **5. Como os Protocolos Aplicam Esses Pilares?**  
| Protocolo  | Confidencialidade | Integridade | Autenticação | Não-Repúdio |  
|------------|------------------|-------------|--------------|-------------|  
| **TLS**    | ✅ AES-256        | ✅ SHA-256   | ✅ Certificados | ❌ (a menos que use assinatura cliente). |  
| **SSH**    | ✅ ChaCha20       | ✅ HMAC      | ✅ Chaves Públicas | ❌ |  
| **PGP**    | ✅ RSA/AES        | ✅ SHA-512   | ✅ Certificados | ✅ Assinaturas digitais. |  
| **Blockchain** | ❌ (dados públicos) | ✅ *Hash* + Consenso | ✅ Chaves Privadas | ✅ |  

---

## **6. Ataques que Violam Cada Pilar**  
- **Confidencialidade**: *Man-in-the-Middle* (MITM) em redes Wi-Fi não criptografadas.  
- **Integridade**: Injeção de malware em um arquivo para alterar seu conteúdo.  
- **Autenticação**: *Phishing* para roubar credenciais.  
- **Não-Repúdio**: Alguém negar que enviou um e-mail (sem assinatura digital).  
- **Disponibilidade**: Ataque DDoS derrubando um servidor.  

---

## **7. Boas Práticas para Garantir os Pilares**  
1. **Criptografe dados em repouso/trânsito** (ex: TLS, BitLocker).  
2. **Use MFA** (Autenticação Multi-Fator).  
3. **Assine digitalmente** documentos críticos.  
4. **Monitore logs** para detectar violações.  
5. **Faça backups** (para disponibilidade).  

---

## **8. Conclusão**  
Esses pilares são a base de **qualquer sistema seguro**. Por exemplo:  
- Um **site HTTPS** usa TLS para **confidencialidade** (criptografia), **integridade** (HMAC) e **autenticação** (certificado).  
- Um **smart contract** em blockchain depende de **integridade** e **não-repúdio**.  

Se precisar de exemplos específicos (ex: como implementar autenticação em APIs), posso detalhar!