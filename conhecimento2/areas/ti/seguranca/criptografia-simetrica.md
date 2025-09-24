---
tags:
  - Segurança
  - Fundamentos
  - NotaBibliografica
---
### 🔁 **1. Criptografia Simétrica**

> A mesma chave é usada tanto para criptografar quanto para descriptografar os dados.
> 

---
### 📦 Características:

- Usa **um único segredo compartilhado** entre as partes
- É **muito rápida e eficiente**, ideal para grandes volumes de dados
- A segurança depende da **proteção da chave**
- Exemplos de algoritmos:
    - **AES (Advanced Encryption Standard)**
    - **DES**, **3DES**
    - **ChaCha20**

---

### ✅ Vantagens:

- **Alta performance** (baixa latência, ideal para dados em repouso ou em trânsito)
- Simples de implementar para comunicações ponto a ponto

---
### ❌ Desvantagens:

- **Distribuição da chave é um desafio** — precisa ser transmitida com segurança
- Não é ideal para **ambientes com múltiplas partes ou comunicação pública**

---

### 🧠 Exemplo prático:

> Criptografar arquivos no [[S3]] com uma chave AES-256, onde só o serviço autorizado possui a chave para descriptografar.
> 
