---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
perfeito! vamos destrinchar a seção **`[SERVICE]`** do [[fluentbit|Fluent Bit]] no estilo passo-a-passo, com configs anotadas, validação e troubleshooting. Essa seção define o **comportamento global** do agente: [[fluentbit-flush|flush]], logs do próprio agente, servidor HTTP de métricas/health, e — peça crítica — **[[fluentbit-storage|storage]]** (buffer local em memória/disco).

---

# 1) Objetivo

Entender e **configurar bem** a seção `[SERVICE]` para ter:

- flush previsível,
    
- logs do agente na verbosidade certa,
    
- **métricas/health** via HTTP,
    
- **[[fluentbit-storage-aprofundamento|buffer local]]** (backpressure) robusto em disco,
    
- boa relação **desempenho x durabilidade**.
    

---

# 2) Onde `[SERVICE]` entra no pipeline

```
[SERVICE]  →   [INPUT] → [FILTER] → [OUTPUT]
        (engine, HTTP/metrics, storage global)
```

`[SERVICE]` ajusta o **engine** e recursos comuns que todos os inputs/filters/outputs usam.

---

# 3) Os campos que realmente importam (com “quando usar”)

## Flush & Shutdown

- `Flush <segundos>`  
    Frequência com que o engine tenta enviar **chunks** para os outputs.  
    **Recomendado**: `Flush 1` (baixa latência); aumente (ex. 2–5) se quiser **lotes maiores** e menos pressão em destinos.
    
- `Grace <segundos>`  
    Janela de **graceful shutdown** para drenar fila ao encerrar. Útil em upgrades/rollouts.
    

## Logs do agente

- `Log_Level <error|warn|info|debug|trace>`  
    **`info`** em produção; **`debug`**/`trace` só para investigação (mais CPU/IO).
    
- (Dica) Durante troubleshooting, suba para `debug`, resolva, volte a `info`.
    

## Arquivos auxiliares

- `Parsers_File <caminho>`  
    Carrega **[[fluentbit-parsers|parsers]]** (JSON/regex) e **multiline parsers** que os inputs/filtros usam.  
    Você pode ter múltiplas linhas `Parsers_File`.
    
- `Plugins_File <caminho>`  
    Carrega plugins **dinâmicos**. Na imagem oficial, a maioria é **estática** — normalmente você **não precisa** disso em K8s.
    

## HTTP: métricas & health

- `HTTP_Server On|Off` + `HTTP_Listen` + `HTTP_Port`  
    Abre **servidor HTTP** com:
    
    - `GET /` → geral/versão
        
    - `GET /api/v1/health` → health check
        
    - `GET /api/v1/metrics/prometheus` → **métricas Prometheus**  
        **Padrão de porta** (comum): `2020`.  
        ⚠️ Em Kubernetes, se expor em `0.0.0.0`, proteja com **NetworkPolicy**/Service interno.
        

## Storage (buffer/backpressure) – global

- `storage.path <dir>`  
    Diretório no **filesystem** para chunks (fila durável).  
    Em K8s (DaemonSet), **monte como `hostPath`** (ex.: `/var/fluent-bit/state`).
    
- `storage.sync <normal|full>`  
    Como o agente sincroniza no disco. **`normal`** é o melhor equilíbrio (durável sem matar IOPS).  
    `full` = fsync agressivo (só use se políticas exigirem).
    
- `storage.backlog.mem_limit <N>`  
    Limite de **RAM** para backlog antes de priorizar o disco. Comece com **50–200 MiB** (depende do tráfego).
    
- (Relacionado nos **inputs**): `storage.type filesystem` em cada `[INPUT]` para que a fila daquele input **use disco**.
    

## Afinamento

- `Coro_Stack_Size <bytes>`  
    Tamanho da stack das **corrotinas** internas. Em cenários com parsers profundos ou filtros complexos (muito JSON), aumentar (ex.: `32768` ou `65536`) evita raros _stack overflows_.
    

---

# 4) Baselines prontos (anotados)

## A) Desenvolvimento / laboratório (K8s)

```ini
[SERVICE]
    Flush                     1              # baixa latência, bom p/ ver efeito rápido
    Grace                     5              # 5s para drenar na saída do pod
    Log_Level                 info           # mude p/ debug nas investigações
    Parsers_File              parsers.conf   # inclui cri/json e seus multiline
    HTTP_Server               On
    HTTP_Listen               0.0.0.0
    HTTP_Port                 2020
    storage.path              /var/fluent-bit/state
    storage.sync              normal
    storage.backlog.mem_limit 100M
```

Quando usar: testes, POCs, pipelines didáticos.

## B) Produção (DaemonSet em K8s)

