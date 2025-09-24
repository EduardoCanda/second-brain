---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
categoria: criptografia
---
# **Validação de Certificados no mTLS: Papel do Servidor e do Cliente**

No **[[tls-mtls|mTLS]] (mutual TLS)**, **ambas as partes (cliente e servidor) devem validar os [[certificado-digital|certificados]] um do outro**, mas os mecanismos de validação são assimétricos. Vamos destrinchar:

---

## **1. Quem Precisa de Quê no mTLS?**
| Componente   | O que Precisa                                                                                                                                                          | O que Faz                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Servidor** | - Certificado do servidor <br> - Chave privada do servidor <br> - **[[autoridade-certificadora-raiz\|CA raiz]]/intermediária que valida clientes** (opcional) | 1. Apresenta seu certificado ao cliente. <br> 2. **Valida o certificado do cliente** (se configurado). |
| **Cliente**  | - Certificado do cliente <br> - Chave privada do cliente <br> - **CA raiz que valida o servidor** (trust store)                                                        | 1. Valida o certificado do servidor. <br> 2. Apresenta seu certificado ao servidor.                    |

---

## **2. Fluxo de Validação no mTLS**
```mermaid
sequenceDiagram
    participant Cliente
    participant Servidor

    Cliente->>Servidor: ClientHello
    Servidor->>Cliente: ServerHello + Certificado do Servidor
    Cliente->>Cliente: Valida certificado do servidor (usando sua trust store)
    Cliente->>Servidor: Certificado do Cliente
    Servidor->>Servidor: Valida certificado do cliente (se configurado)
    Cliente->>Servidor: Chave pré-master (criptografada)
    Servidor->>Cliente: Confirmação
    Cliente<->>Servidor: Comunicação criptografada
```

### **Pontos-Chave:**
1. **Validação do servidor pelo cliente**:
   - O cliente **sempre** valida o certificado do servidor usando sua **trust store** (ex: CA raiz do servidor).
   - Isso é idêntico ao [[protocolo-tls|TLS]] tradicional ([[protocolo-https|HTTPS]]).

2. **Validação do cliente pelo servidor**:
   - O servidor **pode** validar o certificado do cliente, mas isso **não é obrigatório** por padrão.
   - Se a validação estiver ativa, o servidor usa:
     - Uma **lista de CAs confiáveis** para clientes (diferente da CA raiz do servidor).
     - Ou um **trust store dedicado** para certificados de clientes.

---

## **3. Configuração Típica em Aplicações**
### **a) Servidor (Exemplo: Nginx)**
```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/servidor.crt;
    ssl_certificate_key /path/servidor.key;
    
    # mTLS: Exige certificado do cliente e valida contra uma CA específica
    ssl_client_certificate /path/ca-clientes.crt;  # CA que assina certificados de clientes
    ssl_verify_client on;  # Obrigatório para mTLS estrito
}
```

### **b) Cliente (Exemplo: cURL)**
```bash
curl --cert cliente.crt --key cliente.key --cacert ca-servidor.crt https://servidor.com
```
- `--cacert`: CA que valida o certificado do **servidor**.
- `--cert`/`--key`: Certificado e chave do **cliente**.

---

## **4. Trust Stores no mTLS**
| Papel | Onde Estão as CAs Confiáveis? |
|-------|-------------------------------|
| **Cliente** | Trust store padrão do SO/navegador (ex: `/etc/ssl/certs`) ou arquivo customizado (`--cacert`). |
| **Servidor** | Configurado manualmente (ex: `ssl_client_certificate` no Nginx) ou via sistema de PKI. |

### **Exemplo:**
- O servidor pode confiar em uma **CA diferente** para clientes (ex: `ca-clientes.crt`), enquanto os clientes usam `ca-servidor.crt` para validar o servidor.

---

## **5. Quando a Validação do Cliente é Obrigatória?**
- **APIs seguras**: Serviços internos (ex: Kubernetes, service meshes como Linkerd).
- **Bancos**: Aplicações financeiras que exigem autenticação forte.
- **Dispositivos IoT**: Cada dispositivo tem um certificado único.

---

## **6. Erros Comuns**
| Erro | Causa | Solução |
|------|-------|---------|
| `SSL peer did not present a certificate` | Servidor exige mTLS, mas cliente não enviou certificado. | Configure o cliente com `--cert` e `--key`. |
| `certificate verify failed` | Cliente/servidor não tem a CA correta no trust store. | Adicione a CA raiz adequada. |
| `unable to get local issuer certificate` | Falta cadeia de certificados intermediários. | Inclua a cadeia completa no servidor. |

---

## **7. Resumo: Validação no mTLS**
| **Validação** | **Cliente** | **Servidor** |
|---------------|-------------|--------------|
| **Certificado apresentado** | Sim | Sim |
| **Validação obrigatória** | Sempre (contra trust store) | Opcional (depende da configuração) |
| **Trust store usado** | CA raiz do servidor | CA raiz dos clientes (se aplicável) |

---