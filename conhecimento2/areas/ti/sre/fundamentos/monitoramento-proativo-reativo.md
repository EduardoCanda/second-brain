---
tags:
  - Fundamentos
  - SRE
  - NotaBibliografica
---
## 🧠 **Como sair de um monitoramento reativo para um proativo?**

### 📌 Em resumo:

> Monitoramento reativo é quando você age só depois que o problema acontece (apagando incêndio).
> 
> 
> **Monitoramento proativo** é quando você **prevê, detecta e age antes de afetar o usuário ou o negócio**.
> 

---

## 🔄 **Evolução do reativo para o proativo:**

### 🔴 Reativo:

- Alertas disparam **apenas quando o serviço já está fora do ar** ou com erro 500
- Falta de visibilidade clara da causa
- Respostas manuais e com tempo alto de resolução (MTTR)
- Time age sob pressão, com foco em correção

### 🟢 Proativo:

- Detecta **[[sinais-degradacao-sistema|degradação de performance]] antes do incidente**
- Usa **métricas preditivas**, **análise de tendência**, e **dashboards com SLOs/SLIs**
- Tem alertas baseados em **sintomas e não só em falhas**
- Aplica **automação para correções antecipadas**
- Foco na **prevenção, confiabilidade e aprendizado contínuo**

---

## 🧰 **Como colocar isso em prática (técnica + processo):**

### ✅ 1. **Implementar SLIs e SLOs**

- Defina métricas que **realmente importam para o usuário final**, como:
    - `latência p95`
    - `taxa de erro`
    - `tempo de fila (SQS, Kafka)`
- Estabeleça SLOs com limites claros → *ex: "95% das requisições em até 300ms"*

---

### ✅ 2. **Alerta antecipado (sintomas, não só falhas)**

- Em vez de alertar só por 500, alerte quando:
    - Latência média ultrapassa SLO
    - Fila de mensagens começa a crescer
    - Memória ou CPU passa de 80% de uso por 5 minutos
- Use **percentis (p95/p99)**, não só médias

---

### ✅ 3. **Health checks sintéticos (canários)**

- Simule chamadas reais em endpoints críticos a cada minuto
- Detecte degradação antes do usuário final perceber

---

### ✅ 4. **Dashboards com contexto de negócio**

- Exiba **SLIs lado a lado com KPIs de negócio**
- Exemplo: queda no processamento de propostas + aumento de latência = atenção antes do cliente reclamar

---

### ✅ 5. **Automação de resposta (auto-healing)**

- Use **Lambda, Step Functions ou SSM** para:
    - Reiniciar serviços automaticamente
    - Escalar tasks ou pods ao detectar saturação
    - Encaminhar mensagens para DLQ antes que expirem

---

### ✅ 6. **Análise de tendências e capacidade**

- Use métricas históricas para prever:
    - Saturação de memória
    - Crescimento de fila
    - Estouro de limiares de SLO
- Baseie decisões de scaling e arquitetura nessas projeções

---

## 🧠 **Exemplo bancário prático:**

> Em uma API de aprovação de crédito, saímos de alertar só por falhas HTTP 500, para alertar quando:
> 
> - Latência p95 ultrapassava 250ms
> - O throughput de resposta caía abaixo do histórico
> - O uso de CPU de pods do EKS subia acima de 85% por mais de 3 minutos

Com isso, conseguimos **escalar proativamente, antecipar falhas e reduzir drasticamente o MTTR**.

---

## ✅ **Conclusão para entrevista**

> “Sair de um monitoramento reativo para um proativo exige mudar o foco de apenas reagir a incidentes para prevenir e antecipar falhas. Para isso, implantei SLIs e SLOs baseados na experiência do usuário, configurei alertas baseados em sintomas (como aumento de latência e saturação), adicionei health checks sintéticos e apliquei automações corretivas. Esse processo nos permitiu detectar problemas antes que impactassem o negócio e reduziu nosso tempo médio de resolução de forma significativa.”
> 

### O que é uma Gauge métrica?
