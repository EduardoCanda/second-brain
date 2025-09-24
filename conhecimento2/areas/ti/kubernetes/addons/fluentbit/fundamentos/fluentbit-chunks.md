---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
perfeito! vamos entender **chunks** no Fluent Bit de forma didática e prática — o que são, como nascem, como “andam” no pipeline, como vê-los e como afiná-los.

---

# 1) Objetivo

Saber o que é um **chunk**, por que ele existe e como seu comportamento afeta **latência, confiabilidade e consumo de recursos** no Fluent Bit.

---

# 2) Visão rápida (mapa mental)

- O Fluent Bit **nunca** envia “linha por linha”.
    
- Ele **empacota registros** em blocos chamados **chunks**.
    
- O **engine** do Fluent Bit gerencia esses chunks: **fecha → agenda → envia → confirma** (ou **re-tenta**).
    

```
[INPUT] → (registros) → [CHUNK aberto]
                 ↑ fecha (flush/heurística)
[CHUNK pronto] → [OUTPUT envia] → OK (apaga) | FALHA (retry/backoff)
```

---

# 3) O que é um chunk (essência)

- **Unidade de armazenamento e envio** no Fluent Bit.
    
- Contém **vários registros** (após filtros/parsers), codificados internamente (MsgPack).
    
- É **associado a uma Tag** (o rótulo de roteamento do fluxo).
    
- Pode existir **em memória** ou **no disco**:
    
    - `storage.type memory` (no `[INPUT]`) → chunk vive em RAM.
        
    - `storage.type filesystem` + `[SERVICE] storage.path` → chunk já nasce no **disco** (persistente).
        

> Por que chunk? Para **lotes** (eficiência), **controle de backpressure** (fila) e **durabilidade** (quando em disco).

---

# 4) Ciclo de vida de um chunk (passo a passo)

1. **Abertura**  
    – O input (ex.: `tail`) começa a acumular registros num **chunk aberto** para aquela **Tag**.
    
2. **Fechamento**  
    – O chunk é “selado” por heurística interna e/ou quando chega o próximo **ciclo de flush** (`[SERVICE] Flush N`).  
    – Ao selar, ele vira **chunk pronto** (“ready to flush”).
    
3. **Agendamento/Envio**  
    – No **flush** (metrônomo), o engine coleta chunks prontos e chama o(s) **output(s)** que casam com a Tag.
    
4. **Confirmação**  
    – **Sucesso**: chunk é **removido**.  
    – **Falha**: output devolve **RETRY** → chunk volta à **fila** com **backoff** (tempo crescente).  
    – Se houver fila grande, chunks permanecem no **disco** quando você habilitou storage filesystem.
    
5. **Drenagem**  
    – Quando o destino se recupera, os outputs vão **consumindo** os chunks (ordem, paralelismo e tamanho variam por plugin e por `workers` se suportado).
    

> Importante: **multiline** e **parsers** atuam **antes** do chunk ser selado; eles definem _o que é um registro_ que vai dentro do chunk.

---

# 5) O que **define** o comportamento dos chunks (na prática)

### a) Frequência de **flush** (em `[SERVICE]`)

- `Flush 1–3` seg → quanto mais baixo, **mais cedo** os chunks selam/saem (menor latência, mais chamadas ao destino).
    
- `Grace` → quanto tempo o agente tenta **drenar** chunks ao encerrar.
    

### b) **Storage** (RAM vs Disco)

- `[SERVICE] storage.path` + `[INPUT] storage.type filesystem` → chunks vão para **disco** (persistem a restarts e suportam quedas do destino).
    
- `storage.backlog.mem_limit` → até quanto de **RAM** o engine tolera antes de priorizar **disco** para o backlog.
    

### c) **Tag** e cardinalidade

- Um chunk é **por Tag**. Se você gera **muitas Tags** (alta cardinalidade), o agente abre **muitos chunks pequenos** → mais overhead.  
    **Regra**: Tags estáveis e poucas (ex.: `kube.app`, `kube.nginx`) são melhores.
    

### d) **Volume e parsers**

- Multiline/JSON **não aumentam** chunk “por definição”, mas **impactam quando** o registro fica “pronto” para entrar no chunk (multiline junta várias linhas em um registro só).
    
- **Mais volume** = chunks “fecham” com mais frequência (há mais dados para selar).
    

### e) **Output**

- Alguns outputs **loteiam/compactam** o chunk internamente (ex.: [[tar|gzip]]) e/ou permitem **`workers`** (paralelismo).
    
- Falhas/retries do output **seguram** os chunks na fila (disco quando disponível).
    

---

# 6) Onde eu configuro (resumo operacional)

