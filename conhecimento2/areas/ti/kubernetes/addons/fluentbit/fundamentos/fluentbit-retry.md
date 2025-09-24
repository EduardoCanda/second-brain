---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
# 1) Objetivo

Entender como o [[fluentbit|Fluent Bit]] **re-tenta** enviar chunks quando um **OUTPUT falha** (ex.: Loki fora), o que controla **quantas vezes** tenta, **quando descarta**, e como ajustar para **não perder logs**.

---

# 2) Como o retry funciona (linha do tempo)

1. **Chunk pronto** → o engine agenda para envio (no pulso do **Flush**).
    
2. **OUTPUT tenta** enviar o chunk e devolve um **status** ao engine:
    
    - **OK** → chunk confirmado (apagado da fila).
        
    - **RETRY** → falha **transitória** (rede, 5xx, 429…). O engine **agenda nova tentativa** com _backoff_.
        
    - **NO_RETRY** → falha **permanente** (ex.: payload inválido, 4xx “definitivo”). O chunk é **descartado na hora**.
        
3. **Contagem de retries**: a cada RETRY, incrementa um contador.
    
    - Se **atingir o limite**, o engine **descarta** o chunk (para não acumular eternamente).
        
    - Se **o limite for desativado**, o engine **nunca descarta por expiração**: fica tentando até o destino voltar.
        
4. **Storage**: enquanto aguarda, o chunk fica na **fila** (RAM e/ou **disco**, conforme você configurou).
    

> Pense: _“OK = some, RETRY = tenta de novo, NO_RETRY = joga fora agora.”_

---

# 3) O que decide **RETRY** vs **NO_RETRY**?

Depende do **plugin de saída** (Loki/HTTP/ES…). Em geral:

- **RETRY (transitório)**: erros de **rede**, timeouts, **5xx**, e normalmente **429** (rate limit).
    
- **NO_RETRY (permanente)**: **4xx** que indicam problema no **seu payload/config** (ex.: corpo inválido, labels proibidas, tamanho maior que o permitido).
    
    > Mesmo com `Retry_Limit False`, um **NO_RETRY** _ainda_ **descarta** o chunk (é “irrecuperável” para o plugin).
    

---

# 4) Alavancas de configuração (o que importa)

## No **OUTPUT** (por destino)

- **`Retry_Limit`**
    
    - **Padrão**: `1` (ou seja, 1 re-tentativa e **descarta** na 2ª falha).
        
    - **Recomendado para alta durabilidade**: `Retry_Limit False` (_sem limite_).
        
    - Use um número **finito** quando você **quer** limitar o backlog (e aceita perder após N falhas).
        
- **`workers N`** (quando suportado)
    
    - Paraleliza o envio de **vários chunks** em paralelo → drena mais rápido quando o destino volta.
        
- Outras opções do plugin (ex.: **keepalive**, **compressão**) ajudam na eficiência do escoamento.
    

## No **SERVICE** (engine)

- **`Flush N`**: ritmo de tentativas (quanto menor, mais rápido você re-tenta; quanto maior, mais “lotes”).
    
- **`Grace N`**: janela para **drenar a fila** ao terminar o Pod (graceful shutdown).
    
- **`storage.*`**: define como/onde a fila vive (RAM vs **disco**).
    

## No **INPUT**

- **`storage.type filesystem`**: chunks **duráveis** (nascem no disco).
    
- **`storage.type memory`**: chunks só em RAM (perdem em restart).
    
- **`storage.pause_on_chunks_overlimit`** + **`storage.max_chunks_up`**: se **ligado**, **pausa** o input ao atingir o teto de chunks “UP” (em memória). Útil para **proteger RAM**, mas não evita drop por _retry expirar_; apenas regula a entrada.
    

---

# 5) Como o retry conversa com **Flush** e **Storage**

- **Flush**: a cada batida (`Flush`), o engine verifica **chunks prontos** e **releases de backoff** (retries vencidos) para tentar de novo.
    
    - `Flush` **baixo (1s)** → re-tenta **mais rápido** (latência menor).
        
    - `Flush` **mais alto (2–3s)** → menos chamadas ao destino (batches maiores).
        
- **Storage**: com `storage.path` + `storage.type filesystem`, os chunks em retry **ficam no disco** (persistem a restart do Pod).
    
    - Sem isso, ficam na **memória** e se perdem em restart/eviction.
        

---

# 6) Receitas (copiar/colar)

## A) **Durável** (não descarta por expirar retry)

