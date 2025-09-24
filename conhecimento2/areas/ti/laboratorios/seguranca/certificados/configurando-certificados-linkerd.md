---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
ferramenta: openssl
---
No contexto do [[linkerd]], ao receber sua **chave privada** (`key.pem`) e **certificado** (`crt.pem`) de uma [[autoridade-certificadora|CA]] (seja autoassinada ou externa), você precisará integrá-los ao *service mesh* para habilitar **[[protocolo-tls|mTLS]] (mutual TLS)** entre os pods. Aqui está o passo a passo detalhado:

---

### **1. Preparação dos Arquivos**
Antes de configurar o Linkerd, verifique se você tem:
- **`ca.crt`**: [[autoridade-certificadora-raiz|Certificado da CA raiz]] (ou intermediária) que assinou seu certificado.
- **`crt.pem`**: Certificado do Issuer (assinado pela CA).
- **`key.pem`**: Chave privada correspondente ao `crt.pem`.

**Exemplo de estrutura:**
```bash
.
├── ca.crt              # Certificado da CA raiz (identityTrustAnchorsPEM)
├── issuer.crt          # Certificado do Issuer (crtPEM)
└── issuer.key          # Chave privada do Issuer (keyPEM)
```

---

### **2. Configuração no [[helm]] Values do Linkerd**
Modifique o arquivo `values.yaml` do Helm (ou use `--set` durante a instalação) para incluir:

```yaml
identity:
  issuer:
    scheme: kubernetes.io/tls  # Usando certificados TLS padrão
    tls:
      keyPEM: |
        -----BEGIN PRIVATE KEY-----
        <SUA_CHAVE_PRIVADA_AQUI>  # issuer.key
        -----END PRIVATE KEY-----
      crtPEM: |
        -----BEGIN CERTIFICATE-----
        <SEU_CERTIFICADO_AQUI>    # issuer.crt
        -----END CERTIFICATE-----
  trustAnchorsPEM: |
    -----BEGIN CERTIFICATE-----
    <CA_ROOT_AQUI>               # ca.crt
    -----END CERTIFICATE-----
```

#### **O que cada campo faz:**
| Campo | Descrição |
|-------|-----------|
| `identity.issuer.tls.keyPEM` | Chave privada do Issuer (para assinar certificados dos proxies). |
| `identity.issuer.tls.crtPEM` | Certificado do Issuer (deve ser assinado pela CA raiz). |
| `identity.trustAnchorsPEM` | Certificado da CA raiz (todos os proxies confiam nela). |

---

### **3. Instalação/Atualização do Linkerd**
Aplique as configurações:

```bash
# Se for uma instalação nova:
helm install linkerd linkerd/linkerd-control-plane \
  -n linkerd \
  -f values.yaml

# Se for uma atualização:
helm upgrade linkerd linkerd/linkerd-control-plane \
  -n linkerd \
  -f values.yaml
```

---

### **4. Verificação da Instalação**
Confira se os certificados foram aceitos:

```bash
linkerd check --proxy
```
Saída esperada:
```
√ certificate config is valid
√ trust roots are using supported crypto algorithm
√ trust roots are within their validity period
√ trust roots are valid for at least 60 days
√ issuer cert is using supported crypto algorithm
√ issuer cert is within its validity period
√ issuer cert is valid for at least 60 days
√ issuer cert is issued by the trust root
```

---

### **5. Rotação de Certificados (Opcional)**
Se precisar atualizar os certificados:
1. Gere novos certificados (mantendo a mesma CA raiz).
2. Atualize os valores no `values.yaml`.
3. Execute:
   ```bash
   helm upgrade linkerd linkerd/linkerd-control-plane -n linkerd -f values.yaml
   ```
4. Os proxies serão atualizados gradualmente.

---

### **6. Backup e Segurança**
- **Chave privada (`issuer.key`)**:
  - Armazene em um **Secret do Kubernetes** com restrição de acesso:
    ```bash
    kubectl create secret generic linkerd-issuer-key -n linkerd --from-file=key.pem=issuer.key
    ```
  - Use ferramentas como **Vault** ou **Sealed Secrets** para criptografar.

---

### **7. Exemplo com Certificado Autoassinado**
Se você gerou seus próprios certificados (sem CA externa):

```bash
# Gerar CA raiz e Issuer:
openssl genrsa -out ca.key 2048
openssl req -x509 -new -key ca.key -days 365 -out ca.crt -subj "/CN=Root CA"

# Gerar Issuer:
openssl genrsa -out issuer.key 2048
openssl req -new -key issuer.key -out issuer.csr -subj "/CN=Linkerd Issuer"
openssl x509 -req -in issuer.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out issuer.crt -days 90
```

Depois, use os arquivos no Helm conforme o passo 2.

---

### **Possíveis Problemas e Soluções**
| Erro | Causa | Solução |
|------|-------|---------|
| `Invalid issuer certificate` | Certificado não assinado pela CA raiz | Verifique a cadeia com `openssl verify -CAfile ca.crt issuer.crt` |
| `Certificate expired` | Certificado vencido | Renove e atualize o Helm |
| `Private key mismatch` | Chave privada não corresponde ao certificado | Gere um novo par de chaves |

---

### **Resumo**
1. **Preparar** os certificados (`ca.crt`, `issuer.crt`, `issuer.key`).
2. **Configurar** no Helm (`values.yaml`).
3. **Instalar/Atualizar** o Linkerd.
4. **Verificar** com `linkerd check`.
5. **Monitorar** expirações (alertas para renovar).

Se precisar de automação, considere integrar o Linkerd com **cert-manager** para renovação automática!