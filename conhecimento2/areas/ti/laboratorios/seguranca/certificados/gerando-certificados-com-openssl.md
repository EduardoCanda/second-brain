---
tags:
  - Segurança
  - NotaBibliografica
categoria: criptografia
ferramenta: openssl
---
# **Guia Completo de OpenSSL: Criação de CAs, Certificados e Cadeias de Confiança**

Vamos explorar passo a passo como usar o [[openssl]] para criar uma **infraestrutura [[pki]] completa**, incluindo:

1. **[[autoridade-certificadora-raiz|CA Raiz]]**
2. **CA Intermediária**
3. **[[certificado-digital|Certificados de Serviço]] (folha/end-entity)**
4. **Validação e Inspeção**

---

## **1. Criando uma CA Raiz**
A CA raiz é a âncora de confiança da sua PKI. Ela será autoassinada.

### **1.1 Gerar chave privada da CA Raiz**
```bash
openssl genrsa -aes256 -out ca-root.key 4096  # -aes256 protege a chave com senha
```
- **Onde**:  
  `ca-root.key` → Chave privada da CA raiz (armazene com segurança!).

### **1.2 Criar certificado autoassinado da CA Raiz**
```bash
openssl req -x509 -new -key ca-root.key -days 3650 -out ca-root.crt \
  -subj "/CN=Minha CA Raiz/O=Empresa Ltda/C=BR/ST=Sao Paulo/L=Sao Paulo"
```
- **Flags**:  
  `-x509` → Cria certificado autoassinado.  
  `-days 3650` → Validade (10 anos).  
  `-subj` → Identidade da CA (ajuste conforme necessário).

### **1.3 Verificar o certificado da CA Raiz**
```bash
openssl x509 -in ca-root.crt -text -noout
```
**Confira**:  
- `Basic Constraints: CA:TRUE`  
- `Key Usage: Certificate Sign, CRL Sign`  

---

## **2. Criando uma CA Intermediária**
A CA intermediária é assinada pela CA raiz e pode emitir certificados finais.

### **2.1 Gerar chave privada da Intermediária**
```bash
openssl genrsa -out ca-intermediaria.key 4096
```

### **2.2 Criar CSR (Certificate Signing Request)**
```bash
openssl req -new -key ca-intermediaria.key -out ca-intermediaria.csr \
  -subj "/CN=CA Intermediaria/O=Empresa Ltda/C=BR/ST=Sao Paulo/L=Sao Paulo"
```

### **2.3 Assinar o CSR com a CA Raiz**
Crie um arquivo de configuração (`v3_intermediary.cnf`) para definir permissões:
```ini
[ v3_intermediary ]
basicConstraints = CA:TRUE, pathlen:0
keyUsage = digitalSignature, keyCertSign, cRLSign
```
Assine:
```bash
openssl x509 -req -in ca-intermediaria.csr -CA ca-root.crt -CAkey ca-root.key \
  -CAcreateserial -out ca-intermediaria.crt -days 1825 -extfile v3_intermediary.cnf -extensions v3_intermediary
```
- **`pathlen:0`**: Impede que a intermediária crie outras CAs abaixo dela.

---

## **3. Criando Certificados de Serviço (Folha)**
Certificados para servidores, clients ou dispositivos.

### **3.1 Gerar chave privada do serviço**
```bash
openssl genrsa -out servico.key 2048
```

### **3.2 Criar CSR para o serviço**
```bash
openssl req -new -key servico.key -out servico.csr \
  -subj "/CN=meu-servico.com/O=Empresa Ltda/C=BR"
```

### **3.3 Assinar o CSR com a CA Intermediária**
Crie um arquivo de configuração (`v3_leaf.cnf`) para certificados finais:
```ini
[ v3_leaf ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = DNS:meu-servico.com, DNS:*.meu-servico.com
```
Assine:
```bash
openssl x509 -req -in servico.csr -CA ca-intermediaria.crt -CAkey ca-intermediaria.key \
  -CAcreateserial -out servico.crt -days 365 -extfile v3_leaf.cnf -extensions v3_leaf
```

---

## **4. Criando uma Cadeia de Confiança**
Para que os clientes validem o certificado do serviço, você precisa fornecer a **cadeia completa**:
```bash
cat servico.crt ca-intermediaria.crt > servico-chain.crt
```

---

## **5. Verificando Certificados**
### **5.1 Verificar assinatura**
```bash
openssl verify -CAfile ca-root.crt -untrusted ca-intermediaria.crt servico.crt
```
Saída esperada:  
```
servico.crt: OK
```

### **5.2 Inspecionar certificado**
```bash
openssl x509 -in servico.crt -text -noout
```
**Confira**:  
- `Issuer`: Deve ser a CA intermediária.  
- `Subject Alternative Name` (SAN): Lista de domínios válidos.  

---

## **6. Usando os Certificados**
### **6.1 Servidor Web (Nginx)**
```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/servico-chain.crt;  # Certificado + intermediária
    ssl_certificate_key /path/servico.key;
    ssl_trusted_certificate /path/ca-root.crt;  # Opcional para OCSP stapling
}
```

### **6.2 [[kubernetes]] (TLS [[secret|Secrets]])**
```bash
kubectl create secret tls meu-servico-tls \
  --cert=servico-chain.crt \
  --key=servico.key
```

### **6.3 [[tls-mtls|mTLS]] (Exemplo: curl)**
```bash
curl --cacert ca-root.crt --cert cliente.crt --key cliente.key https://meu-servico.com
```

---

## **7. Fluxo Completo em Diagrama**
```mermaid
graph TD
    A[CA Raiz (ca-root.crt)] -->|Assina| B[CA Intermediária (ca-intermediaria.crt)]
    B -->|Assina| C[Certificado do Serviço (servico.crt)]
    C --> D[Servidor/Aplicação]
    A --> E[Trust Store (Clientes)]
```

---

## **8. Dicas de Segurança**
1. **Proteja as chaves privadas**:  
   - CA raiz: Armazene offline (ex: HSM).  
   - Use senhas fortes (`-aes256`).  
2. **Validade curta para certificados folha**: 90 dias ou menos.  
3. **Revogação**: Mantenha uma [[crl]] (Certificate Revocation List) se necessário.  

---

## **Comandos Úteis Extras**
| Tarefa | Comando |
|--------|---------|
| Converter formato PEM → PKCS#12 | `openssl pkcs12 -export -out servico.pfx -inkey servico.key -in servico-chain.crt` |
| Gerar CSR com SANs dinâmicos | Criar um arquivo `.cnf` com `[req]` e `[v3_req]` antes do CSR. |
| Verificar conexão TLS | `openssl s_client -connect meu-servico.com:443 -showcerts` |

---

### **Próximos Passos**
Quer aprender a:  
- Automatizar isso com **cert-manager** no Kubernetes?  
- Criar uma **CRL (Lista de Certificados Revogados)**?  
- Configurar **OCSP Stapling** para melhor desempenho?  

Posso detalhar qualquer um desses tópicos!