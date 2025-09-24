---
tags:
  - Segurança
  - Fundamentos
  - NotaBibliografica
---
## 🔐 **Qual é a diferença entre um token opaco e um JWT?**

---

### 🧱 **1. JWT (JSON Web Token)**

É um **token estruturado e auto-contido**, geralmente em formato **Base64**, composto de três partes:

```
css
CopiarEditar
header.payload.signature

```

Cada token JWT:

- Pode ser **lido e validado localmente** (sem chamada ao Authorization Server)
- Contém **informações codificadas**, como:
    - `sub`: ID do usuário
    - `exp`: data de expiração
    - `scope`: permissões
    - `iss`: quem emitiu
    - claims customizadas (ex: `tenant_id`, `role`, etc.)

### ✅ Vantagens:

- **Validação local (stateless)** → mais rápido, ideal para APIs
- **Transparência de dados** → permite debug e auditoria rápida
- **Escalabilidade**: sem necessidade de consultar o servidor

### ❌ Desvantagens:

- **Não pode ser revogado facilmente** (a menos que se use uma blacklist ou short TTL)
- **Maior tamanho** (transporta dados no payload)
- Se mal configurado, **pode vazar informações sensíveis**

---

### 🕳️ **2. Token Opaco**

É um **token opaco para o cliente e para o backend** — geralmente uma **string aleatória (GUID ou hash)** que **não carrega informação legível**.

> Ele precisa ser validado no Authorization Server via introspecção (/introspect endpoint), que verifica se está ativo, a quem pertence, quais escopos tem, etc.
> 

### ✅ Vantagens:

- **Mais seguro por padrão** (sem payload exposto)
- Pode ser **revogado a qualquer momento**
- Tamanho geralmente menor

### ❌ Desvantagens:

- **Validação requer chamada extra ao Authorization Server** (overhead)
- **Menor escalabilidade** (mais dependência de estado e de rede)

---

## 🧠 **Comparação direta**

| Característica | JWT (JSON Web Token) | Token Opaco |
| --- | --- | --- |
| **Formato** | Estruturado (Base64, legível) | Aleatório, ilegível |
| **Validação** | Local (via assinatura) | Remota (via introspecção) |
| **Autocontido** | Sim | Não |
| **Permite revogação fácil** | Não (sem estratégia adicional) | Sim |
| **Desempenho** | Alto (stateless) | Mais lento (requere I/O) |
| **Tamanho do token** | Maior | Menor |
| **Risco de vazamento** | Maior, se mal configurado | Menor |
| **Ideal para** | APIs internas, validação rápida | Integrações sensíveis, alta segurança |

---

## 🧩 **Quando usar cada um?**

### 🟢 **Use JWT quando:**

- Precisa de **validação rápida** e **offline**
- Quer evitar dependência do Authorization Server para cada requisição
- Pode viver com tokens curtos e/ou implementar blacklist de revogação

### 🟢 **Use token opaco quando:**

- Precisa de **revogação imediata** (ex: logout de cliente)
- Está lidando com **integrações sensíveis** ou **clientes de terceiros**
- Precisa de controle centralizado da sessão ou do escopo em tempo real

---

## 🧠 **Exemplo prático no setor bancário**

> Em APIs públicas voltadas a parceiros (como Open Banking), usamos tokens opacos, pois precisamos garantir que qualquer revogação (por parte do usuário ou do regulador) tenha efeito imediato.
> 

> Já em APIs internas de microsserviços, usamos JWT com curta duração, permitindo validação rápida e eficiente sem chamada extra ao Auth Server.
> 

---

Para um detalhamento maior sobre os conceitos acesse [[JWT Fundamentos|aqui]]


## ✅ Conclusão para entrevista

> “A principal diferença entre JWT e token opaco está na forma como são validados e no nível de autonomia que oferecem. O JWT é autocontido, validável localmente e ideal para cenários de alta performance. Já o token opaco é uma chave de referência que exige introspecção, sendo mais seguro e revogável. Já usei ambos em projetos: JWT para sistemas internos com controle de TTL e tokens opacos para ambientes regulados e públicos onde a revogação e a rastreabilidade são obrigatórias.”
> 