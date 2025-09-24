---
tags:
  - Fundamentos
  - NotaBibliografica
  - Segurança
---
# **Correlação entre os Parâmetros do Linkerd e Conceitos de PKI/Certificados**

No [[linkerd]] (service mesh para [[kubernetes]]), os parâmetros `identityTrustAnchorsPEM`, `crtPEM` e `keyPEM` estão diretamente relacionados à **[[pki]] (Infraestrutura de Chave Pública)** e aos conceitos que discutimos ([[autoridade-certificadora|CA]], [[certificado-digital|certificados]] [[self-signed-certificate|autoassinados]], cadeia de confiança). Vamos destrinchar cada um:

---

## **1. `identityTrustAnchorsPEM` (CA Root do Linkerd)**
### **O que é?**
- Contém o **certificado da [[autoridade-certificadora-raiz|CA raiz]]** (ou intermediária) que o Linkerd usará para emitir certificados para seus proxies (Pods).
- Equivale ao **`ca.crt`** em PKI tradicional.

### **Correlação com PKI:**
- É a **fonte de confiança** (Trust Anchor) da malha de serviço.
- Todos os componentes do Linkerd validam certificados com base nesse PEM.
- Se for uma **CA raiz autoassinada**, o Linkerd age como sua própria autoridade certificadora.

### **Exemplo de Uso:**
```yaml
identityTrustAnchorsPEM: |
  -----BEGIN CERTIFICATE-----
  MIIDFTCCAf2gAwIBAgIRAK0...  # Certificado PEM da CA
  -----END CERTIFICATE-----
```

---

## **2. `crtPEM` (Certificado do Issuer)**
### **O que é?**
- É o **certificado público** do **Issuer** (emissor) que assinará os certificados dos proxies.
- Normalmente assinado pela CA definida em `identityTrustAnchorsPEM`.
- Equivale ao **`cert.pem`** ou **`issuer.crt`**.

### **Correlação com PKI:**
- Representa a **CA intermediária** (se houver hierarquia) ou a própria CA raiz.
- Usado pelo **controlador de identidade do Linkerd** para assinar certificados dos sidecars.

### **Exemplo:**
```yaml
crtPEM: |
  -----BEGIN CERTIFICATE-----
  MIIEBDCCAuygAwIBAgIDAjp...  # Certificado do Issuer
  -----END CERTIFICATE-----
```

---

## **3. `keyPEM` (Chave Privada do Issuer)**
### **O que é?**
- Contém a **chave privada** correspondente ao certificado do Issuer (`crtPEM`).
- Equivale ao **`issuer.key`** ou **`key.pem`**.

### **Correlação com PKI:**
- **Nunca deve ser exposta/publicada** (só o Linkerd controlador acessa).
- Usada para **assinar certificados** dos proxies dos Pods.

### **Exemplo:**
```yaml
keyPEM: |
  -----BEGIN PRIVATE KEY-----
  MIIEvQIBADANBgkqhkiG...  # Chave privada (sensível!)
  -----END PRIVATE KEY-----
```

---

## **Fluxo de Funcionamento no Linkerd**
1. **CA Raiz (`identityTrustAnchorsPEM`)** define a confiança.
2. **Issuer (`crtPEM` + `keyPEM`)** emite certificados para os proxies.
3. **Proxies (sidecars)** recebem certificados válidos, assinados pelo Issuer.
4. **Comunicação mTLS**: Cada Pod verifica os certificados dos outros usando a CA raiz.

---

## **Tipos de Configuração Comuns**
### **1. Autoassinado (Self-Signed)**
- O próprio Linkerd gera a CA e o Issuer (usando `linkerd install --identity`).
- **Usado em testes/dev**.

### **2. Usando CA Externa**
- Integração com **Vault, cert-manager, ou uma CA corporativa**.
- Exemplo:
  ```yaml
  identityTrustAnchorsPEM: (certificado da CA corporativa)
  crtPEM: (certificado do Issuer assinado pela CA externa)
  keyPEM: (chave privada do Issuer)
  ```

---

## **Diagrama da Cadeia de Confiança no Linkerd**
```
[CA Root (identityTrustAnchorsPEM)]
       ↓
[Issuer (crtPEM + keyPEM)]
       ↓
[Certificados dos Proxies (automáticos)]
```

---

## **Resumo de Correspondências**
| Parâmetro Linkerd | Equivalente em PKI | Função |
|-------------------|-------------------|--------|
| `identityTrustAnchorsPEM` | `ca.crt` | Certificado da CA raiz (fonte de confiança) |
| `crtPEM` | `issuer.crt` | Certificado do emissor (intermediário) |
| `keyPEM` | `issuer.key` | Chave privada do emissor (para assinar certificados) |

---

### **Recomendações Práticas**
1. **Em produção**, use uma **CA externa** (Vault, cert-manager) em vez de autoassinado.
2. **Proteja `keyPEM`** (armazene em Secrets do Kubernetes com acesso restrito).
3. Para rotatividade de certificados, atualize os valores no Helm e faça um `helm upgrade`.

Quer um exemplo passo a passo de como gerar esses certificados para o Linkerd? Posso mostrar!