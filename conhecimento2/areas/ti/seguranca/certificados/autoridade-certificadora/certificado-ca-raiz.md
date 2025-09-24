---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
Sim, uma **[[autoridade-certificadora-raiz|CA raiz (Root CA)]] é um [[certificado-digital]]**, mas com características especiais que a diferenciam de certificados comuns. Vamos destrinchar:

---

## **1. Por que uma CA Raiz é um Certificado?**
A CA raiz segue o padrão **X.509** (como qualquer certificado), mas possui atributos exclusivos:
- **É autoassinado**: Ele assina a si mesmo (não depende de outra CA).
- **Tem a extensão `CA:TRUE`**: Indica que pode emitir outros certificados.
- **É a âncora de confiança**: Todos os certificados válidos no sistema derivam sua confiança dela.

---

## **2. Conteúdo Típico de um Certificado de CA Raiz**
Você pode inspecionar uma CA raiz com:
```bash
openssl x509 -in ca.crt -text -noout
```

### **Campos Principais:**
| Campo | Exemplo/Valor | Significado |
|-------|---------------|-------------|
| **Subject** | `CN = Global Root CA, O = Internet Security, C = US` | Identidade da CA. |
| **Issuer** | **Igual ao Subject** (autoassinado) | Prova que não há autoridade superior. |
| **Validade** | `Not Before: 2020-01-01`, `Not After: 2040-01-01` | Período longo (10+ anos). |
| **Chave Pública** | `RSA 4096 bits` ou `ECC secp384r1` | Algoritmo e tamanho robustos. |
| **Basic Constraints** | `CA:TRUE, pathlen:1` | Permite emitir certificados (e define profundidade da cadeia). |
| **Key Usage** | `keyCertSign, cRLSign` | Só pode assinar certificados e CRLs. |
| **Signature Algorithm** | `sha256WithRSAEncryption` | Algoritmo de assinatura. |

---

## **3. Exemplo de um Certificado de CA Raiz (PEM)**
```plaintext
-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUEK8Q6V6UMVQ5Q3Xm0Zf9k8vOxu4wDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCVVMxIDAeBgNVBAoMF0ludGVybmV0IFNlY3VyaXR5IFJv
b3QxEzARBgNVBAMMCkdsb2JhbCBSb290MB4XDTIwMDEwMTAwMDAwMFoXDTQwMDEw
MTAwMDAwMFowRTELMAkGA1UEBhMCVVMxIDAeBgNVBAoMF0ludGVybmV0IFNlY3Vy
aXR5IFJvb3QxEzARBgNVBAMMCkdsb2JhbCBSb290MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAv7U3wv5qJk9QY7Xz7Xh7QZ1Z7K7Q5X5XZ7K7Q5X5XZ7
... (chave pública e assinatura) ...
-----END CERTIFICATE-----
```

---

## **4. Diferenças Entre CA Raiz e Certificados Comuns**
| Característica | CA Raiz | Certificado Comum (ex: SSL) |
|---------------|---------|-----------------------------|
| **Assinatura** | Autoassinado | Assinado por uma CA superior |
| **`CA:TRUE`** | Sempre | Raramente (só se for CA intermediária) |
| **Key Usage** | `keyCertSign` | `digitalSignature`, `keyEncipherment` |
| **Validade** | Longa (10+ anos) | Curta (1-3 anos para SSL) |
| **Armazenamento** | Em trust stores (navegadores, SOs) | Em servidores |

---

## **5. Como uma CA Raiz é Usada?**
1. **Armazenada em Trust Stores**:
   - Navegadores (Chrome, Firefox), SOs (Windows, macOS) e dispositivos confiam nela por padrão.
   - Exemplo: Certificados da **DigiCert, GlobalSign, Let's Encrypt (ISRG Root)**.

2. **Assina CAs Intermediárias**:
   ```mermaid
   graph LR
       A[CA Raiz] -->|Assina| B[CA Intermediária]
       B -->|Assina| C[Certificado do Site]
   ```

3. **Validação de Cadeia**:
   - Quando você acessa `https://exemplo.com`, seu navegador verifica se:
     - O certificado do site foi assinado por uma CA intermediária.
     - A CA intermediária foi assinada pela CA raiz confiável.

---

## **6. Segurança de CAs Raiz**
- **Proteção física**: Chaves privadas de CAs raiz são guardadas em **HSMs** (Hardware Security Modules).
- **Offline**: Muitas CAs raiz ficam desconectadas da internet para evitar ataques.
- **Revogação**: Se comprometida, a CA raiz é adicionada a listas de desconfiança (ex: CRLsets no Chrome).

---

## **7. Exemplo Prático: Criando uma CA Raiz com OpenSSL**
```bash
# Gerar chave privada (protegida por senha)
openssl genrsa -aes256 -out ca.key 4096

# Gerar certificado autoassinado (válido por 10 anos)
openssl req -x509 -new -key ca.key -days 3650 -out ca.crt \
  -subj "/CN=Minha CA Raiz/O=Minha Empresa/C=BR"

# Verificar
openssl x509 -in ca.crt -text -noout | grep -A1 "Basic Constraints"
```
**Saída:**
```
Basic Constraints:
    CA:TRUE
```

---

### **Resumo**
- Uma **CA raiz é um certificado autoassinado** com `CA:TRUE`.
- **Contém:** Identidade, chave pública, políticas de uso e assinatura.
- **Função:** Âncora de confiança para toda uma PKI.
- **Segurança:** Sua chave privada é o ativo mais crítico (geralmente em HSMs).

Quer ver como implantar uma CA raiz em um ambiente corporativo? Posso mostrar um fluxo completo!