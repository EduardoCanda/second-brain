---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
**JWE (JSON Web Encryption)** é um padrão que define como criptografar e proteger dados no formato JSON, garantindo **confidencialidade** e **integridade** das informações. Ele faz parte do conjunto de padrões **[[JOSE]] (JSON Object Signing and Encryption)** e é amplamente usado em tokens seguros, como em APIs e autenticação.

---

### **Como o JWE funciona?**
O JWE criptografa um payload (conteúdo) e o representa em um formato compacto ou JSON, composto por cinco partes principais:

1. **Header (Cabeçalho)**  
   - Metadados sobre como a criptografia foi aplicada.
   - Exemplo:
     ```json
     {
       "alg": "RSA-OAEP",  // Algoritmo para criptografar a chave
       "enc": "A256GCM",   // Algoritmo para criptografar o conteúdo
       "kid": "chave-123"  // Identificador da chave
     }
     ```

2. **Encrypted Key (Chave Criptografada)**  
   - Uma chave simétrica (ex: AES) é gerada para criptografar o payload.
   - Essa chave é, por sua vez, criptografada com a chave pública do destinatário (se usar RSA).

3. **Initialization Vector (IV - Vetor de Inicialização)**  
   - Usado em algoritmos como AES-GCM para garantir que a criptografia seja única mesmo com dados repetidos.

4. **Ciphertext (Texto Criptografado)**  
   - O payload original (ex: um JSON) criptografado com a chave simétrica.

5. **Authentication Tag (Tag de Autenticação)**  
   - Garante a integridade do conteúdo (evita adulteração).

---

### **Formato do JWE**
O JWE pode ser representado de duas formas:

1. **Compact Serialization**  
   - Uma string codificada em Base64URL com as 5 partes separadas por pontos (`.`):
     ```
     BASE64URL(Header) + "." +
     BASE64URL(Encrypted Key) + "." +
     BASE64URL(IV) + "." +
     BASE64URL(Ciphertext) + "." +
     BASE64URL(Authentication Tag)
     ```

2. **JSON Serialization**  
   - Estrutura JSON para ambientes onde múltiplos destinatários são necessários:
     ```json
     {
       "protected": "BASE64URL(Header)",
       "recipients": [
         {"encrypted_key": "BASE64URL(Encrypted Key)"}
       ],
       "iv": "BASE64URL(IV)",
       "ciphertext": "BASE64URL(Ciphertext)",
       "tag": "BASE64URL(Authentication Tag)"
     }
     ```

---

### **Fluxo de Criptografia (Exemplo com RSA)**
1. **Remetente**:
   - Gera uma chave AES (ex: 256 bits) para criptografar o payload.
   - Criptografa a chave AES com a **chave pública RSA** do destinatário (`alg: RSA-OAEP`).
   - Criptografa o payload com AES-GCM (`enc: A256GCM`), gerando IV e tag.
   - Monta o JWE com as partes codificadas.

2. **Destinatário**:
   - Decodifica o JWE.
   - Usa sua **chave privada RSA** para descriptografar a chave AES.
   - Usa a chave AES para descriptografar o payload (`ciphertext`), validando a tag.

---

### **Quando usar JWE?**
- Proteger tokens JWT sensíveis (ex: tokens de acesso OAuth 2.0).
- Trocar mensagens seguras entre sistemas.
- Armazenar dados criptografados em bancos de dados.

---

### **Diferença entre JWE e JWS**
| **JWE**                            | **JWS**                       |
| ---------------------------------- | ----------------------------- |
| Criptografa o conteúdo             | Apenas assina o conteúdo      |
| Garante **confidencialidade**      | Garante **integridade**       |
| Usa chaves simétricas/assimétricas | Usa apenas assinatura digital |

---

### **Exemplo Prático (Pseudocódigo)**
```javascript
const jwe = require('jwe-toolkit');

// Criptografar
const payload = { user: "admin" };
const publicKey = "-----BEGIN PUBLIC KEY-----...";
const jweToken = jwe.encrypt(payload, publicKey, { alg: "RSA-OAEP", enc: "A256GCM" });

// Descriptografar
const privateKey = "-----BEGIN PRIVATE KEY-----...";
const decrypted = jwe.decrypt(jweToken, privateKey);
console.log(decrypted); // { user: "admin" }
```

---

### **Conclusão**
O JWE é uma forma padronizada de criptografar dados em JSON, combinando criptografia assimétrica (para troca de chaves) e simétrica (para o payload). É essencial em cenários onde a **privacidade** dos dados é crítica. 

Se precisar de mais detalhes sobre algoritmos ou implementações, posso explicar!