---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
## **1. Quando o Cliente Precisa Ter o Certificado Intermediário?**
### **Caso 1: Validação de Cadeia Completa (Chain of Trust)**
- O cliente **só precisa ter a [[autoridade-certificadora-raiz|CA raiz (root)]]** no seu trust store (navegadores, SOs, apps).
- Os certificados intermediários **são enviados pelo servidor** durante o handshake TLS/mTLS.
- **Exemplo típico (HTTPS)**:
  ```mermaid
  graph LR
      A[CA Raiz (no trust store)] --> B[CA Intermediária]
      B --> C[Certificado do Site]
  ```
  - O servidor envia:  
    `certificado_do_site.crt + CA_intermediária.crt`  
  - O cliente usa a **CA raiz** para validar a **CA intermediária**, que por sua vez valida o [[certificado-digital|certificado]] do site.

### **Caso 2: Ambientes Restritos (mTLS, Sistemas Internos)**
- Aqui, o cliente **pode precisar ter a CA intermediária** no trust store se:
  - O servidor **não envia a cadeia completa** durante o handshake.
  - A política de segurança exige **validação explícita de CAs intermediárias** (ex: bancos, governos).

---

## **2. Como Funciona na Prática?**
### **Exemplo com [[protocolo-https|HTTPS]] (TLS Unidirecional)**
1. O servidor envia:
   - Seu certificado (`site.crt`).
   - O certificado da **CA intermediária** (`intermediary.crt`).
2. O cliente:
   - Verifica se a **CA raiz** está no trust store.
   - Usa a raiz para validar a **intermediária**.
   - Usa a intermediária para validar o `site.crt`.

### **Exemplo com mTLS ([[kubernetes]]/[[linkerd]])**
1. O **servidor (Pod A)** envia:
   - Seu certificado (`pod-a.crt`).
   - O certificado da **CA intermediária do Linkerd** (`linkerd-issuer.crt`).
2. O **cliente (Pod B)**:
   - Tem apenas a **CA raiz do Linkerd** (`identityTrustAnchorsPEM`) no trust store.
   - Valida a cadeia:  
     `CA raiz → linkerd-issuer.crt → pod-a.crt`.

---

## **3. Por Que Não Incluir Tudo no Trust Store?**
- **Segurança**: Quanto menos CAs no trust store, menor a superfície de ataque.
- **Manutenção**: CAs intermediárias podem mudar (ex: renovação), enquanto a raiz é estável.
- **Eficiência**: O protocolo [[protocolo-tls|TLS]] já suporta envio de cadeias intermediárias pelo servidor.

---

## **4. Problemas Comuns e Soluções**
| Cenário | Problema | Solução |
|---------|---------|---------|
| **"Unknown CA"** | Servidor não envia a cadeia intermediária. | Configure o servidor para enviar a cadeia completa. |
| **Certificado inválido** | CA intermediária não é confiável pelo cliente. | Adicione a CA intermediária ao trust store (casos específicos). |
| **mTLS falha** | Cliente não tem a CA raiz do servidor. | Adicione a CA raiz ao trust store do cliente. |

---

## **5. Como Verificar a Cadeia no OpenSSL**
```bash
openssl s_client -connect exemplo.com:443 -showcerts
```
**Saída:**
```
Certificate chain
 0 s:CN = exemplo.com
   i:CN = CA Intermediária
-----BEGIN CERTIFICATE-----
...
 1 s:CN = CA Intermediária
   i:CN = CA Raiz
-----BEGIN CERTIFICATE-----
...
```
- O cliente usa a **CA raiz** (se já estiver no trust store) para validar a cadeia.

---

## **6. Resumo Final**
| Situação | O que o Cliente Precisa no Trust Store? |
|----------|----------------------------------------|
| **TLS padrão (HTTPS)** | Apenas a CA raiz. |
| **mTLS (Linkerd, Istio)** | Apenas a CA raiz do service mesh. |
| **Sistemas legados** | Às vezes, a CA intermediária (se o servidor não enviar a cadeia). |

**Regra geral**:  
O cliente só precisa da **CA raiz** no trust store, desde que o servidor envie **toda a cadeia intermediária** durante o handshake. Isso é padrão no TLS/mTLS moderno.

Quer um exemplo de como configurar um servidor para enviar a cadeia completa? Posso mostrar!