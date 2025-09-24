---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria: computacao
---
## 🔹 ECS com **Fargate**

### ✅ **Resposta direta:**

No ECS com **Fargate**, você **não precisa instalar o CloudWatch Agent**.

O próprio Fargate já **coleta e envia automaticamente** as métricas de:

- `CPUUtilization`
- `MemoryUtilization`

Essas métricas ficam disponíveis no **CloudWatch** e podem ser usadas diretamente em **políticas de Auto Scaling**.

### ⚙️ **Como configurar:**

1. Crie um ECS Service com `launchType: FARGATE`
2. Defina:
    - CPU e memória **por task** (ex: 512MiB, 1 vCPU)
    - Mínimo e máximo de tasks (ex: 2–10)
3. Crie uma **Target Tracking Scaling Policy**:
    - Métrica: `ECSServiceAverageMemoryUtilization`
    - Alvo: ex. `75%`
4. O ECS/Fargate ajustará automaticamente o número de tasks conforme a média de uso de memória.

> ✅ Simples, gerenciado e sem necessidade de agentes.
> 
> 
> ⚠️ Opcionalmente, você pode ativar o **Container Insights** para obter métricas mais detalhadas (rede, disco, init latency), sem precisar instalar nada.
> 

---

## 🖥️ ECS com **EC2**

### ✅ **Resposta direta:**

No ECS com EC2, **você precisa instalar e configurar o CloudWatch Agent nas instâncias EC2** para coletar **métricas de memória**.

Sem isso, o CloudWatch **só terá métricas de CPU**.

---

### 🔧 **Por que precisa do agent?**

- ECS EC2 **não coleta métricas de memória nativamente**
- O CloudWatch Agent permite coletar dados como:
    - `mem_used_percent`
    - `mem_available`
- Essas métricas são então publicadas como métricas customizadas no CloudWatch

---

### ⚙️ **Como configurar:**

1. Instale o CloudWatch Agent nas instâncias EC2 do cluster (via SSM, UserData ou AMI customizada)
2. Configure com um `config.json`, por exemplo:

```json
json
CopiarEditar
{
  "metrics": {
    "namespace": "Custom/ECS",
    "metrics_collected": {
      "mem": {
        "measurement": ["mem_used_percent"],
        "metrics_collection_interval": 30
      }
    }
  }
}

```

1. Garanta permissões IAM na instance role:
    - `cloudwatch:PutMetricData`
2. Crie um **alarme de CloudWatch** com base na métrica customizada (ex: `mem_used_percent`)
3. Configure o **Service Auto Scaling** do ECS para escalar as tasks com base nessa métrica

---

### ⚠️ **E o Cluster Auto Scaling (CAS)?**

Além de escalar as tasks, no ECS EC2 você precisa garantir que existam **instâncias EC2 suficientes** para suportar novas tasks.

### Passos:

- Crie um **Auto Scaling Group**
- Crie um **Capacity Provider** com esse ASG
- Ative o **managed scaling** no ECS
- O ECS CAS aumentará o número de EC2s **quando não houver memória suficiente** para agendar novas tasks

---

## 📊 **Resumo final:**

|  | ECS com **Fargate** | ECS com **EC2** |
| --- | --- | --- |
| Métrica de memória pronta | ✅ Sim (CloudWatch padrão) | ❌ Não (precisa de CloudWatch Agent) |
| Instalar agent? | ❌ Não necessário | ✅ Necessário para coletar `MemoryUtilization` |
| Auto Scaling de tasks | ✅ Sim, via `ECSServiceAverageMemoryUtilization` | ✅ Sim, com métrica customizada ou Container Insights |
| Auto Scaling de instâncias | ❌ Fargate gerencia infra | ✅ Com Capacity Providers e Auto Scaling Group |
| Complexidade | Baixa (serverless) | Alta (infra + agent + métricas customizadas) |

---

## ✅ **Conclusão para entrevista**

> “Para escalar o ECS por uso de memória, a abordagem varia conforme o tipo de execução. Com Fargate, o uso de memória já é monitorado nativamente pelo CloudWatch, então posso configurar o Auto Scaling diretamente com base em MemoryUtilization, sem instalar agentes. Já no modo EC2, preciso instalar e configurar o CloudWatch Agent para coletar métricas de memória, pois elas não são disponibilizadas por padrão. Também é necessário configurar o Cluster Auto Scaling com Capacity Providers para garantir que o número de instâncias EC2 acompanhe o crescimento das tasks. Já implementei ambas as abordagens, priorizando Fargate para simplicidade e EC2 para workloads que exigem mais controle de performance e custo.”
> 

### Quais são os principais Design Patterns?
