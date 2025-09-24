---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
# **PKI (Public Key Infrastructure) - Infraestrutura de Chave Pública**

A **PKI (Public Key Infrastructure)** é um sistema que gerencia **[[certificado-digital|certificados digitais]]**, **chaves públicas/privadas** e **autoridades de certificação (CAs)** para garantir **autenticação**, **criptografia** e **integridade de dados** em comunicações digitais.

---

## **Para Que Serve a PKI?**
1. **Autenticação** → Verificar a identidade de usuários, servidores ou dispositivos.
2. **Criptografia** → Proteger dados em trânsito (ex: [[protocolo-https]], VPNs, e-mails).
3. **Assinatura Digital** → Garantir que documentos não foram alterados (não-repúdio).

---

## **Componentes Principais da PKI**
| Componente                                    | Função                                                      |
| --------------------------------------------- | ----------------------------------------------------------- |
| **CA (Certificate Authority)**                | Emite e gerencia certificados (ex: DigiCert, Let's Encrypt) |
| **RA (Registration Authority)**               | Valida identidades antes da emissão de certificados         |
| **Certificados Digitais**                     | Vinculam chaves públicas a identidades (ex: `.crt`, `.pem`) |
| **[[crl]] (Certificate Revocation List)**     | Lista de certificados revogados antes do vencimento         |
| **OCSP (Online Certificate Status Protocol)** | Verifica em tempo real se um certificado é válido           |
| **Repositório de Certificados**               | Armazena certificados públicos (ex: LDAP, bancos de dados)  |

---

## **Como a PKI Funciona? (Exemplo: HTTPS)**
1. **Servidor** tem um **certificado SSL** (emitido por uma CA confiável).
2. **Navegador** verifica:
   - Se o certificado foi emitido por uma **CA raiz confiável**.
   - Se o certificado **não está revogado** (via [[crl]] ou OCSP).
   - Se o **nome do domínio** corresponde ao certificado.
3. Se tudo estiver OK, a conexão **HTTPS segura** é estabelecida.

---

## **Tipos de PKI**
1. **PKI Pública** (ex: Internet)
   - Usa CAs públicas (Let's Encrypt, DigiCert).
   - Certificados reconhecidos globalmente.

2. **PKI Privada** (ex: Empresas, Governo)
   - CAs internas (Microsoft AD CS, OpenSSL CA).
   - Usada em redes corporativas, VPNs, assinatura de documentos.

---

## **Aplicações da PKI**
✔ **SSL/TLS** (HTTPS para sites seguros)  
✔ **S/MIME** (e-mails criptografados)  
✔ **VPNs** (Autenticação via certificados)  
✔ **Assinatura Digital** (Documentos PDF, transações)  
✔ **IoT** (Autenticação de dispositivos)  

---

## **PKI vs. [[criptografia-simetrica]]**
| PKI ([[criptografia-assimetrica]])                | Criptografia Simétrica                                    |
| ------------------------------------------------- | --------------------------------------------------------- |
| Usa **par de chaves** (pública/privada)           | Usa **uma única chave**                                   |
| Ideal para **autenticação** e **troca de chaves** | Mais rápida, usada em **criptografia de dados** (ex: AES) |
| Exemplo: **RSA, ECC**                             | Exemplo: **AES, 3DES**                                    |

---

### **Resumo**
- A **PKI é a base da segurança digital**, permitindo **confiança** em transações online.
- Envolve **CAs, certificados, chaves e mecanismos de validação**.
- Usada em **SSL, VPNs, e-mails seguros, blockchain e muito mais**.