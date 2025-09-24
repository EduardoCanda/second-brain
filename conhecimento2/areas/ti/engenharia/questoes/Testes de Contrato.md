---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
categoria: questoes
---
## Qual a sua abordagem para testes de contrato em integrações entre microsserviços?

### ✅ **Resposta completa:**

Em ambientes de microsserviços, **testes de contrato são essenciais para garantir que mudanças em um serviço não quebrem consumidores silenciosamente**. Eles reduzem o acoplamento indireto e promovem independência entre os times, sem sacrificar a confiança nas integrações.

---

### **Minha abordagem envolve 3 níveis de teste e 4 práticas principais:**

---

### **1. Tipos de contrato que valido**

- **Contrato de API (HTTP/gRPC):**
    - Verifico se os endpoints expostos atendem aos contratos esperados pelos consumidores.
    - Exemplo: status codes, estrutura do JSON, campos obrigatórios e tipos de dados.
- **Contrato de evento (event-driven):**
    - Garanto que mensagens publicadas em tópicos (Kafka, SNS) seguem o schema esperado.
    - Uso validações com **Avro/JSON Schema** ou DSLs específicas de contrato.
- **Contrato de consumo (consumer-driven contract):**
    - Cada consumidor define o que espera da resposta do produtor.
    - O produtor valida, no CI, se ainda atende a todos os consumidores — mesmo os que ele “não controla diretamente”.

---

### **2. Ferramentas e estratégias que utilizo**

- **Pact** (ou variantes como Spring Cloud Contract, Testcontainers + Schemas):
    - Consumidor publica contrato esperado.
    - Produtor baixa e valida os contratos dos consumidores.
    - Ambos os lados testam localmente e no CI/CD.
- Para eventos Kafka, uso:
    - **AsyncAPI** + Validações com Avro ou JSON Schema.
    - **Esquemas versionados** e testes automatizados contra o registry (ex: Confluent Schema Registry).

---

### **3. Integração com pipelines CI/CD**

- O teste de contrato é obrigatório no pipeline:
    - Do consumidor: **gera e publica** o contrato.
    - Do produtor: **baixa e valida** os contratos dos consumidores.
    - O build falha se qualquer contrato for quebrado.
- Isso garante **feedback rápido** e **desacoplamento controlado**.

---

### **4. Governança leve e versionamento**

- Padronizo versionamento de APIs e contratos (ex: `/v1/`, versionamento semântico).
- Crio diretórios centralizados com contratos versionados.
- Incentivo documentação via **OpenAPI/Swagger + testes de contrato** como base para validação.

---

### ✅ **Exemplo prático:**

Em uma arquitetura com microsserviços assíncronos em Kafka:

- O produtor publicava eventos com schemas Avro versionados.
- Os consumidores tinham validadores automáticos que rejeitavam mudanças com quebra de compatibilidade.
- No CI, toda mudança de schema só era permitida se mantivesse backward compatibility com o último schema publicado.

---

### ✅ Conclusão:

Testes de contrato não são só “testes técnicos” — eles representam **um contrato social entre serviços e squads**. Minha função como Staff é garantir que **essa confiança seja mantida por meio de automação, padronização e uma cultura de colaboração orientada a integrações seguras.**
