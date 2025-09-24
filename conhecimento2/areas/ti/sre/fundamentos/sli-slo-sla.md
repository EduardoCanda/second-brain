---
tags:
  - Fundamentos
  - SRE
  - NotaBibliografica
---
## 🧠 **O que são SLI, SLO e SLA?**

Esses três termos estão relacionados à **medição e definição de qualidade de serviço**.

| Termo | Significado | Papel |
| --- | --- | --- |
| **SLI** | **Service Level Indicator** | Métrica real medida |
| **SLO** | **Service Level Objective** | Meta técnica interna |
| **SLA** | **Service Level Agreement** | Compromisso formal com cliente |

---

## 🔍 **1. SLI (Service Level Indicator)**

> É o indicador real e mensurável da performance ou disponibilidade de um serviço.
> 

### 🔧 Exemplo:

- Latência média de requisições: `p95 < 300ms`
- Taxa de erro: `1 - (2xx + 3xx) / total`
- Disponibilidade: `99.95%` de uptime no último mês

🧠 *"O SLI mostra o que realmente aconteceu."*

---

## 🎯 **2. SLO (Service Level Objective)**

> É o objetivo interno (meta) que a equipe define com base no SLI — geralmente mais rigoroso do que o SLA.
> 

### 🔧 Exemplo:

- “Nosso SLO é responder 95% das requisições em até 200ms”
- “Ter no máximo 0.01% de erros por semana”

🧠 *"O SLO é o alvo técnico que buscamos atingir."*

---

## 📜 **3. SLA (Service Level Agreement)**

> É o acordo formal (contratual ou de negócio) com o cliente, baseado nos SLOs, e costuma incluir penalidades se não for cumprido.
> 

### 🔧 Exemplo:

- “Garantimos 99.9% de disponibilidade mensal — abaixo disso há abatimento na fatura”
- “Em caso de indisponibilidade por mais de 30 minutos, há notificação automática e escalonamento”

🧠 *"O SLA é o que prometemos ao cliente — e pode ter multa."*

---

## 🔁 **Como se relacionam:**

> SLI é o que você mede
> 
> 
> **SLO** é o que você **espera atingir**
> 
> **SLA** é o que você **promete formalmente**
> 

---

## 🧠 **Exemplo prático (serviço bancário PJ):**

### 🔹 SLI:

- `99.92%` de disponibilidade no endpoint `/pagamentos`

### 🔹 SLO:

- Meta interna de `99.95%` de uptime mensal
- `p95 de latência` abaixo de 300ms

### 🔹 SLA:

- Contrato com clientes PJ de que o sistema estará disponível em **99.9% do mês**
- Penalidade financeira se ficar fora do ar mais de 43 minutos no mês

---

## 📊 **Por que isso é importante em SRE/arquitetura?**

- Ajuda a **priorizar engenharia de confiabilidade**
- Serve de base para **error budget** (quantos erros são aceitáveis)
- Alinha expectativas entre **negócio, engenharia e cliente**

---

## ✅ **Conclusão para entrevista**

> “SLI é o indicador real de qualidade de serviço, como latência ou taxa de erro. SLO é o objetivo técnico que definimos com base nesses indicadores, geralmente mais rigoroso que o contrato. E SLA é o compromisso formal com o cliente, que pode gerar penalidades se descumprido. Já usei essa estrutura para definir metas de confiabilidade de APIs bancárias, onde tínhamos SLOs internos agressivos para garantir SLAs robustos com clientes PJ sensíveis a downtime.”
> 

### Como sair de um monitoramento reativo para um proativo?
