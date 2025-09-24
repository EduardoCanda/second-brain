---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
## 1️⃣ O que acontece quando usamos um **range vector**

- Um **[[instant-vector]]** é uma série temporal com **um único ponto de tempo** (ex.: `http_requests_total` avaliado agora).
    
- Um **range vector** (`metric[5m]`, por exemplo) é **uma coleção de múltiplos pontos de tempo** para cada série, dentro de um intervalo passado.
    
- Ou seja: `http_requests_total[5m]` retorna, **para cada série**, todos os valores coletados nos últimos 5 minutos.
    

💡 **Importante:** o _range vector_ não retorna “uma lista de instant vectors” no sentido literal. Ele retorna **um vetor de séries temporais, cada uma com um conjunto de amostras no tempo** — o formato é diferente internamente.

---

## 2️⃣ De onde vem a quantidade de pontos no _range vector_?

A quantidade de amostras no resultado de um _range vector_ depende principalmente de dois fatores:

1. **Configuração do `scrape_interval` do Prometheus**
    
    - Exemplo: `scrape_interval: 15s` → um ponto a cada 15 segundos.
        
    - No intervalo de 5 minutos (`[5m]`), você terá aproximadamente `5 min × 60 s / 15 s = 20 pontos` por série.
        
2. **Retenção real dos dados pelo alvo**
    
    - Se o alvo só começou a expor métricas há 2 minutos, um _range vector_ de 5 minutos terá menos pontos.
        
    - Se houver falhas de coleta, haverá “buracos” no intervalo.
        

---

## 3️⃣ Conversão de _range vector_ em _instant vector_

Para visualizar ou operar sobre esses dados, muitas funções no Prometheus transformam _range vectors_ em _instant vectors_ aplicando agregações.  
Por exemplo:

```promql
rate(http_requests_total[5m])
```

- O `rate()` pega o _range vector_ (`[5m]`) e calcula uma **única taxa instantânea** por série — isso **vira um instant vector**.
    

---

✅ **Resumo:**

- **Range vector** = múltiplos pontos no tempo para cada série, dentro de um intervalo.
    
- Não é “lista de instant vectors”, mas sim “um conjunto de amostras por série”.
    
- A **quantidade de pontos** depende do `scrape_interval` e da disponibilidade de dados.
    

---

Se você quiser, posso te mostrar um **desenho de como o Prometheus monta internamente um range vector e como isso vira um instant vector com funções como `rate()`**. Isso deixa bem claro o que é cada coisa. Quer que eu faça?