---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
**JWT** (JSON Web Token) é um **formato de token** usado para transmitir informações entre duas partes de forma **segura**, **compacta** e **auto-contida**. Ele é amplamente usado para [[autenticacao-autorizacao|autenticação e autorização]] em aplicações web e APIs.

---

## 🧠 Teoria e Filosofia por trás do JWT

### 1. **Transporte de Identidade Segura e Compacta**

O JWT parte do princípio de que informações como identidade de um usuário ou permissões de acesso podem ser transportadas de forma confiável e verificável **sem precisar de consultas constantes ao banco de dados ou sessão de servidor**.

### 2. **Auto-contido (self-contained)**

Toda a informação necessária para validar um usuário está contida **dentro do próprio token** — isso reduz a necessidade de armazenar estados do lado do servidor (sessionless).

### 3. **Desacoplamento**

JWT é um mecanismo que permite **desacoplar autenticação e autorização do servidor**, o que favorece arquiteturas distribuídas como **microserviços** e **serverless**.

---

## ⚙️ Como funciona um JWT?

Um JWT é composto de **três partes** separadas por ponto (`.`):

`HEADER.PAYLOAD.SIGNATURE`

### 1. **Header** (Cabeçalho)

Contém o tipo do token e o algoritmo de assinatura, normalmente algo como:

`{   "alg": "HS256",   "typ": "JWT" }`

### 2. **Payload** (Corpo)

Contém as **informações (claims)**. Por exemplo:

`{   "sub": "1234567890",   "name": "João da Silva",   "admin": true,   "exp": 1712345678 }`

Alguns campos comuns:

- `sub`: subject (identificador do usuário)
- `exp`: expiration (timestamp de expiração)
- `iat`: issued at (quando foi emitido)
- `roles`: funções/autorizações do usuário    

### 3. **Signature** (Assinatura)

Usa uma chave secreta (ou par de chaves no caso de algoritmos assimétricos) para gerar um hash assinado:

`HMACSHA256(   base64UrlEncode(header) + "." + base64UrlEncode(payload),   segredo )`

Essa assinatura serve para garantir que o token **não foi alterado**.

---

## 🔐 Segurança

- JWTs não são criptografados por padrão — eles são apenas **assinados**. Isso significa que qualquer um pode ler o conteúdo do token (mas não pode alterá-lo sem invalidar a assinatura).

- Para proteger a confidencialidade, pode-se usar **JWTs criptografados ([[JWE]])**, mas é menos comum.

- A segurança depende **da confidencialidade da chave secreta**.

---

## ✅ Fluxo típico de uso

1. O usuário faz **login** com credenciais.

2. O servidor **gera um JWT** contendo informações do usuário.

3. O JWT é enviado ao cliente (geralmente via cabeçalho `Authorization: Bearer`).

4. O cliente envia o JWT em cada requisição.

5. O servidor **valida a assinatura** do JWT e confia nas informações dentro dele — sem acessar banco ou sessão.

6. Se o token expirar ou for inválido, o servidor rejeita a requisição.


---

## 📚 Vantagens

- Stateless: não exige armazenamento em sessão no servidor.
- Escalabilidade: ideal para arquiteturas distribuídas.
- Portabilidade: pode ser usado entre domínios e serviços.
- Agilidade: menos consultas ao banco = mais rápido.

---

## ⚠️ Desvantagens e Cuidados

- Tokens não podem ser revogados facilmente (diferente de sessões).
- Como não há estado, revogação exige outras estratégias (listas de revogação, tokens curtos + refresh).
- Nunca armazene JWTs sensíveis no localStorage (risco de XSS).

---

## 🧘 Filosofia por trás do JWT

O JWT segue uma filosofia que valoriza:

- **Transparência e integridade dos dados**: as informações estão claras no token, mas são protegidas contra adulterações.
- **Descentralização**: o emissor do token não precisa ser o mesmo que o validador.
- **Performance e escalabilidade**: evitar dependência de sessões e bancos.

Detalhes sobre a especificação do JWT [[JOSE]]