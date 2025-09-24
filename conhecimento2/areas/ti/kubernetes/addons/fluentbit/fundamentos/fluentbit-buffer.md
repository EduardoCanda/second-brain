---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
perfeito — vamos “no osso” sobre **buffer** no [[fluentbit|Fluent Bit]], em linguagem direta + passo a passo, com configs comentadas, validação e troubleshooting.

---

# 1) O que é “buffer” (ideia-chave)

**Buffer** é um **estacionamento temporário** de registros para **desacoplar** quem **produz** logs (inputs) de quem **consome** (outputs).  
Ele absorve **picos**, **quedas** de destino e **variações de velocidade** — evitando perda de logs.

> Em streaming, o produtor nunca para na mesma cadência que o consumidor. O buffer lida com esse “desencontro”.

---

# 2) Onde existem buffers no Fluent Bit

Pense em **4 camadas** (do mais próximo da origem até a entrega):

```
[INPUT buffer] → [CHUNKS/QUEUE do Engine] → [OUTPUT staging] → [SOCKET/OS]
```

1. **Buffer do INPUT (por instância)**
    
    - Controla o quanto o input pode **acumular em memória** antes de “pedir arrego”.
        
    - Chave principal: `Mem_Buf_Limit` (no `[INPUT]`).
        
    - No `tail`, junto com DB de offsets e `storage.type`, define comportamento sob pico.
        
2. **CHUNKS & QUEUE (storage do engine)**
    
    - Cada registro entra em um **chunk** (bloco MsgPack).
        
    - Os chunks formam a **fila**; são **flushed** periodicamente.
        
    - Chaves em `[SERVICE]`:
        
        - `storage.path` (diretório dos chunks no disco),
            
        - `storage.sync` (como sincroniza),
            
        - `storage.backlog.mem_limit` (limite de RAM para backlog).
            
    - Por input, você escolhe se o chunk **nasce** já no **disco** com `storage.type filesystem` (durável) ou **apenas na memória** (`memory`).
        
3. **Staging do OUTPUT**
    
    - Cada plugin de saída pode ter um pequeno buffer **próprio** (para formar payload, compactar, etc.).
        
    - Alguns têm knobs (ex.: `Buffer_Size` em `es/http`), `compress`, `workers`, `keepalive`.
        
4. **Buffer do SO do host (socket)**
    
    - Não configurado no Fluent Bit; é o buffer de kernel.
        

**Importante**: o **DB do `tail`** **não é** buffer; é um **catálogo de offsets** (para **retomar** de onde parou).

---

# 3) Como o buffer atua durante backpressure (linha do tempo)

1. **Inputs** geram registros → entram em **chunks**.
    
2. **Engine** dispara **flush** (a cada `Flush` s) → outputs tentam enviar.
    
3. **Destino lento/fora**:
    
    - Output responde `RETRY`; chunk volta à fila com **backoff**.
        
    - Se a fila cresce:
        
        - em **`filesystem`**, os chunks **ficam no disco** (duráveis);
            
        - em **`memory`**, a fila ocupa **RAM** (mais rápida, porém volátil).
            
    - Se o **`Mem_Buf_Limit`** do input estoura, o input **pausa** (“`input:tail paused (mem buf overlimit)`”) até liberar.
        

> Resultado: sem buffer, você perde logs; com buffer corretamente configurado, você **aguenta** picos e quedas e **drena** depois.

---

# 4) Configurações que definem o buffer (essenciais)

## Em `[SERVICE]` (fila global)

- `storage.path /var/fluent-bit/state` → **habilita** fila em **disco** (chunks duráveis).
    
- `storage.sync normal` → sincronização equilibrada (use `full` só se precisar de fsync agressivo).
    
- `storage.backlog.mem_limit 100M~500M` → teto de **RAM** que o engine usa antes de empurrar mais para o **disco**.
    
- (Relacionado) `Flush 1~3` → frequência de envio (batches menores/maiores).
    

## Em `[INPUT]` (como o input usa o buffer)

- `storage.type filesystem` → a fila **desse input** usa **disco** (recomendado em K8s/produção).  
    `memory` → só RAM (mais rápido, **não** sobrevive a restart).
    
- `Mem_Buf_Limit 20M~200M` → quanto o **input** pode manter **em RAM**.
    
- `DB /var/fluent-bit/state/tail.db` + `DB.Sync normal` (no `tail`) → **offsets** para **não reler** após restart/rotação.
    
- `Read_from_Head Off` / `Ignore_Older` → não sugar histórico gigante na partida (evita encher buffer logo no começo).
    

## Em `[OUTPUT]` (escoamento)

- **Batch/keepalive/compress/workers** (quando existentes) → escoam mais eficiente (menos pressão no buffer).
    
- Ex.: `workers 2` (se suportado), `compress gzip`, `keepalive On`.
    

---

# 5) K8s: onde esse buffer “mora” (muito importante)

- Se **não** montar nada, `storage.path` cai no **filesystem do container** → **efêmero** (perde ao recriar o Pod) e conta para **ephemeral-storage** (risco de eviction).
    
- **Recomendado (DaemonSet)**: montar **`hostPath`** para `/var/fluent-bit/state` → persiste no **nó** entre recriações do Pod e oferece I/O local (rápido).
    
- **`emptyDir`**: melhor que nada, mas some ao recriar o **Pod** (útil apenas para labs).
    
- **PVC remoto**: geralmente desnecessário (latência/IOPS piores).
    

---

# 6) Config de referência (comentada) — “buffer robusto”

Use com o chart que você já tem.

