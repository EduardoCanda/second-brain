---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
# **Fluxo de Validação e Movimentação de Certificados (mTLS e TLS)**

Vamos explorar como os certificados são validados e como as partes se comunicam de forma segura, com foco em **[[tls-mtls|mTLS]] (mutual TLS)** — o mecanismo usado pelo Linkerd e outros service meshes.

---

## **1. Fluxo Básico de Validação ([[protocolo-tls|TLS]] Unidirecional)**
O cenário clássico (ex: [[protocolo-https|HTTPS]]) onde **apenas o servidor se autentica**:

```mermaid
sequenceDiagram
    participant Cliente
    participant Servidor

    Cliente->>Servidor: ClientHello (inicia handshake TLS)
    Servidor->>Cliente: ServerHello + Certificado do Servidor
    Cliente->>Cliente: Verifica:
                        1. Validade do certificado
                        2. Assinatura da CA confiável
                        3. Nome do domínio
    Cliente->>Servidor: Chave pré-master (criptografada com chave pública do servidor)
    Servidor->>Cliente: Confirmação (handshake concluído)
    Cliente<->>Servidor: Dados trafegam criptografados
```

### **Pontos-Chave:**
1. O servidor envia seu certificado (`servidor.crt`).
2. O cliente verifica:
   - Se a **[[autoridade-certificadora|CA]] que assinou o certificado** está em sua trust store.
   - Se o certificado **não está revogado** (via [[crl]]/OCSP).
   - Se o **nome do domínio** corresponde ao certificado.
3. Se tudo estiver OK, a conexão é estabelecida.

---

## **2. Fluxo de Validação no mTLS (TLS Mútuo)**
No **mTLS**, **ambas as partes se autenticam** com certificados. Usado em:
- **Service meshes** ([[linkerd]], Istio)
- **APIs internas**
- **Sistemas bancários**

```mermaid
sequenceDiagram
    participant Cliente
    participant Servidor

    Cliente->>Servidor: ClientHello
    Servidor->>Cliente: ServerHello + Certificado do Servidor
    Cliente->>Servidor: Certificado do Cliente
    Servidor->>Servidor: Verifica certificado do cliente:
                        1. Assinatura da CA
                        2. Validade
                        3. Permissões (ex: CN=cliente.acme.com)
    Cliente->>Servidor: Chave pré-master (criptografada)
    Servidor->>Cliente: Confirmação
    Cliente<->>Servidor: Dados trafegam com criptografia mútua
```

### **Diferenças Cruciais para o mTLS:**
1. **O cliente também envia um certificado** (não apenas o servidor).
2. O servidor **tem uma lista de CAs aceitas** para validar clientes.
3. Ambos lados verificam:
   - **Autenticidade**: Certificado assinado por uma CA confiável.
   - **Autorização**: Nome comum (CN) ou SANs (Subject Alternative Names) permitidos.

---

## **3. Papel de Cada Componente no mTLS (Exemplo: Linkerd)**
| Componente | Função no mTLS |
|------------|----------------|
| **CA Raiz** (`identityTrustAnchorsPEM`) | Âncora de confiança para toda a malha. |
| **Issuer** (`crtPEM` + `keyPEM`) | Emite certificados para os proxies (sidecars). |
| **Certificado do Proxy** | Usado para autenticar cada Pod (ex: `pod.namespace.cluster.local`). |
| **CRL/OCSP** | Listas de certificados revogados (opcional em redes privadas). |

---

## **4. Exemplo Prático: Comunicação entre Pods no Linkerd**
1. **Injeção do Sidecar**:
   - O Linkerd injeta um proxy (sidecar) em cada Pod.
   - O controlador de identidade **emite um certificado único** para o proxy.

2. **Handshake mTLS**:
   - Quando o Pod A chama o Pod B:
     - **Proxy A** envia seu certificado para **Proxy B**.
     - **Proxy B** verifica:
       - Se o certificado foi assinado pelo Issuer do Linkerd.
       - Se a CA raiz (`identityTrustAnchorsPEM`) é confiável.
     - **Proxy B** envia seu certificado para **Proxy A** (validação recíproca).

3. **Criptografia**:
   - Após a validação mútua, a comunicação é criptografada com uma chave de sessão.

---

## **5. Validação em Detalhe (O Que Cada Parte Verifica?)**
### **Cliente Verifica Servidor:**
1. O certificado do servidor foi assinado por uma **CA confiável**?
2. O certificado **não está revogado**?
3. O **Common Name (CN)** ou **SANs** corresponde ao hostname esperado?
4. O certificado está **dentro do período de validade**?

### **Servidor Verifica Cliente (mTLS):**
1. O certificado do cliente foi assinado por uma **CA aceita** (ex: CA do Linkerd)?
2. O **CN/SAN** do cliente está na lista de permissões? (ex: `*.cluster.local`).
3. O certificado **não foi revogado**?

---

## **6. Ferramentas para Depuração**
### **Verificar Certificados em Trânsito (OpenSSL)**
```bash
# Para TLS comum (HTTPS):
openssl s_client -connect exemplo.com:443 -showcerts

# Para mTLS (ex: serviço com mTLS):
openssl s_client -connect servico:443 -cert cliente.crt -key cliente.key -CAfile ca.crt
```

### **Inspecionar Certificados no Kubernetes (Linkerd)**
```bash
# Verificar certificado de um proxy:
kubectl exec -it <pod> -c linkerd-proxy -- \
  openssl x509 -in /var/run/linkerd/identity/end-entity/cert.pem -text -noout
```

---

## **7. Casos de Erro Comuns**
| Erro                                      | Causa Provável                                                                         | Solução                                  |
| ----------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------- |
| `certificate signed by unknown authority` | [[autoridade-certificadora-raiz\|CA raiz]] não está na trust store do cliente | Adicione `ca.crt` ao cliente.            |
| `certificate has expired`                 | Certificado expirado                                                                   | Renove o certificado.                    |
| `hostname mismatch`                       | CN/SAN não corresponde ao hostname                                                     | Emita um certificado com o nome correto. |
| `peer did not provide a certificate`      | Servidor espera mTLS, mas cliente não enviou certificado                               | Configure o cliente para usar mTLS.      |

---

## **8. Resumo do Fluxo mTLS**
1. **Troca de certificados**: Cliente e servidor compartilham seus certificados.
2. **Validação mútua**:
   - Ambos verificam a assinatura da CA.
   - Checam revogação (se aplicável).
   - Validam nomes (CN/SANs).
3. **Estabelecimento de chave de sessão**: Dados são criptografados.

**No [[linkerd]]**, esse processo é **automático**: os proxies injetados gerenciam mTLS sem intervenção manual.
