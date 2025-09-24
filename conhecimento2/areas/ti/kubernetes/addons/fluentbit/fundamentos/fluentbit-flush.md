---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
perfeito — vamos explicar o **flush** do Fluent Bit e conectá-lo aos **conceitos de stream** no formato didático (objetivo → como funciona → relação com streaming → configs comentadas → validação → troubleshooting → resumo).

---

## 1) Objetivo

Entender **o que é o flush**, **o que acontece em cada ciclo**, por que ele existe, e **como ajustar** para equilibrar **latência** (tempo até o log chegar no destino) e **throughput** (volume entregue por segundo) em um **pipeline de streaming**.

---

## 2) O que é o “flush” (definição rápida)

No Fluent Bit, **flush** é o **pulso periódico do engine** que pega **chunks** prontos (blocos de registros) da fila e **tenta entregá-los** aos **outputs** (Loki/Elastic/HTTP/file, etc.).  
Esse pulso é configurado em `[SERVICE] Flush <segundos>`.

> Pense no flush como o **metrônomo** do pipeline: a cada batida, o agente empurra micro-lotes (chunks) do fluxo para os destinos.

---

## 3) Linha do tempo de um ciclo de flush (passo a passo)

1. **Ingestão contínua (stream)**  
    Os inputs (ex.: `tail`) recebem linhas de log continuamente e as **empacotam** em um **chunk aberto** (associado a uma **Tag**).
    
2. **Fechamento do chunk**  
    Por **heurísticas internas** (tempo/volume) e/ou quando chega o próximo **Flush**, o chunk é **selado** e entra no estado **pronto para flush**.
    
3. **Agendamento e envio**  
    Quando o timer de `Flush` dispara, o engine coleta os chunks “prontos” e chama cada **output** que faz `Match` com a Tag daquele chunk.
    
4. **Confirmação ou Retry**
    
    - **Sucesso**: o output confirma, o chunk é removido.
        
    - **Falha**: o output devolve **RETRY**, o chunk volta para a **fila** com **backoff** (tenta de novo depois de X segundos).  
        Se houver `storage.type filesystem` e `storage.path`, os chunks ficam **no disco** (duráveis) até conseguir entregar.
        
5. **Drenagem**  
    Quando o destino se recupera, os outputs voltam a confirmar e a fila **drena** (os arquivos/chunks diminuem).
    

> Observação: **Multiline** e **parsers** acontecem **antes** do chunk selar; eles definem o que é “um registro” que vai dentro do chunk.

---

## 4) Como isso se relaciona com **conceitos de stream**

### Streaming ≠ batch

- **Streaming**: os eventos **chegam continuamente**; o agente os **propaga** quase em tempo real.
    
- O **flush** introduz **micro-lotes** (chunks) — é como um _micro-batch_ de milissegundos/segundos para tornar a entrega eficiente.
    

### Push com **backpressure**

- O Fluent Bit é **push-based**: inputs empurram eventos ao engine, que **empurra** aos outputs nos pulsos de flush.
    
- Se o destino estiver lento/fora, ocorre **backpressure**: o engine **amortece** usando **buffer** (fila em RAM/disco).
    
- Isso é exatamente o que sistemas de stream fazem para **desacoplar** produtores e consumidores.
    

### Semântica de entrega

- Na prática, o Fluent Bit oferece **at-least-once**: sob falhas e retries, **pode haver duplicatas** no destino.
    
- Não há garantia global de **ordem total** — a ordem dentro de um **chunk** é preservada, mas entre chunks/destinos não é garantido.
    

### Latência × Throughput

- **Flush menor** (ex.: `1s`) → **latência menor**, **mais chamadas**/overhead ao destino.
    
- **Flush maior** (ex.: `2–3s`) → **lotes maiores** (melhor throughput, menos overhead), **latência maior**.
    

### Tempo de evento vs. tempo de processamento

- O Fluent Bit opera em **tempo de processamento** (não faz janelas/event-time/watermarks como frameworks de streaming complexos).
    
- O `Flush` é um **gatilho temporal operacional**, não semântica de janelas de analytics.
    

---

## 5) Alavancas que afetam o comportamento do flush

**Em `[SERVICE]` (engine global)**

- `Flush N` → ritmo do envio.
    
- `Grace N` → janela para **drenar** fila ao fechar o pod (graceful shutdown).
    
- `storage.path`, `storage.sync`, `storage.backlog.mem_limit` → **durabilidade e pressão** na RAM/disco.
    

**Em `[INPUT]` (como nascem os chunks)**

- `storage.type filesystem|memory` → chunk **durável** no disco vs **volátil** em RAM.
    
- `Mem_Buf_Limit` → quão grande o input pode “inflar” na memória antes de pausar.
    

**Em `[OUTPUT]` (escoamento)**

- `workers N` (se existir), **keepalive**, **compressão**, **tamanho de batch** do plugin → eficiência de envio (relaciona diretamente com cada flush).
    