```ini
[SERVICE]
    Flush                     1              # ajuste p/ 2–3 se quiser lotes maiores
    Grace                     10             # dá mais tempo para drenar
    Log_Level                 info
    Parsers_File              parsers.conf
    HTTP_Server               On
    HTTP_Listen               0.0.0.0        # restrinja via Service/NetworkPolicy
    HTTP_Port                 2020
    storage.path              /var/fluent-bit/state
    storage.sync              normal
    storage.backlog.mem_limit 200M           # aumente conforme throughput
    Coro_Stack_Size           32768          # útil se usar parsers/filtros "fundos"
```

Quando usar: clusters com tráfego estável/alto, objetivos de durabilidade.

---

# 5) Integração com [[fluentbit-input|Inputs]] (o par perfeito)

A seção `[SERVICE]` **habilita** storage global; cada `[INPUT]` decide **como** usa:

```ini
[INPUT]
    Name             tail
    Path             /var/log/containers/*.log
    Tag              kube.app
    Parser           cri
    DB               /var/fluent-bit/state/tail.db  # offsets do tail
    DB.Sync          normal
    storage.type     filesystem                     # usa DISCO (resiliência)
    Mem_Buf_Limit    50M
```

Sem `storage.path` em `[SERVICE]`, `storage.type filesystem` não tem onde gravar.

---

# 6) Validação (mão-na-massa)

1. **Conferir que o HTTP está no ar**
    

```bash
POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
kubectl -n logging exec -it "$POD" -- wget -qO- http://127.0.0.1:2020/api/v1/health
# Esperado: {"status":"ok"} (ou similar)
```

2. **Métricas Prometheus**
    

```bash
kubectl -n logging exec -it "$POD" -- wget -qO- http://127.0.0.1:2020/api/v1/metrics/prometheus | head
# Você verá métricas do engine, inputs/outputs e storage.
```

3. **Storage realmente em disco**
    

```bash
kubectl -n logging exec -it "$POD" -- sh -lc 'du -sh /var/fluent-bit/state || ls -la /var/fluent-bit/state'
# Deve existir; durante pico/falha do destino, o tamanho cresce.
```

4. **Teste de backpressure** (rápido)
    

- Pare (ou aponte para um destino inválido) um output e gere logs.
    
- Observe **retries** nos logs do agente e o aumento do diretório do `storage.path`.
    
- Volte o destino; o backlog **drena**.
    

---

# 7) Problemas comuns → como resolver

| Sintoma                              | Provável causa                                              | Correção rápida                                                                                |
| ------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `cannot open parsers.conf` no start  | Caminho errado do `Parsers_File`                            | Use o caminho padrão da imagem (`parsers.conf`) ou monte um arquivo válido                     |
| HTTP `:2020` não responde            | `HTTP_Server Off` ou Service/NetworkPolicy bloqueando       | Ligue `HTTP_Server On`; abra a porta via Service. Use `127.0.0.1` num `exec` para testar local |
| Perda de logs em restart             | `storage.path` ausente **ou** `[INPUT] storage.type memory` | Defina `storage.path` em `[SERVICE]` + `storage.type filesystem` nos inputs                    |
| Re-ingerindo muito histórico         | `Read_from_Head On` ou DB ausente                           | No `tail`, use `DB .../tail.db` + `Read_from_Head Off`                                         |
| Alto IOPS/latência                   | `storage.sync full` desnecessário ou flush muito curto      | Troque para `normal`; aumente `Flush` para 2–3 se puder                                        |
| Erro raro “stack overflow/coroutine” | Stack pequena para filtros/parsers profundos                | Aumente `Coro_Stack_Size` (ex. 32768/65536)                                                    |

---

# 8) “Qual valor eu coloco?” (sizing rápido)

- **Flush**: `1` (latência baixa). Se o destino sofre com muitas conexões/requests, experimente `2–3`.
    
- **Grace**: `5–15` s (tamanho do “drain” que você tolera na troca de pods).
    
- **storage.backlog.mem_limit**: comece com **100–200 MiB**.
    
- **Espaço em disco** (host do nó): reserve **GiBs** por nó (5–20 GiB) dependendo do pior **outage** que você quer suportar.
    
- **Coro_Stack_Size**: deixe padrão; aumente só se vir erro de stack.
    

---

# 9) Exemplo completo (Helm) — só a parte `[SERVICE]` destacada

```yaml
extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state

config:
  service: |
    [SERVICE]
        Flush                     1
        Grace                     10
        Log_Level                 info
        Parsers_File              parsers.conf
        HTTP_Server               On
        HTTP_Listen               0.0.0.0
        HTTP_Port                 2020
        storage.path              /var/fluent-bit/state
        storage.sync              normal
        storage.backlog.mem_limit 200M
        Coro_Stack_Size           32768
  # inputs/filters/outputs viriam aqui…
```

---

## Próximos passos

Se topa, no passo seguinte detalho **`[INPUT] tail`** (todas as flags importantes, multiline, DB, sizing) no mesmo formato didático — e já te entrego um `values.yaml` “pronto para copiar” com comentários linha a linha. Quer seguir por ele?