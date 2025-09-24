---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
Perfeito — vou no estilo “essentials-first”.

# O que “storage” significa no [[fluentbit|Fluent Bit]]

**Storage ≠ destino final de logs.**  
É o **mecanismo de buffer/queue local** do Fluent Bit para:

- **Backpressure**: segurar registros quando o output falha/está lento.
    
- **Durabilidade**: não perder logs em picos/restarts.
    
- **Retomar posição** do `tail` (banco de offsets).
    

## Peças do storage

1. **Buffer global (chunks)**  
    Configurado em `[SERVICE]`:
    
    - `storage.path`: diretório no filesystem onde os **chunks** ficam.
        
    - `storage.sync`: como sincronizar no disco (`normal` recomendado).
        
    - `storage.backlog.mem_limit`: limite de memória antes de “despejar” no disco.
        
2. **Uso por input**  
    Em cada `[INPUT]`:
    
    - `storage.type`: `memory` (RAM) **ou** `filesystem` (disco) para a fila daquele input.
        
3. **Banco do `tail` (offsets)**
    
    - `DB /caminho/tail.db` + `DB.Sync normal`: registra **onde parou** em cada arquivo, evitando reler tudo após rotação/restart.
        

---

# Em Kubernetes: onde isso grava?

Depende de **onde você monta** o diretório de state:

- **Sem volume (padrão do container)** → grava na **camada efêmera do container**
    
    - Some ao recriar o **Pod** (novo UID).
        
    - Conta como **ephemeral-storage** do Pod (risco de **eviction** se encher).
        
    - Não recomendado em produção.
        
- **`emptyDir`** → vida do **Pod** (persiste em restarts do container, **perde** ao recriar o **Pod**). Útil para testes.
    
- **`hostPath` (recomendado p/ DaemonSet)** → grava no **disco do nó**
    
    - Persiste entre recriações do Pod **no mesmo nó**.
        
    - Bom equilíbrio de **desempenho e durabilidade local**.
        
    - Se o DaemonSet mover para **outro nó**, o state não vai junto (ok — é cache/buffer por nó).
        
- **PVC/PV remoto** → possível, mas geralmente **desnecessário** e pode piorar **latência/IOPS** (o buffer é local por nó).
    

> Resumo prático: para DaemonSet, use **`hostPath`** em `/var/fluent-bit/state` + `storage.type filesystem` nos inputs.

---

# Checklist mínimo (copiar/colar)

**Volumes (Helm values):**

```yaml
extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state
```

**Config (essencial):**

```ini
[SERVICE]
  storage.path /var/fluent-bit/state
  storage.sync normal
  storage.backlog.mem_limit 100M
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
```

**K8s resources (evitar eviction):**

- Defina `resources.requests` (CPU/mem) **e** considere `ephemeral-storage` para o Pod do Fluent Bit.
    
- Monitore disco do nó (o buffer vive lá com `hostPath`).
    

---

## Como aprofundar

- **Tópicos**: chunks & queue, `storage.*` (SERVICE), `storage.type` (INPUT), Tail DB (`DB`, `DB.Sync`), sizing de `Mem_Buf_Limit` e `backlog.mem_limit`, impacto de `emptyDir` vs `hostPath`.
    
- **Prática**: simule falha do output → ver métricas **backlog** subir e drenar; delete o Pod (no mesmo nó) e confirme **retomada** de offsets com `tail.db`.
    
- **Próximo passo**: quer que eu ajuste seu `values.yaml` atual para `hostPath` + limites de **ephemeral-storage** e um painel básico de métricas do storage?