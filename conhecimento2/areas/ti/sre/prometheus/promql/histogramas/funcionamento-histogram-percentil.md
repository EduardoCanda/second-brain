---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
---
boa! primeiro, só alinhando o nome: em [[PromQL]] a função é **`histogram_quantile(φ, …)`** (não “histogram_percentil”). Ela calcula um quantil **estimado** a partir de **buckets acumulativos (`le`)** usando **interpolação linear dentro do bucket**. Eis a ideia:

# Como o `histogram_quantile` calcula o percentil

1. Você fornece as **taxas/contagens por bucket cumulativo** (normalmente `sum by (le, …)(rate(..._bucket[5m]))`).
    
2. Ele soma tudo (valor no `le="+Inf"`) → **T** = total de observações no período.
    
3. Calcula a **posição-alvo** do quantil: **N = φ · T** (ex.: p95 → 0,95·T).
    
4. Acha o **primeiro bucket** cujo acumulado **≥ N**.
    
    - `left` = limite inferior do bucket (o `le` do bucket anterior)
        
    - `right` = limite superior (o `le` do bucket corrente)
        
    - `prev` = acumulado do bucket anterior
        
    - `inBucket` = acumuladoAtual − acumuladoAnterior (qtd. _dentro_ do bucket)
        
5. **Interpola linearmente** supondo distribuição **uniforme** dentro do bucket:
    
    ```
    r = (N − prev) / inBucket         # fração dentro do bucket (0..1)
    quantil ≈ left + r · (right − left)
    ```
    

> Se `inBucket == 0`, o valor cai exatamente no limite do bucket (não há como interpolar).  
> Se o alvo cai no `+Inf`, significa que seu quantil está **além do maior limite finito** — sinal para **adicionar um bucket mais alto**.

---

# Exemplo numérico (com seus buckets [[sli-slo-sla|SLO]])

Buckets (em **segundos**) nos últimos 5m, agregados (valores cumulativos):

```
le="0.1": 130
le="0.2": 260
le="0.3": 410
le="0.5": 470
le="1":   497
le="+Inf":500   => T = 500 observações
```

**p95** → φ=0.95 → **N = 0.95·500 = 475**

O primeiro acumulado ≥ 475 é o **le="1" (497)**.  
Bucket anterior: **le="0.5" (470)**.

- `left=0.5`, `right=1.0`
    
- `prev=470`, `inBucket=497−470=27`
    
- `r=(475−470)/27 = 5/27 ≈ 0,1852`
    
- **quantil ≈ 0,5 + 0,1852·(1,0−0,5) = 0,5926 s** → **~593 ms**
    

Query equivalente:

```promql
histogram_quantile(
  0.95,
  sum by (le) (rate(http_server_requests_seconds_bucket[5m]))
)
```

---

# Por que os limites influenciam tanto

- **Buckets largos** ⇒ a interpolação dentro dele pode “chutar” para qualquer lugar do intervalo → **quantil mais grosso**.
    
- **Buckets mais finos perto do p95/p99** ⇒ **estimativa bem mais precisa**.
    
- Se o p99 vive caindo no **`+Inf`**, adicione um bucket logo acima do seu p99 esperado.
    

---

# Dicas práticas

- Para SLO de, digamos, **300 ms**, **tenha um bucket em 0.3s** e mais 1–2 acima e abaixo (ex.: 0.2, **0.3**, 0.5, 1).
    
- Use sempre:
    
    ```promql
    histogram_quantile(
      0.95,
      sum by (le, <dimensões que você quer manter>) (rate(<metric>_bucket[5m]))
    )
    ```
    
    (se esquecer o `le` no `sum by`, o resultado fica incorreto)
    
- Tráfego baixo? aumente a janela `[range]` (ex.: 15–30m) para estabilizar.
    