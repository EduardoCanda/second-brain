---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---

# [[fluentbit-storage|Storage]] (essência)

- **Para que serve**: fila local e durável para absorver picos/falhas do destino; não é armazenamento final.
    
- **Onde vive**: diretório configurado em `[SERVICE] storage.path`; por **input** você escolhe se a fila é em **memória** ou **filesystem** (`storage.type`).
    
- **Offset do tail**: banco separado (`DB`) só para lembrar **onde parou** em cada arquivo.
    

---

## 1) Chunks & queue (como funciona)

- **Chunk** = bloco de registros que percorre o pipeline.
    
- Fluxo: INPUT agrega → cria **chunk** → OUTPUT tenta **flush** periódico → se falha, o chunk **volta à fila** com **backoff**.
    
- Com `storage.type filesystem`, os chunks já nascem **persistidos em disco** (sobrevivem a restart do container); em `memory`, ficam só em RAM (mais rápido, menos durável).
    
- O **engine** limita memória e empurra para disco conforme seus limites (abaixo).
    

### Config base (recomendada)

```ini
[SERVICE]
  Flush                     1
  storage.path              /var/fluent-bit/state
  storage.sync              normal
  storage.backlog.mem_limit 100M   # limite de backlog em RAM antes de “despejar” no disco

[INPUT]
  Name             tail
  ...
  storage.type     filesystem       # fila do input no disco (durável)
```

---

## 2) `[SERVICE] storage.*` (o que importa)

- `storage.path`: diretório dos chunks.
    
- `storage.sync`: `normal` (fsync balanceado) vs `full` (fsync agressivo; só use se obrigatório).
    
- `storage.backlog.mem_limit`: teto de RAM (para backlog) antes de priorizar disco.
    

> Regra prática: **sempre** defina `storage.path` e use `normal`.

---

## 3) `[INPUT] storage.type` (memória vs disco)

- `memory`: latência mínima; **perde** em restart.
    
- `filesystem`: ligeiramente mais lento, porém **sobrevive** a restart e reschedule no mesmo nó (quando `hostPath`).
    

> Em K8s/produção: `filesystem` é o padrão sensato.

---

## 4) Tail DB (offsets)

- `DB /var/fluent-bit/state/tail.db` → mantém **posição lida** por arquivo.
    
- `DB.Sync normal` → persiste com eficiência (evita fsync por linha).
    
- Funciona **independente** dos chunks (é metadado de posição).
    

### Tail essencial (com estado)

```ini
[INPUT]
  Name           tail
  Path           /var/log/containers/*.log
  Parser         cri
  DB             /var/fluent-bit/state/tail.db
  DB.Sync        normal
  storage.type   filesystem
```

---

## 5) Tamanho dos buffers (dimensionamento rápido)

- **Objetivo**: aguentar X minutos de queda do destino.
    
- **Cálculo aproximado**:  
    `backlog_bytes ≈ ingest_rate_bytes_s × outage_seconds`  
    (Se o destino comprime, você ainda precisa **segurar bruto** no agente.)
    
- **Como medir**: taxa de linhas × tamanho médio da linha (ou métricas do agente).
    
- **Sugerido para começar** (por nó):
    
    - `Mem_Buf_Limit` (input): 50–200 MiB
        
    - `storage.backlog.mem_limit` (service): 100–500 MiB
        
    - Espaço em `/var/fluent-bit/state`: dimensione em **GiB** (p.ex. 5–20 GiB) conforme a pior queda tolerada.
        

---

## 6) emptyDir vs hostPath (K8s)

- **Sem volume/emptyDir**: efêmero ao recriar o Pod → **evite** para storage.
    
- **`hostPath`** (recomendado, DaemonSet): persiste no **nó** entre recriações do Pod.
    
- **PVC remoto**: raramente vale; aumenta latência e acoplamento.
    

### Helm (volume de state + requests)

```yaml
extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state

resources:
  requests:
    cpu: "100m"
    memory: "200Mi"
    ephemeral-storage: "1Gi"
  limits:
    memory: "400Mi"
    ephemeral-storage: "5Gi"
```

> Dê **requests de ephemeral-storage** para evitar eviction e monitore o disco do **nó**.

---

## 7) Boas práticas (rápidas)

- **Filtre cedo** (`grep`) antes de filtros caros (`kubernetes`, `parser`).
    
- Multiline/JSON **apenas** onde necessário.
    
- `Read_from_Head Off` e/ou `Ignore_Older` para não sugar histórico gigante.
    
- Outputs: mantenha **keepalive**, considere `workers N` (quando suportado) para escoar mais rápido.
    

---

## 8) Sanidade & debug

- Logs do agente: `kubectl -n logging logs -l app.kubernetes.io/name=fluent-bit -f`
    
- Config efetiva: `kubectl exec ... -- cat /fluent-bit/etc/fluent-bit.conf`
    
- Métricas (Prometheus): `:2020/api/v1/metrics/prometheus`  
    Observe: taxa de ingestão, bytes em backlog, retries, chunks em fila.
    

---

## Como aprofundar (curto)

- **Faça 3 ensaios**:
    
    1. `storage.type memory` vs `filesystem` (medir perda em restart).
        
    2. Reduza `storage.backlog.mem_limit` e force queda do destino (ver drenagem).
        
    3. Varie `Mem_Buf_Limit` e veja impacto em CPU/latência.
        
- **Leia**: seções “Storage” e “Tail input” da doc; exemplos de `DB`, `storage.*`, e melhores práticas em K8s.
    
- **Próximo passo**: quer que eu gere um `values.yaml` **otimizado** (hostPath + buffers + grep) para você rodar esses ensaios no seu cluster?