```yaml
# Monta o diretório de state no DISCO DO NÓ
extraVolumes:
  - name: state
    hostPath:
      path: /var/fluent-bit/state
      type: DirectoryOrCreate
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state

# (Opcional) reforce ephemeral-storage para evitar eviction pelo kubelet
resources:
  requests:
    cpu: "100m"
    memory: "200Mi"
    ephemeral-storage: "1Gi"
  limits:
    memory: "400Mi"
    ephemeral-storage: "5Gi"

config:
  service: |
    [SERVICE]
        Flush                     1
        Log_Level                 info
        HTTP_Server               On
        HTTP_Listen               0.0.0.0
        HTTP_Port                 2020
        storage.path              /var/fluent-bit/state   # ← fila durável
        storage.sync              normal
        storage.backlog.mem_limit 200M

  inputs: |
    [INPUT]
        Name             tail
        Path             /var/log/containers/*.log
        Tag              kube.app
        Parser           cri
        Mem_Buf_Limit    50M                             # ← buffer RAM por input
        DB               /var/fluent-bit/state/tail.db   # ← offsets do tail
        DB.Sync          normal
        storage.type     filesystem                      # ← usa DISCO (sobrevive a restart)
        Read_from_Head   Off
        Skip_Long_Lines  On
        multiline.parser cri

  outputs: |
    [OUTPUT]
        Name    file
        Match   kube.*
        Path    /var/fluent-bit/state                     # só p/ exemplo didático
        File    out.log
        Format  plain
        Mkdir   On
```

---

# 7) Como **validar** o buffer (experimento guiado)

1. **Aplique** a config acima e gere logs:
    

```bash
helm upgrade -i fluent-bit fluent/fluent-bit -n logging --create-namespace -f values.yaml

kubectl run logger --image=busybox --restart=Never -- \
  sh -c 'i=0; while true; do echo "{\"i\":$i,\"msg\":\"hello\"}"; i=$((i+1)); sleep 0.01; done'
```

2. **Provoque backpressure** (simule destino ruim)  
    Troque o `[OUTPUT]` por `http` apontando para um host inválido, ou pare momentaneamente o serviço destino. (Se mantiver `file`, pule para o passo 3.)
    
3. **Observe crescimento do storage** (dentro do pod):
    

```bash
POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
kubectl -n logging exec -it "$POD" -- sh -lc 'du -sh /var/fluent-bit/state; ls -l /var/fluent-bit/state'
```

- Você verá **arquivos de chunk** aparecendo/crescendo; isso é a **fila no disco**.
    

4. **Veja os logs do agente** (sinais de backpressure):
    

```bash
kubectl -n logging logs "$POD" --tail=200 | egrep -i 'flush|retry|storage|paused|backlog'
```

- Mensagens típicas:
    
    - `flush chunk ... retry in X seconds`
        
    - `[storage] backlog: queueing chunks on filesystem`
        
    - `input:tail paused (mem buf overlimit)` / `resumed`
        

5. **Métricas (Prometheus)**:
    

```bash
kubectl -n logging exec -it "$POD" -- wget -qO- http://127.0.0.1:2020/api/v1/metrics/prometheus | head
```

- Procure métricas de **bytes/records** processados, **retries** de output, **chunks** em fila.
    

6. **Recupere o destino** → o backlog **drena** e o diretório reduz.
    

---

# 8) Dimensionamento (regra prática)

- Defina quantos **minutos de indisponibilidade** do destino você quer aguentar.
    
- Estime taxa: `ingest_rate_bytes_s` (ex.: 3 MB/s por nó).
    
- Cálculo: `capacidade ≈ ingest_rate_bytes_s × outage_seconds`.
    
- Garanta **espaço de disco** suficiente por **nó** (ex.: 10–20 GiB).
    
- Comece com:
    
    - `[INPUT] Mem_Buf_Limit`: **50–200 MiB**
        
    - `[SERVICE] storage.backlog.mem_limit`: **100–500 MiB**
        
    - `Flush`: **1–3s** (ajuste conforme o destino)
        

---

# 9) Troubleshooting (sintoma → causa → correção)

|Sintoma|Causa provável|Correção|
|---|---|---|
|Perda de logs ao recriar o Pod|`storage.path` ausente ou `storage.type memory`|Defina `storage.path` + `storage.type filesystem` e monte **hostPath**|
|Input pausa com frequência|`Mem_Buf_Limit` baixo **e/ou** outputs lentos|Aumente `Mem_Buf_Limit`; resolva destino; aumente `workers` no output (se houver)|
|Eviction por ephemeral-storage|Gravando buffer no FS do container|Monte **hostPath**; ajuste `requests/limits` de ephemeral-storage|
|Releitura massiva após restart|Sem `DB tail.db` ou `Read_from_Head On`|Configure `DB` e `Read_from_Head Off`|
|IO alto no nó|`storage.sync full` ou flush muito agressivo|Use `storage.sync normal`; avalie `Flush 2–3`; filtre ruído cedo|
|“Explodiu” por linhas gigantes|Linhas enormes enchendo memória|`Skip_Long_Lines On`; trate/limite no app; filtre com `grep`|

---

# 10) Resumo de bolso

- **Buffer = fila** entre inputs e outputs.
    
- Em **produção**, use **disco**: `[SERVICE] storage.path` + `[INPUT] storage.type filesystem` + **hostPath**.
    
- Ajuste **`Mem_Buf_Limit`** (input) e **`storage.backlog.mem_limit`** (engine) para seu volume.
    
- **Valide**: simule falha do destino e observe **chunks** e **retries**.
    
- **Monitore**: métricas em `:2020`, uso de disco do nó, pausas do input.