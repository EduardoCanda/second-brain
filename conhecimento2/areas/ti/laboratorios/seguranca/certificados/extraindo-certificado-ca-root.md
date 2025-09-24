---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
ferramenta: openssl
---
# **Como Obter o `ca.crt` Quando o Provedor Só Entrega Certificado + Chave Privada**

Se o seu provedor de certificados (como DigiCert, Sectigo, Let's Encrypt) só lhe entregou **dois arquivos** (`certificado.crt` + `chave-privada.key`), você ainda precisará do **`ca.crt`** ([[certificado-digital|certificado]] da [[autoridade-certificadora-raiz|Autoridade Certificadora raiz]] ou intermediária) para configurar corretamente o Linkerd (ou qualquer sistema que exija uma cadeia de confiança completa).

---

## **1. Onde Encontrar o `ca.crt`?**
### **Cenário 1: O Provedor Disponibiliza em seu Site**
Muitas CAs públicas oferecem o `ca.crt` para download em suas páginas de suporte. Exemplos:
- **DigiCert**: [https://www.digicert.com/kb/digicert-root-certificates.htm](https://www.digicert.com/kb/digicert-root-certificates.htm)
- **Sectigo**: [https://support.sectigo.com/articles/Knowledge/Sectigo-AddTrust-External-CA-Root-Expiring-May-30-2020](https://support.sectigo.com/articles/Knowledge/Sectigo-AddTrust-External-CA-Root-Expiring-May-30-2020)
- **Let's Encrypt**: Já inclui a cadeia intermediária no próprio certificado.

### **Cenário 2: Extrair do Certificado Recebido**
Se o certificado que você recebeu já inclui a cadeia intermediária (isso é comum em `.pem` ou `.crt`), você pode separá-la manualmente.

**Exemplo de um arquivo `.crt` com cadeia:**
```plaintext
-----BEGIN CERTIFICATE-----
(Seu certificado)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(CA Intermediária)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(CA Raiz - opcional)
-----END CERTIFICATE-----
```

**Como extrair a parte da CA:**
```bash
# Salvar apenas a parte da CA intermediária/raiz em um novo arquivo
sed -n '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p' seu_certificado.crt | awk '/BEGIN/,/END/{ if(++count>1) print }' > ca.crt
```

### **Cenário 3: Usar OpenSSL para Obter a Cadeia**
Se o certificado foi emitido por uma CA pública, você pode baixar a cadeia usando OpenSSL:

```bash
openssl s_client -showcerts -connect SEU_DOMINIO:443 </dev/null 2>/dev/null | awk '/BEGIN CERT/{c=1} c {print} /END CERT/{c=0}' > full_chain.crt
```
Isso salvará todos os certificados da cadeia em `full_chain.crt`. Separe manualmente a parte da CA.

---

## **2. Como Verificar se o `ca.crt` Está Correto?**
Use o OpenSSL para validar a cadeia:
```bash
openssl verify -CAfile ca.crt seu_certificado.crt
```
Saída esperada:
```
seu_certificado.crt: OK
```
Se falhar, a CA não é a correta ou falta um elo na cadeia.

---

## **3. Configuração no Linkerd**
Uma vez que você tenha:
- `ca.crt` (CA raiz ou intermediária)
- `issuer.crt` (seu certificado)
- `issuer.key` (sua chave privada)

Atualize o `values.yaml` do Helm conforme explicado anteriormente:

```yaml
identity:
  issuer:
    tls:
      keyPEM: |-
        -----BEGIN PRIVATE KEY-----
        <conteúdo do issuer.key>
        -----END PRIVATE KEY-----
      crtPEM: |-
        -----BEGIN CERTIFICATE-----
        <conteúdo do issuer.crt>
        -----END CERTIFICATE-----
  trustAnchorsPEM: |-
    -----BEGIN CERTIFICATE-----
    <conteúdo do ca.crt>
    -----END CERTIFICATE-----
```

---

## **4. Caso Não Encontrar o `ca.crt`**
Se você **realmente não conseguir** o certificado da CA:
1. **Contate o suporte do provedor** e peça o `ca-bundle.crt` ou `chain.crt`.
2. **Para testes**, gere uma CA autoassinada localmente (não recomendado para produção):
   ```bash
   openssl genrsa -out ca.key 2048
   openssl req -x509 -new -nodes -key ca.key -days 3650 -out ca.crt -subj "/CN=Minha CA Local"
   ```

---

## **Resumo**
| Situação | Solução |
|----------|---------|
| Provedor não enviou `ca.crt` | Baixe do site oficial da CA ou extraia do certificado recebido. |
| Certificado inclui cadeia | Separe manualmente ou use OpenSSL. |
| Nenhuma opção funciona | Contate o suporte ou use uma CA temporária (apenas para dev). |

**Dica crítica:** Sem o `ca.crt`, o Linkerd **não poderá validar certificados**, quebrando o mTLS. Certifique-se de que a cadeia esteja completa!