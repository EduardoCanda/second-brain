---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
\# **Certificados no Linkerd: Permissões, Chaves Privadas e Emissão de Certificados**

Vamos esclarecer exatamente como o [[linkerd]] usa certificados e chaves privadas para gerenciar a identidade dos proxies (sidecars) no service mesh:

---

## **1. O Certificado do Linkerd Precisa Ter Permissão para Emitir Novos Certificados?**
**Resposta curta:** **Sim, o certificado do Linkerd deve ser uma [[autoridade-certificadora|CA (Autoridade Certificadora)]]** com permissão para emitir certificados. Mais precisamente:

### **Hierarquia de Certificados no Linkerd**
| Componente | Papel | Permissão (`CA:TRUE`?) |
|------------|-------|------------------------|
| **CA Raiz** (`identityTrustAnchorsPEM`) | Fonte de confiança principal | `CA:TRUE` (sempre) |
| **Issuer** (`crtPEM` + `keyPEM`) | Emite certificados para os proxies | `CA:TRUE` (obrigatório) |
| **Certificados dos Proxies** | Usados pelos sidecars (ex: `pod-svc.default.cluster.local`) | `CA:FALSE` |

- O **Issuer do Linkerd** é uma **CA intermediária** que:
  - É assinada pela CA raiz (`identityTrustAnchorsPEM`).
  - Tem a capacidade (`CA:TRUE`) de emitir certificados para os proxies.

---

## **2. Como Verificar se o Certificado do Issuer Tem `CA:TRUE`?**
Use o OpenSSL para inspecionar o certificado que você planeja usar como Issuer:

```bash
openssl x509 -in issuer.crt -text -noout | grep -A1 "Basic Constraints"
```
**Saída esperada:**
```
Basic Constraints:
    CA:TRUE, pathlen:0  # <- Isso permite emitir certificados
```
Se não houver `CA:TRUE`, o Linkerd **não funcionará corretamente**.

---

## **3. Papel da Chave Privada (`keyPEM`)**
A chave privada associada ao certificado do Issuer (`crtPEM`) é **crítica** porque:
1. **Assina certificados**: Quando um novo proxy (sidecar) é injetado em um Pod, o **controlador de identidade do Linkerd**:
   - Gera um certificado para esse proxy.
   - **Assina** o certificado usando a chave privada do Issuer (`keyPEM`).
2. **Prova de posse**: Garante que apenas o controlador do Linkerd (que tem a `keyPEM`) pode emitir certificados válidos.

### **Segurança da Chave Privada**
- **Nunca deve ser exposta**: Se comprometida, um invasor pode emitir certificados fraudulentos para seus serviços.
- **Armazenamento recomendado**:
  - Em um **Secret do Kubernetes** com acesso restrito.
  - Em um **HSM** (para ambientes de alta segurança).

---

## **4. Fluxo de Emissão de Certificados no Linkerd**
```mermaid
sequenceDiagram
    participant CA_Raiz
    participant Issuer
    participant Controlador_Linkerd
    participant Proxy

    CA_Raiz->>Issuer: Assina certificado (crtPEM + keyPEM)
    Note over Issuer: CA:TRUE
    Controlador_Linkerd->>Proxy: Precisa de certificado
    Issuer->>Controlador_Linkerd: Usa keyPEM para assinar
    Controlador_Linkerd->>Proxy: Entrega certificado válido
```

1. A **CA raiz** (`identityTrustAnchorsPEM`) assina o certificado do Issuer.
2. O **Issuer** (com `CA:TRUE` e `keyPEM`) assina certificados para proxies.
3. Os **proxies** usam esses certificados para mTLS.

---

## **5. Como Configurar Corretamente no Linkerd**
### **Se Usar uma CA Externa** (ex: Vault, cert-manager):
1. **Garanta que o certificado do Issuer tenha `CA:TRUE`**.
2. **Passe os arquivos corretos** no `values.yaml`:
   ```yaml
   identity:
     issuer:
       tls:
         crtPEM: |-
           -----BEGIN CERTIFICATE-----
           (certificado do Issuer com CA:TRUE)
           -----END CERTIFICATE-----
         keyPEM: |-
           -----BEGIN PRIVATE KEY-----
           (chave privada do Issuer)
           -----END PRIVATE KEY-----
     trustAnchorsPEM: |-
       -----BEGIN CERTIFICATE-----
       (CA raiz)
       -----END CERTIFICATE-----
   ```

### **Se Usar Certificados Autoassinados**:
Gere uma CA raiz e um Issuer com `CA:TRUE`:
```bash
# Gerar CA raiz
openssl genrsa -out ca.key 2048
openssl req -x509 -new -key ca.key -days 365 -out ca.crt -subj "/CN=Linkerd Root CA"

# Gerar Issuer (CA intermediária)
openssl genrsa -out issuer.key 2048
openssl req -new -key issuer.key -out issuer.csr -subj "/CN=Linkerd Issuer"
openssl x509 -req -in issuer.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out issuer.crt -days 90 -extensions v3_ca -extfile <(echo "[v3_ca]\nbasicConstraints=CA:TRUE")
```

---

## **6. Perguntas Frequentes**
### **P: Posso usar um certificado comum (CA:FALSE) como Issuer?**
**Não.** O Linkerd requer `CA:TRUE` para emitir certificados para proxies.

### **P: O que acontece se a `keyPEM` for vazada?**
- Revogue imediatamente o certificado do Issuer.
- Gere uma nova CA raiz e reemita todos os certificados.

### **P: Como renovar o certificado do Issuer?**
1. Gere um novo par (Issuer + chave).
2. Atualize o `values.yaml` do Helm.
3. Execute `helm upgrade`.

---

## **Resumo Final**
| Componente | Obrigatório? | Papel |
|------------|--------------|-------|
| **CA Raiz** (`identityTrustAnchorsPEM`) | Sim | Fonte de confiança (CA:TRUE) |
| **Issuer** (`crtPEM` + `keyPEM`) | Sim | Emite certificados (deve ter CA:TRUE) |
| **Chave Privada (`keyPEM`)** | Sim | Assina certificados dos proxies |

**Em produção**, prefira integrar o Linkerd a uma **CA corporativa** ou ferramentas como **Vault/cert-manager** para gerenciamento automatizado.