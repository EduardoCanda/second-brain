---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: iaas
cloud_provider: aws
---
# **Como Ajustar o Limite de Execuções Simultâneas no AWS Lambda**

O AWS [[Lambda Detalhes|Lambda]] tem um limite padrão de **1.000 execuções simultâneas** por conta AWS (em algumas regiões, pode ser menor). Se você precisa aumentar ou diminuir esse limite, siga este guia:

---

## **📌 Passos para Ajustar o Limite de Execuções Simultâneas**

### **1️⃣ Verifique o Limite Atual**
- Acesse o **AWS Lambda Console** → **"Account settings"** (Configurações da conta).
- Ou use o AWS CLI:
  ```bash
  aws lambda get-account-settings
  ```
  - O campo `"ConcurrentExecutionsLimit"` mostra o limite atual.

### **2️⃣ Solicite um Aumento (Se Necessário)**
Se precisar de mais de **1.000 execuções simultâneas**:
- **Via Console AWS**:
  1. Acesse o **AWS Support Center**.
  2. Escolha **"Create case"** → **"Service limit increase"**.
  3. Selecione **Lambda** e especifique o novo limite desejado.
  4. Justifique o aumento (ex.: picos de tráfego esperados).

- **Via AWS CLI** (opcional):
  ```bash
  aws service-quotas request-service-quota-increase \
    --service-code lambda \
    --quota-code L-B99A9384 \
    --desired-value 5000  # Novo limite desejado
  ```

### **3️⃣ Configure Reserved Concurrency (Opcional)**
Se quiser **reservar execuções para uma função específica** (evitando que outras funções consumam toda a capacidade):
- **No Console Lambda**:
  1. Selecione sua função → **"Configuration"** → **"Concurrency"**.
  2. Em **"Reserved concurrency"**, defina um valor (ex.: `100`).

- **Via AWS CLI**:
  ```bash
  aws lambda put-function-concurrency \
    --function-name minha-funcao \
    --reserved-concurrent-executions 100
  ```

### **4️⃣ Monitore o Uso**
- Use o **CloudWatch** para ver métricas como:
  - `ConcurrentExecutions` (execuções simultâneas ativas).
  - `Throttles` (tentativas de execução bloqueadas por limite).

---

## **🔹 Quando Ajustar o Limite?**
✅ **Aplicações com alto tráfego** (ex.: APIs com picos repentinos).  
✅ **Processamento em massa** (ex.: eventos SQS em grande volume).  
✅ **Evitar throttling** (erros `429 Too Many Requests`).  

---

## **⚠️ Cuidados Importantes**
- **Custos**: Mais execuções simultâneas = maior gasto (Lambda cobra por uso).  
- **[[Lambda Throttling|Throttling]]**: Se ultrapassar o limite, a AWS bloqueia novas execuções (`429`).  
- **Reserved Concurrency**: Se configurado, outras funções não poderão usar essa capacidade.  

---

## **📚 Documentação Oficial**
- [AWS Lambda Limits](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)  
- [Requesting a Quota Increase](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html)  

Precisa de ajuda para calcular o limite ideal? Posso ajudar com um exemplo! 🚀