**Cardinalidade de Tag**

- Muitos valores de **Tag** → muitos **chunks pequenos** simultâneos → overhead. Prefira **poucas tags** estáveis.
    

---

## 6) Configurações comentadas (duas versões)

### A) Baixa latência (pulso rápido)

```ini
[SERVICE]
    Flush                     1              # envia a cada 1s
    Grace                     10
    Log_Level                 info
    HTTP_Server               On
    HTTP_Listen               0.0.0.0
    HTTP_Port                 2020
    storage.path              /var/fluent-bit/state
    storage.sync              normal
    storage.backlog.mem_limit 200M

[INPUT]
    Name             tail
    Path             /var/log/containers/*.log
    Tag              kube.app
    Parser           cri
    storage.type     filesystem
    Mem_Buf_Limit    50M
    DB               /var/fluent-bit/state/tail.db
    DB.Sync          normal

[OUTPUT]
    Name    http
    Match   kube.*
    Host    my-ingestor.default.svc
    Port    8080
    URI     /logs
    Format  json
    # Se suportado pelo plugin: keepalive/compress/workers ajudam no throughput
```

### B) Throughput/overhead otimizado (lotes um pouco maiores)

```ini
[SERVICE]
    Flush 3                                   # menos chamadas ao destino
    ... (mesmo resto)
```

**Quando usar**

- Versão A para depurar e quando o destino aguenta _requests_ frequentes.
    
- Versão B quando o destino cobra por requisição, tem _rate limit_, ou você quer aliviar overhead.
    

---

## 7) Validação prática (veja o efeito do flush)

1. **Gerar logs previsíveis**
    

```bash
kubectl run logger --image=busybox --restart=Never -- \
  sh -c 'i=0; while true; do echo "{\"i\":$i,\"msg\":\"hello\"}"; i=$((i+1)); sleep 1; done'
```

2. **Comparar `Flush 1` vs `Flush 3`**
    

- Aplique a config com `Flush 1`, direcione para `OUTPUT file` ou `http`.
    
- Observe a chegada de registros no destino: tende a vir **quase de 1 em 1 segundo** (pulsos pequenos).
    
- Troque para `Flush 3`, **aplique** e repita: vai notar “**grupinhos**” de registros em intervalos de ~3s (micro-lotes maiores).
    

3. **Métricas (Prometheus)**
    

```bash
POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
kubectl -n logging exec -it "$POD" -- wget -qO- http://127.0.0.1:2020/api/v1/metrics/prometheus | head
```

- Monitore contadores de **registros/bytes** processados, **retries** e (se expostos pelo plugin) **requisições** ao destino.
    

---

## 8) Troubleshooting (sintoma → causa → correção)

|Sintoma|Causa provável|Correção|
|---|---|---|
|**Muitas requisições** ao destino|`Flush` muito baixo, batch pequeno|Suba para **2–3s**; ative **keepalive**/compressão; use `workers` (se houver)|
|**Latência alta** de chegada|`Flush` alto + destino lento|Reduza `Flush` (1–2s); melhore output (workers/keepalive); verifique rede/destino|
|**Backlog (disco) crescendo**|Destino lento/fora → retries|Garanta **storage em disco** (`storage.path` + `storage.type filesystem`), espaço livre, e resolva o destino|
|**Pausas do input** (`mem buf overlimit`)|Input enchendo RAM durante backpressure|Aumente `Mem_Buf_Limit`; alivie `Flush` (maior batch); melhore output; filtre ruído|
|**Duplicatas** no destino|Semântica **at-least-once** com retries|Deduplicate a jusante (quando possível); aceite duplicatas em falhas; monitore retries|

---

## 9) Resumo de bolso

- **Flush** = batida do engine que **escoa chunks** para os outputs.
    
- É a ponte entre **stream contínuo** e **micro-lotes eficientes**.
    
- **`Flush` baixo** → latência menor, mais chamadas. **`Flush` alto** → batches maiores, menos overhead.
    
- Em streaming real: use **buffer em disco**, aceite **at-least-once**, e ajuste `Flush` + opções dos **outputs** para o seu perfil.
    

---

## 10) Como aprofundar (prática guiada)

- Rode **dois ensaios** no seu cluster:
    
    1. `Flush 1` vs `Flush 3` com o mesmo destino (meça requisições/s e latência fim-a-fim).
        
    2. Simule **queda** do destino e observe o **crescimento/drenagem** do diretório `storage.path`.
        
- Estude: `[SERVICE]` (Flush/Grace/storage), `[INPUT tail]` (storage.type/DB/Mem_Buf_Limit), e a documentação do **seu output** (keepalive, compressão, workers, política de retry).
    

Se quiser, eu pego seu `values.yaml` atual e te devolvo **duas versões** lado a lado (Flush 1 e Flush 3) com **comandos de medição** prontos para você comparar no seu ambiente.