```ini
[SERVICE]
    Flush 1
    storage.path /var/fluent-bit/state
    storage.sync normal

[INPUT]
    Name           tail
    storage.type   filesystem
    DB             /var/fluent-bit/state/tail.db
    DB.Sync        normal

[OUTPUT]
    Name        loki
    Match       kube.*
    Host        loki-gateway.loki.svc.cluster.local
    Port        80
    URI         /loki/api/v1/push
    Line_Format json
    Retry_Limit False      # ← tentativas infinitas (não descarta por expiração)
```

## B) **Controlado** (limita disco conscientemente)

```ini
[OUTPUT]
    Name        loki
    ...
    Retry_Limit False
    storage.total_limit_size  20G   # ← quando lotar, descarta o chunk mais antigo (política LRU)
```

> Use quando você **precisa** de um teto de disco por destino. Ao atingir, haverá **perda** (a mais antiga), mas **controlada**.

## C) **Proteção de RAM** (com pausa — usar com consciência)

```ini
[SERVICE]
    storage.path /var/fluent-bit/state
    storage.max_chunks_up 128
[INPUT]
    Name           tail
    storage.type   filesystem
    storage.pause_on_chunks_overlimit On   # pausa o input ao bater o teto de UP
```

> Em `tail`, geralmente seguro; em inputs de **rede**, pode **perder** eventos (o emissor segue enviando).

---

# 7) Validação (mão na massa)

1. **Derrube o destino** (ex.: delete/scale-to-zero o `loki-gateway`).
    
2. **Gere logs** (busybox loop).
    
3. **Observe storage** crescendo:
    

```bash
POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
kubectl -n logging exec -it "$POD" -- sh -lc 'du -sh /var/fluent-bit/state; find /var/fluent-bit/state -maxdepth 2 -type f | wc -l'
```

4. **Veja os sinais de retry**:
    

```bash
kubectl -n logging logs "$POD" --tail=200 | egrep -i 'retry|flush chunk|cannot flush|backoff'
```

5. **Traga o destino de volta** → o backlog **drena**; você verá `workers` enviando e o diretório diminuindo.
    
6. (Opcional) **Métricas** via `:2020/api/v1/metrics/prometheus` e `/api/v1/storage` (contadores de retries, chunks em memória vs disco).
    

---

# 8) Troubleshooting (sintoma → causa → correção)

|Sintoma|Causa provável|O que fazer|
|---|---|---|
|**Chunks “somem” com destino fora**|`Retry_Limit` **padrão** (1 → expira e descarta)|Defina `Retry_Limit False` no OUTPUT|
|**Ainda há perda com `Retry_Limit False`**|OUTPUT retornou **NO_RETRY** (ex.: 4xx permanente)|Corrija payload/config (labels/tamanho); evite cardinalidade alta; valide resposta do destino|
|**Backlog não cresce em disco**|`storage.type` = memory **ou** sem `storage.path`|Use `storage.type filesystem` + `storage.path` (hostPath)|
|**Oscilação pausa/retoma**|`pause_on_chunks_overlimit On` + `max_chunks_up` baixo|Desligue o pause **ou** aumente `max_chunks_up`|
|**Disco do nó enche**|Sem teto e destino ficou fora muito tempo|Ou traga o destino de volta, ou defina **teto** (`storage.total_limit_size`) + alertas|
|**Latência alta quando volta**|Poucos `workers`/Flush alto|Aumente `workers`, reduza `Flush`, ative keepalive/compressão|

---

# 9) Boas práticas (resumo operativo)

- **Crítico não perder**? → `Retry_Limit False` + **storage em disco** (hostPath) + monitorar **espaço**.
    
- **Aceita limitar disco**? → Use `storage.total_limit_size` no OUTPUT (entendendo que descarta a **mais antiga** quando alcançar).
    
- **Previna NO_RETRY**: mantenha labels/tamanho sob controle (principal em Loki), valide 4xx do destino.
    
- **Drene bem**: `workers` no output, `Flush` 1–2s, keepalive.
    
- **Proteja RAM, sem serrilhado**: evite `pause_on_chunks_overlimit` a menos que saiba por que precisa; se usar, dê um **teto** realista (`max_chunks_up ≥ 128`).
    

---

Se quiser, faço um **diff** do seu `values.yaml` adicionando `Retry_Limit False` (e `workers 2`), e te passo **comandos de observação** (logs/metrics/storage) para ver o retry atuando — tanto com o Loki fora quanto no momento em que ele volta.