```ini
# [SERVICE] — governa flush, HTTP/metrics, e storage do engine
[SERVICE]
  Flush                     1
  storage.path              /var/fluent-bit/state
  storage.sync              normal
  storage.backlog.mem_limit 200M
  HTTP_Server               On
  HTTP_Listen               0.0.0.0
  HTTP_Port                 2020

# [INPUT] — decide se o chunk nasce em memória ou disco, e limites de RAM
[INPUT]
  Name             tail
  Path             /var/log/containers/*.log
  Tag              kube.app
  Parser           cri
  storage.type     filesystem     # chunks duráveis
  Mem_Buf_Limit    50M            # buffer RAM do input
  DB               /var/fluent-bit/state/tail.db
  DB.Sync          normal

# [OUTPUT] — escoamento; alguns plugins têm opções de lote/keepalive/workers
[OUTPUT]
  Name    file
  Match   kube.*
  Path    /var/fluent-bit/state
  File    out.log
  Format  plain
```

---

# 7) Como **ver** os chunks acontecendo (experimento guiado)

1. **Monte** o state em hostPath (para ver arquivos no nó):
    

```yaml
extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state
```

2. **Gere tráfego**:
    

```bash
kubectl run logger --image=busybox --restart=Never -- \
  sh -c 'i=0; while true; do echo "{\"i\":$i,\"msg\":\"hello\"}"; i=$((i+1)); sleep 0.01; done'
```

3. **Liste os arquivos de chunks** (dentro do pod):
    

```bash
POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
kubectl -n logging exec -it "$POD" -- sh -lc 'ls -lah /var/fluent-bit/state; du -sh /var/fluent-bit/state'
```

- Você verá **arquivos binários** representando chunks (“blocos” do storage).
    
- Sob **falha do output**, esse diretório **cresce** (fila no disco).
    
- Quando o destino volta, o **tamanho cai** (chunks drenam).
    

4. **Métricas/Logs do agente**:
    

```bash
# Métricas
kubectl -n logging exec -it "$POD" -- wget -qO- http://127.0.0.1:2020/api/v1/metrics/prometheus | head

# Logs (procure por "flush", "retry", "storage", "chunk")
kubectl -n logging logs "$POD" --tail=200 | egrep -i 'flush|retry|storage|chunk'
```

---

# 8) Boas práticas (com impacto direto nos chunks)

- **Poucas Tags** estáveis → menos chunks simultâneos e melhor eficiência.
    
- **Filtre cedo** (ex.: `grep`) para **menos dados por chunk** e menos pressão em outputs.
    
- **Storage em disco** em DaemonSet (`hostPath` + `storage.type filesystem`) para suportar **quedas do destino**.
    
- Ajuste **`Flush`** (1–3s) para equilibrar **latência vs. overhead** no destino.
    
- Se o output suportar, use **`workers`** para enviar **vários chunks** em paralelo.
    

---

# 9) Problemas típicos (sintoma → causa → correção)

| Sintoma                               | Por que acontece (chunks)                              | Como corrigir                                                              |
| ------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| Muuuitas chamadas ao destino          | Chunks muito pequenos (Flush baixo, pouco volume)      | Aumente `Flush` (2–3s); veja opções de batch do output                     |
| Disco do nó crescendo                 | Destino lento/fora; chunks **ficando** na fila (disco) | Investigue destino; garanta espaço; monitore e deixe drenar                |
| Perda de logs ao reiniciar            | Chunks só em memória (`storage.type memory`)           | Use `storage.type filesystem` + `[SERVICE] storage.path`                   |
| Explosão de “fluxos”                  | Cardinalidade alta de **Tags** → muitos chunks abertos | Consolidar tags; usar `rewrite_tag` só quando necessário                   |
| Pausas do input (`mem buf overlimit`) | Input sem espaço (RAM) enquanto há backlog             | Aumente `Mem_Buf_Limit`; resolva destino; habilite/ajuste storage em disco |

---

# 10) Resumo de bolso

- **Chunk = lote** de registros (unidade de envio/armazenamento).
    
- Controlados por: **Flush**, **Tag**, **Storage** (RAM vs Disco) e **saída** (batch/parallel).
    
- Em K8s/produção: **use disco** para chunks (`hostPath`), mantenha **poucas Tags**, **filtre cedo** e monitore **crescimento/drain** do diretório de state e os **retries** nos logs.
    

Se quiser, pego seu `values.yaml` atual e anoto **onde e por que** seus chunks podem estar “pequenos demais” ou “acumulando”, com sugestões exatas (Flush, Tag, filtros, storage) para o seu tráfego real.