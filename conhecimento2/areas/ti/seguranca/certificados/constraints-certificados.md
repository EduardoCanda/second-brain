---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
categoria: criptografia
---
# **Constraints (Restrições) em Certificados X.509**

Os **constraints** (restrições) em [[certificado-digital|certificados]] digitais são **extensões X.509** que definem regras sobre como um certificado pode ser usado e quais suas limitações na hierarquia de confiança. Eles são essenciais para segurança em [[pki]] (Infraestrutura de Chave Pública).

---

## **1. Principais Tipos de Constraints**

### **A) `basicConstraints` (Restrições Básicas)**
Define se um certificado é uma **[[autoridade-certificadora|CA]] (Autoridade Certificadora)** e limita sua capacidade de emitir sub-CAs.

| Parâmetro | Valores Possíveis     | Significado                                                      |
| --------- | --------------------- | ---------------------------------------------------------------- |
| `CA`      | `TRUE` ou `FALSE`     | Se `TRUE`, o certificado pode assinar outros certificados.       |
| `pathlen` | Número (ex: `0`, `1`) | Máximo de níveis de sub-CAs permitidos abaixo deste certificado. |

#### **Exemplos Comuns**:
- **[[autoridade-certificadora-raiz|CA Raiz]]**:  
```ini
basicConstraints = critical,CA:TRUE,pathlen:1
```
  - Pode emitir certificados intermediários (`pathlen:1`), mas esses intermediários **não** podem emitir outras CAs.

- **Certificado Final (não-CA)**:  
```ini
basicConstraints = critical,CA:FALSE
```
  - Não pode assinar outros certificados (ex.: certificado de servidor web).

---

### **B) `keyUsage` (Uso da Chave)**
Especifica **operações criptográficas permitidas** para a chave do certificado.

| Flag               | Descrição                                               |
| ------------------ | ------------------------------------------------------- |
| `digitalSignature` | Pode ser usado para assinar dados (ex.: TLS handshake). |
| `keyCertSign`      | Pode assinar outros certificados (apenas para CAs).     |
| `cRLSign`          | Pode assinar listas de revogação (CRLs).                |
| `keyEncipherment`  | Pode cifrar chaves simétricas (usado em RSA).           |
| `nonRepudiation`   | Garante não repúdio (ex.: assinaturas em contratos).    |

#### **Exemplo para uma CA**:
```ini
keyUsage = critical,keyCertSign,cRLSign
```

#### **Exemplo para um Servidor Web**:
```ini
keyUsage = critical,digitalSignature,keyEncipherment
```

---

### **C) `nameConstraints` (Restrições de Nome)**
Limita os **nomes de domínio** ou **IPs** que um certificado de CA pode emitir.  
*(Usado em CAs intermediárias para restringir escopo)*.

#### **Exemplo**:
```ini
nameConstraints = permitted;DNS:.example.com,permitted;IP:192.168.1.0/24
```
- Só permite emitir certificados para `*.example.com` e IPs na rede `192.168.1.0/24`.

---

### **D) `policyConstraints` (Restrições de Política)**
Controla se certificados abaixo na hierarquia **precisam declarar políticas de certificação**.

| Parâmetro | Efeito |
|-----------|--------|
| `requireExplicitPolicy` | Exige que sub-CAs declarem políticas. |
| `inhibitPolicyMapping` | Bloqueia herança de políticas de CAs superiores. |

---

## **2. Por que os Constraints São Importantes?**
1. **Previnem Abusos**:  
   - Evitam que um certificado de servidor seja usado como CA (ex.: ataque "man-in-the-middle").
   
2. **Definem Hierarquia de Confiança**:  
   - `pathlen:0` em uma CA intermediária impede que ela crie outras CAs.

3. **Garantem Conformidade**:  
   - Padrões como **RFC 5280** e **TLS 1.3** exigem `basicConstraints` críticos.

---

## **3. Exemplo Prático no OpenSSL**
Para gerar um certificado de **CA raiz** com constraints:
```ini
[ v3_ca ]
basicConstraints = critical,CA:TRUE,pathlen:1
keyUsage = critical,keyCertSign,cRLSign
```

Para um **certificado de servidor** (não-CA):
```ini
[ v3_server ]
basicConstraints = critical,CA:FALSE
keyUsage = critical,digitalSignature,keyEncipherment
subjectAltName = DNS:meusite.com
```

---

## **4. Como Verificar Constraints?**
Use o OpenSSL para inspecionar um certificado:
```bash
openssl x509 -in certificado.crt -text -noout
```
- Procure por seções como:  
  ```
  X509v3 Basic Constraints: critical
      CA:TRUE, pathlen:0
  X509v3 Key Usage: critical
      Digital Signature, Key Encipherment
  ```

---

## **5. Erros Comuns**
- **Certificado de servidor com `CA:TRUE`**:  
  - Um invasor poderia usá-lo para emitir certificados falsos.
  
- **`pathlen` ausente em uma CA**:  
  - Permite criação ilimitada de sub-CAs (risco de segurança).

- **`keyUsage` sem `keyCertSign` em uma CA**:  
  - Impede a assinatura de certificados, tornando-a inútil.

---

## **Conclusão**
Os **constraints** são regras críticas que:  
- Controlam **como um certificado pode ser usado**.  
- Delimitam **hierarquias de confiança**.  
- São essenciais para **segurança em [[pki]] e [[protocolo-tls|TLS]]**.  

Se estiver gerando certificados para o [[linkerd]], [[kubernetes]] ou HTTPS, sempre defina:  
- `basicConstraints` (CA ou não-CA).  
- `keyUsage` (operações permitidas).  
- `subjectAltName` (para certificados de servidor).  

Quer um exemplo completo para seu uso? Comente abaixo!