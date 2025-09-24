---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
# [[fluentbit|Fluent Bit]] Inputs — guia essencial

**O que são:** plugins de **entrada** que geram registros para o pipeline  
`[INPUT] → [FILTER] → [OUTPUT]`.  
Cada instância de input define **Tag** (roteamento), **Parser** (opcional), **estado** (ex.: `DB`), **buffer** (`storage.type`).

## Ciclo de vida (mental model)

1. **Descoberta/leitura** (arquivo, journald, socket, rede…).
    
2. **Carimbo** da **tag** e timestamp.
    
3. **Checkpoint** (ex.: `tail.db`) para não reler após rotação/restart.
    
4. **Backpressure**: se outputs travam, registra em **buffer (disco)** quando habilitado.
    

---

## Inputs que importam (K8s e dia a dia)

### 1) `tail` (o padrão em K8s)

- **Uso**: ler `stdout/stderr` dos containers (CRI) em `/var/log/containers/*.log`.
    
- **Essencial**:
    
    - `Path` (ou `Path_Key`), `Tag`, `Parser` (`cri`), `Mem_Buf_Limit`
        
    - **Estado**: `DB /var/fluent-bit/state/tail.db` + `DB.Sync normal`
        
    - **Buffer**: `storage.type filesystem` (combina com `[SERVICE] storage.path`)
        
    - **Arranque**: `Read_from_Head Off` | Retenção: `Ignore_Older`
        
    - **Multiline**: `multiline.parser cri,java,go` (só se precisar)
        
    - **Ruído**: `Exclude_Path` (ex.: metrics/health), `Skip_Long_Lines On`
        
- **Exemplo enxuto**:
    
    ```ini
    [INPUT]
      Name             tail
      Path             /var/log/containers/*.log
      Tag              kube.app
      Parser           cri
      DB               /var/fluent-bit/state/tail.db
      DB.Sync          normal
      storage.type     filesystem
      Mem_Buf_Limit    50M
      Read_from_Head   Off
      multiline.parser cri
    ```
    

### 2) `systemd` (journald)

- **Uso**: logs de **kubelet**, **container runtime**, serviços do host.
    
- **Chaves**: `Tag`, `Path` (diretório do journal, opcional), `Systemd_Filter` (UNIT=…), `Read_From_Tail`, `Max_Entries`.
    
- **Exemplo**:
    
    ```ini
    [INPUT]
      Name            systemd
      Tag             host.kubelet
      Systemd_Filter  _SYSTEMD_UNIT=kubelet.service
      Read_From_Tail  On
    ```
    

### 3) `forward` (agregador)

- **Uso**: receber de Fluent Bit/Fluentd (fan-in); base de um **aggregator**.
    
- **Chaves**: `Listen`, `Port`, `tls`, `Shared_Key`, `Self_Hostname`.
    
    ```ini
    [INPUT]
      Name   forward
      Listen 0.0.0.0
      Port   24224
    ```
    

### 4) `tcp` / `http` (ingest simples)

- **Uso**: testes/serviços próprios enviando log por rede.
    
- **TCP**: `Listen`, `Port`, `Chunk_Size`
    
- **HTTP**: `Listen`, `Port`, `URI`, `Format json`, `Json_Date_Key`
    
    ```ini
    [INPUT]  Name http  Listen 0.0.0.0  Port 8080
    ```
    

### 5) `syslog`

- **Uso**: appliances/infra legada → UDP/TCP TLS.
    
- **Chaves**: `Mode udp|tcp|tls`, `Listen`, `Port`, `Parser`.
    

### 6) `exec` / `dummy` (testes)

- **`exec`**: roda comando e lê o **stdout**.
    
- **`dummy`**: gera eventos sintéticos (POC de pipeline).
    

---

## Padrões práticos (funcionam)

- **Filtro cedo**: combine `tail` + `grep` antes de `kubernetes/parser` → menos CPU.
    
- **Um input, várias “ramificações”**: use `rewrite_tag` (duplica registro com outra tag) quando precisar pipelines diferentes.
    
- **Somente um pod**: use `Path` específico do arquivo ou `grep` por `$kubernetes['pod_name']`.
    

---

## Receitas rápidas (copiar/colar)

**K8s básico (com estado e buffer)**

```ini
[SERVICE]
  storage.path /var/fluent-bit/state
  storage.sync normal
  HTTP_Server On
  HTTP_Listen 0.0.0.0
  HTTP_Port 2020

[INPUT]
  Name             tail
  Path             /var/log/containers/*.log
  Tag              kube.app
  Parser           cri
  DB               /var/fluent-bit/state/tail.db
  DB.Sync          normal
  storage.type     filesystem
  Mem_Buf_Limit    50M
  Read_from_Head   Off

[FILTER]
  Name  kubernetes
  Match kube.*

[OUTPUT]
  Name  stdout
  Match kube.*
  Format json_lines
```

**Somente um pod/container (via grep)**

```ini
[FILTER]
  Name  grep
  Match kube.*
  Regex $kubernetes['namespace_name'] ^default$
  Regex $kubernetes['pod_name']       ^logger$
  Regex $kubernetes['container_name'] ^logger$
```

**Clonar para duas tags (pipelines diferentes)**

```ini
[FILTER]
  Name rewrite_tag
  Match kube.app
  Rule $TAG ^kube\.app$ kube.raw  true
  Rule $TAG ^kube\.app$ kube.json true
```

---

## Performance (inputs)

- **`tail`**: habilite `DB` + `storage.type filesystem`; ajuste `Mem_Buf_Limit`; evite `Read_from_Head On` em nós com muito histórico.
    
- **Multiline**: só onde necessário; ajuste `Flush_Timeout`.
    
- **systemd**: sempre filtre **UNIT**; sem filtro vira aspirador de journal.
    
- **Rede (`tcp/http/forward`)**: mantenha keepalive; considere `workers` no OUTPUT correspondente para escoar.
    

---

## Debug rápido

- Suba verbosidade: `[SERVICE] Log_Level debug`.
    
- Ver métricas: `curl 127.0.0.1:2020/api/v1/metrics/prometheus | head`.
    
- Checar posição lida: inspecione `tail.db` (existe/atualiza?).
    
- Ver rotação: mensagens `input:tail rotated/new file`.
    

---

## Como aprofundar (curto)

**Estude nesta ordem:**

1. `tail` (todas as opções citadas).
    
2. Multiline (CRI/Java/Go) e interação com `parser`.
    
3. `systemd` com `Systemd_Filter`.
    
4. `forward` para montar um **aggregator**.
    
5. Inputs de rede (`http`, `tcp`, `syslog`) para POCs e integrações.
    

**Pratique:**

- Monte 3 pipelines: `tail→file`, `tail→http`, `tail→forward(aggregator)`.
    
- Adicione `grep` e compare CPU/volume antes/depois.
    
- Simule queda do destino e confirme que o **backlog** (disco) cresce e drena.
    

Se quiser, te entrego **um `values.yaml` focado em inputs** (com `tail`+`systemd`, filtros de ruído e métricas) já no formato que você está usando no Helm.