---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
### 🔁🔑 **2. Criptografia Assimétrica (ou de chave pública)**

> Usa duas chaves diferentes, porém matematicamente relacionadas:
> 
> - Uma **chave pública** (pode ser compartilhada)
> - Uma **chave privada** (mantenha em segredo)

---

### 📦 Características:

- Dados criptografados com a **chave pública** só podem ser descriptografados com a **chave privada**, e vice-versa
- Ideal para **troca segura de informações**, **assinatura digital**, **autenticação**
- É a base de **TLS/HTTPS**, **OAuth 2.0**, **PGP**, **assinatura de tokens (JWT)**

---

### ✅ Vantagens:

- **Não requer troca de segredos** → você pode publicar sua chave pública com segurança
- Permite **confidencialidade** e **autenticidade**, via **assinaturas digitais**
- Ideal para **infraestruturas distribuídas** (ex: APIs públicas, certificados)

---

### ❌ Desvantagens:

- **Mais lenta** que a simétrica (computacionalmente mais pesada)
- Geralmente usada para **criptografar apenas pequenos trechos de dados** (ex: chaves, hashes, tokens)

---

### 🧠 Exemplo prático:

> Quando alguém acessa um site bancário via HTTPS:
> 
> - O navegador recebe a **chave pública do servidor**
> - Usa essa chave para criptografar uma **chave simétrica temporária**
> - O servidor (com sua chave privada) descriptografa essa chave simétrica
> - A partir daí, a comunicação é feita com **criptografia simétrica AES**, mais rápida

---

## 🧩 **Comparativo direto**

| Característica            | Criptografia Simétrica               | Criptografia Assimétrica               |
| ------------------------- | ------------------------------------ | -------------------------------------- |
| **Número de chaves**      | 1 (mesma chave para ambos os lados)  | 2 (pública + privada)                  |
| **Velocidade**            | Muito rápida                         | Mais lenta                             |
| **Distribuição de chave** | Difícil (requer canal seguro)        | Fácil (chave pública pode ser aberta)  |
| **Escalabilidade**        | Baixa em ambientes com múltiplos nós | Alta, ideal para sistemas distribuídos |
| **Uso comum**             | Dados em repouso, S3, EBS, backups   | TLS, autenticação, assinatura digital  |

---

## 🔐 **Uso combinado (Híbrido)**

Na prática, os dois tipos são usados **juntos**:

> 🔑 A criptografia assimétrica é usada para trocar com segurança uma chave simétrica temporária, que então é usada para criptografar todos os dados da sessão (como em TLS/HTTPS).
> 

---

## ✅ **Conclusão para entrevista**

> “A criptografia simétrica usa uma única chave para criptografar e descriptografar, sendo muito rápida e eficiente, mas com desafio na distribuição da chave. Já a criptografia assimétrica usa um par de chaves pública e privada, facilitando o compartilhamento e permitindo assinatura digital, mas com maior custo computacional. Na prática, combinamos as duas: assimétrica para troca segura de chaves e simétrica para transferência eficiente de dados. Já utilizei esse modelo em sistemas com TLS, proteção de payloads em APIs, KMS da AWS e assinatura/verificação de tokens JWT.”
