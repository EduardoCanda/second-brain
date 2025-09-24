---
tags:
  - Fundamentos
  - Kubernetes
  - NotaBibliografica
ferramenta: certmanager
---
O **Cert Manager** é um controlador nativo do Kubernetes usado para gerenciar e automatizar a emissão, renovação e utilização de certificados TLS/SSL em um cluster Kubernetes. Ele simplifica a configuração de certificados digitais, garantindo que as aplicações tenham conexões seguras ([[protocolo-https|HTTPS]]) sem a necessidade de intervenção manual.

### **Principais funcionalidades do Cert Manager:**
1. **Automatização de certificados TLS**:
   - Solicita, renova e revoga certificados automaticamente.
   - Suporta certificados de autoridades certificadoras (CAs) como Let's Encrypt, Venafi, HashiCorp Vault e outras.

2. **Integração com Let's Encrypt**:
   - Permite obter certificados gratuitos e válidos publicamente usando os desafios **HTTP-01** (via domínio) ou **DNS-01** (via registros DNS).

1. **Gerenciamento via [[custom-resources|CRDs]] (Custom Resource Definitions)**:
   - Define recursos como:
     - **`Issuer` / `ClusterIssuer`**: Configura a CA (Certificate Authority) que emite os certificados.
     - **`Certificate`**: Especifica os domínios e o emissor para um certificado.
     - **`Challenge`**: Usado internamente para resolver desafios ACME (ex: Let's Encrypt).

4. **Armazenamento seguro de secrets**:
   - Os certificados são armazenados como **Secrets** do Kubernetes no namespace da aplicação.

5. **Suporte a wildcards e múltiplos domínios**:
   - Permite certificados para `*.example.com` ou listas de domínios (SANs).

---

### **Como o Cert Manager funciona?**
1. **Você define um `Issuer`** (ou `ClusterIssuer` para uso em todo o cluster):
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-prod
   spec:
     acme:
       server: https://acme-v02.api.letsencrypt.org/directory
       email: seu@email.com
       privateKeySecretRef:
         name: letsencrypt-prod
       solvers:
       - http01:
           ingress:
             class: nginx
   ```

2. **Cria um recurso `Certificate`**:
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: Certificate
   metadata:
     name: meu-certificado
   spec:
     secretName: meu-certificado-tls
     issuerRef:
       name: letsencrypt-prod
       kind: ClusterIssuer
     dnsNames:
     - exemplo.com
     - www.exemplo.com
   ```

3. **O Cert Manager cuida do resto**:
   - Gera uma chave privada.
   - Solicita o certificado à CA (ex: Let's Encrypt).
   - Resolve o desafio ACME (via HTTP ou DNS).
   - Armazena o certificado em um **[[secret]]** (`meu-certificado-tls`).
   - Renova automaticamente antes da expiração.

---

### **Casos de uso comuns**
- **HTTPS em Ingresses**: Automatiza certificados para serviços expostos via Ingress (ex: Nginx, Traefik).
- **Service-to-service encryption**: Certificados para comunicação interna entre microsserviços (mTLS).
- **Replace self-signed certificates**: Elimina certificados autoassinados inseguros.

---

### **Como instalar?**
Via Helm (recomendado):
```sh
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.3 \
  --set installCRDs=true
```

---

### **Resumo**
O Cert Manager é uma ferramenta essencial para administradores de clusters Kubernetes que desejam automatizar a segurança de comunicações com TLS/SSL, reduzindo erros manuais e garantindo conformidade com boas práticas de segurança.