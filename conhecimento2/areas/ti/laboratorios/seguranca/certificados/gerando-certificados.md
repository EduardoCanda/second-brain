---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
categoria: criptografia
ferramenta: openssl
---
# **Entendendo a Emissão de Novos Certificados com sua CA**

Não, você **não pode gerar novos certificados válidos apenas com seu certificado e chave privada recebidos de uma [[autoridade-certificadora|CA externa]]**. Vamos esclarecer como isso funciona na prática:

---

## **1. Hierarquia de Certificação (Quem Pode Emitir?)**
- **[[autoridade-certificadora-raiz|CA Raiz]]** (ex: DigiCert, Let's Encrypt) → Emite para **CAs Intermediárias**.
- **CA Intermediária** → Emite para **usuários finais** (seu certificado).
- **Seu [[certificado-digital|Certificado]]** → **Não pode emitir outros certificados**, a menos que seja explicitamente uma CA.

Se você recebeu apenas um certificado de servidor (ex: `meusite.com.crt` + `meusite.com.key`), ele **não tem permissão para assinar outros certificados**.

---

## **2. Quando Você Pode Gerar Novos Certificados?**
Apenas se:
### **Caso 1: Você é uma CA (Autoridade Certificadora)**
- Seu certificado tem a extensão **[[constraints-certificados|Basic Constraints]]: CA=TRUE**.
- Isso é comum em:
  - PKIs corporativas (ex: Microsoft AD CS).
  - CAs internas (ex: OpenSSL CA autoassinada).

**Como verificar se seu certificado é uma CA:**
```bash
openssl x509 -in seu_certificado.crt -text -noout | grep "CA:"
```
- Se mostrar `CA:TRUE`, você pode emitir certificados.
- Se mostrar `CA:FALSE` (ou não existir), **não pode**.

### **Caso 2: Você Tem uma CA Própria**
Se você criou uma CA raiz/intermediária (ex: com OpenSSL), aí sim pode usar:
- **`ca.key`** (chave privada da CA) + **`ca.crt`** (certificado da CA) para assinar novos certificados.

---

## **3. Processo de Emissão de Certificados (Se Você for uma CA)**
1. **Receber um CSR (Certificate Signing Request)**:
   ```bash
   openssl req -new -newkey rsa:2048 -nodes -keyout cliente.key -out cliente.csr
   ```
2. **Assinar com sua CA**:
   ```bash
   openssl x509 -req -in cliente.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out cliente.crt -days 90
   ```
3. **Entregar ao solicitante**:
   - `cliente.crt` (certificado) + `ca.crt` (cadeia de confiança).

---

## **4. Por Que Seu Certificado "Normal" Não Pode Emitir Outros?**
- **Falta de permissões**: CAs públicas (como Let's Encrypt) **não dão** a usuários finais a capacidade de emitir certificados.
- **Segurança**: Se qualquer um pudesse emitir certificados válidos, a PKI global quebraria.
- **Controle**: CAs comerciais auditam quem recebe certificados.

---

## **5. Exemplo Prático (Linkerd)**
Se você configurou o Linkerd com:
- **`identityTrustAnchorsPEM`**: `ca.crt` (sua CA raiz).
- **`crtPEM` + `keyPEM`**: Certificado e chave do **Issuer** (que é uma CA intermediária).

O Linkerd **só pode emitir certificados para proxies** porque:
- O Issuer tem `CA:TRUE` (é uma CA controlada pelo Linkerd).
- A CA raiz (`ca.crt`) está configurada como fonte de confiança.

---

## **6. Pergunta Chave: "Isso é uma Fábrica Infinita de Certificados?"**
- **Se você é uma CA**: Sim, pode emitir quantos certificados quiser (até a expiração da CA).
- **Se você tem um certificado comum**: Não, você só pode usá-lo para seu propósito específico (ex: HTTPS em `meusite.com`).

---

## **7. Riscos de Usar uma CA Improvisada**
Se você autoassinou uma CA e a usou para emitir certificados:
- **Navegadores/sistemas não confiarão** nesses certificados (a menos que você instale sua CA manualmente em todos os dispositivos).
- **Quebra da segurança**: Se sua CA for comprometida, todos os certificados emitidos por ela ficam vulneráveis.

---

## **Fluxograma: Quem Pode Emitir Certificados?**
```mermaid
graph TD
    A[CA Raiz (ex: DigiCert)] -->|Emite para| B[CA Intermediária]
    B -->|Emite para| C[Certificado de Servidor (ex: meusite.com)]
    C -->|NÃO PODE EMITIR| D[Novos Certificados]
    B -->|PODE EMITIR| E[Certificados de Clientes]
```

---

### **Resumo**
- **Certificado comum (CA:FALSE)**: Só serve para autenticação própria (ex: HTTPS).
- **Certificado CA (CA:TRUE)**: Pode emitir outros certificados (se tiver a chave privada).
- **CAs públicas NÃO delegam** capacidade de emissão a usuários finais.

Se precisar emitir certificados internamente, crie uma **CA privada** (OpenSSL, Vault). Para certificados públicos, dependa de uma CA confiável (Let's Encrypt, DigiCert).