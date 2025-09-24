---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
Excelente pergunta! Performance no [[fluentbit|Fluent Bit]] é sobre **ler menos**, **transformar só o necessário**, **bufferizar direito** e **entregar em lotes**. Eis o que realmente importa:

# Prioridades (o que mais pesa)

- **Multiline e parsing de JSON**: são os maiores vilões de CPU. Aplique apenas às tags necessárias (não em `kube.*` inteiro).
    
- **Filtro `kubernetes`**: útil, mas tem custo (chama API/Cache). Use só onde precisa.
    
- **Cardinalidade (labels/dimensões)**: quanto mais chaves dinâmicas você cria no fluxo (p. ex. labels por request_id), maior a pressão no output/destino.
    
- **Disco/buffer**: sem buffering em disco você pode perder logs e/ou travar sob pico.
    

# Boas práticas (checklist rápido)

**Entrada (tail)**

- Restrinja o **Path** (ou use `grep`) para reduzir volume.
    
- Use `Mem_Buf_Limit` adequado (ex. 20–100 MiB) por input.
    
- Ative **checkpoint** para evitar reler arquivos:
    
    - `DB /var/fluent-bit/state/tail.db`
        
    - `DB.Sync normal` (evita `fsync` a cada linha).
        
- Evite backlog gigante ao iniciar: `Read_from_Head Off`, `Ignore_Older` conforme o caso.
    
- Ative `storage.type filesystem` para que o input possa despejar no disco sob pressão.
    

**Filtros (ordem importa)**

- Coloque filtros baratos **antes** dos caros:
    
    - `grep` (descarta ruído cedo) → `kubernetes` → `parser` (JSON/multiline) → `record_modifier`.
        
- Limite multiline a tags específicas (ex.: só `kube.java.*`), e ajuste `Flush_Timeout`.
    
- Evite filtros pesados (Lua/regex complexa) em alto volume.
    

**Saídas (outputs)**

- Prefira **lotes**/conexões persistentes (keepalive).
    
- Se o plugin suportar, use **`workers N`** para paralelizar a entrega.
    
- Em testes didáticos, **arquivo** é ok; em produção, use um backend e **compressão** se disponível.
    

**Buffer/Backpressure**

- Em `[SERVICE]`:
    
    - `storage.path /var/fluent-bit/state`
        
    - `storage.sync normal`
        
    - `storage.backlog.mem_limit 50M` (ou mais)
        
- Em cada `[INPUT]`: `storage.type filesystem`
    
- Isso reduz perda de logs quando o destino oscilando.
    

**Kubernetes (recursos)**

- Dê **requests** realistas (CPU/mem) e **evite limites de CPU muito baixos** (throttling cria atraso/backlog).
    
- Coloque o diretório de **state** em disco rápido (SSD) do nó.
    
- Um DaemonSet por nó é ok; não duplique coletores.
    

**Observabilidade**

- Ligue `HTTP_Server On` e scrapeie métricas Prometheus em `/api/v1/metrics/prometheus`.
    
- Monitore: taxa de ingestão, `retries`, **backlog** em disco, uso de CPU/mem.
    

# Snippet de “base rápida” (enxuto e performático)

Use como guia no seu `values.yaml`:

```ini
[SERVICE]
    Flush               1
    Log_Level           info
    Parsers_File        parsers.conf
    HTTP_Server         On
    HTTP_Listen         0.0.0.0
    HTTP_Port           2020
    storage.path        /var/fluent-bit/state
    storage.sync        normal
    storage.backlog.mem_limit 100M

[INPUT]
    Name                tail
    Path                /var/log/containers/logger_default_logger-*.log   # foque no que importa
    Tag                 kube.test
    Parser              cri
    Mem_Buf_Limit       50M
    Skip_Long_Lines     On
    Refresh_Interval    5
    DB                  /var/fluent-bit/state/tail.db
    DB.Sync             normal
    Read_from_Head      Off
    storage.type        filesystem
    # multiline só se precisar, e só aqui:
    # multiline.parser  cri,java

[FILTER]
    Name    grep
    Match   kube.test
    Exclude log ^healthz$|^/ready$           # exemplo: corte ruído cedo

[FILTER]
    Name    kubernetes
    Match   kube.test
    Merge_Log On

[FILTER]
    Name         parser
    Match        kube.test
    Key_Name     log
    Parser       json
    Reserve_Data On

[OUTPUT]
    Name    file
    Match   kube.test
    Path    /out
    File    fluentbit.log
    Format  plain
    Mkdir   On
    # para outputs remotos, se o plugin suportar:
    # workers 2
```

# Regras de ouro

1. **Filtre cedo** (menos dados passando pelos filtros caros).
    
2. **Aplique multiline/JSON só onde precisa**.
    
3. **Buffer em disco sempre** para picos e quedas do destino.
    
4. **Monitore o próprio Fluent Bit** e ajuste continuamente (`Mem_Buf_Limit`, `workers`, `Refresh_Interval`).
    
5. **Sem CPU limit apertado**: melhor definir `requests` e manter margem.
    

Se quiser, mando seu `values.yaml` atual otimizado (com `DB` do tail, ordem de filtros, buffers e recurso do pod) e já deixo um painel básico de métricas pra você acompanhar ingestão e backlog.