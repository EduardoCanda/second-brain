---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: hibrido
cloud_provider: aws
---
### 🌍 O que são **AZs (Availability Zones)** na AWS?

**AZs** são **zonas de disponibilidade** — ou seja, **data centers fisicamente separados** dentro de uma mesma **região AWS**. Elas existem para oferecer **alta disponibilidade**, **resiliência** e **redundância** para suas aplicações.

---

### ✅ Características das AZs:

- Cada **região** da AWS (como `us-east-1` ou `sa-east-1`) tem **duas ou mais AZs**.
    
- As AZs dentro de uma mesma região são **fisicamente separadas**, mas **próximas o suficiente** para ter **baixa latência** na comunicação entre elas.
    
- Cada AZ tem **infraestrutura de energia, rede e conectividade independentes**, para evitar que uma falha afete outras.
    

---

### 🧭 Exemplo prático:

A região `sa-east-1` (São Paulo) pode ter:

- `sa-east-1a`
    
- `sa-east-1b`
    
- `sa-east-1c`
    

Cada uma dessas é uma AZ — ou seja, um ou mais data centers separados, mas interligados.

---

### 🔗 Como isso se relaciona com VPC e Subnets?

- Quando você cria **subnets** em uma VPC, você **especifica uma AZ** para cada subnet.
    
- Isso permite que você distribua seus recursos entre diferentes AZs, aumentando a **tolerância a falhas**.
    

💡 **Boa prática:** Para alta disponibilidade, crie subnets em **múltiplas AZs**. Por exemplo:

- Subnet pública em `sa-east-1a`
    
- Subnet pública em `sa-east-1b`
    
- Subnet privada em `sa-east-1a`
    
- Subnet privada em `sa-east-1b`
    

---

### 🧠 Resumo:

|Termo|Significado|
|---|---|
|AZ (Availability Zone)|Um ou mais data centers isolados dentro de uma região|
|Região|Uma área geográfica (ex: São Paulo, Virgínia)|
|Importância|Alta disponibilidade, tolerância a falhas|
|Relação com VPC/Subnet|Cada subnet é criada dentro de uma AZ específica|

---

Se quiser, posso montar um esquema visual com VPC, subnets e AZs para fixar melhor. Deseja isso?