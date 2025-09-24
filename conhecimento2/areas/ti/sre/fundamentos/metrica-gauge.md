---
tags:
  - Fundamentos
  - SRE
  - NotaBibliografica
---
## 🎯 **O que é uma métrica do tipo Gauge?**

Uma **gauge** é um tipo de métrica que representa **um valor que pode subir ou descer ao longo do tempo**.

Ou seja, **reflete o estado atual de algo em um dado momento**.

> Exemplo prático: "uso de memória agora é 63%"
> 

---

## 🧩 **Características principais de uma Gauge:**

| Característica | Valor |
| --- | --- |
| Varia ao longo do tempo | ✅ Sim (pode subir e descer) |
| Indica estado atual | ✅ Sim |
| Acumulativa | ❌ Não necessariamente |
| Ideal para | Recursos, temperatura, contagens momentâneas |

---

## 🔍 **Exemplos comuns de Gauge:**

- **Uso de memória (em MB ou %)**
- **CPU atual**
- **Número de conexões ativas**
- **Quantidade de tarefas pendentes em uma fila**
- **Tamanho atual de um pool de conexões**
- **Número de instâncias em execução**

🧠 *A gauge representa o “agora” — como um velocímetro do sistema.*

---

## 🆚 **Comparativo com outros tipos de métrica:**

| Tipo | Exemplo | Sobe e desce? | Acumulativo? | Ideal para... |
| --- | --- | --- | --- | --- |
| **Gauge** | `memory_usage_bytes` | ✅ | ❌ | Recursos atuais, estados flutuantes |
| **Counter** | `http_requests_total` | ❌ (só sobe) | ✅ | Contar eventos |
| **Histogram** | `request_duration_seconds_bucket` | ✅ | ✅ | Distribuição de valores |
| **Summary** | `request_duration_quantile` | ✅ | ✅ | Percentis (p95, p99) |

---

## 📦 **Uso em [[prometheus]] / [[grafana]] / CloudWatch:**

- Em **Prometheus**, a gauge é declarada com:
    
    ```go
    go
    CopiarEditar
    prometheus.NewGauge(prometheus.GaugeOpts{ ... })
    
    ```
    
- Em **CloudWatch**, métricas como `CPUUtilization`, `MemoryUtilization` e `ConcurrentExecutions` são do tipo gauge.
- No **Grafana**, gauges são também um tipo de visualização (widget), mas no contexto da métrica, ela representa **qualquer valor que flutua no tempo**.

---

## 🧠 **Exemplo bancário realista:**

> Monitorando o serviço de liberação de crédito PJ:
> 
> - A métrica `pending_proposals` é uma **gauge** que mostra quantas propostas estão em análise agora
> - Se o número subir acima de 100, acionamos um **alerta proativo** para escalar workers automaticamente

---

## ✅ **Conclusão para entrevista**

> “Uma gauge é uma métrica que representa o valor atual de algo que pode subir ou descer, como uso de memória, conexões ativas ou quantidade de mensagens em uma fila. Uso gauges para acompanhar a saúde instantânea dos serviços, configurar alertas com base em limiares e acionar respostas automáticas. Já trabalhei com gauges tanto em Prometheus quanto CloudWatch, monitorando serviços bancários com dashboards no Grafana.”