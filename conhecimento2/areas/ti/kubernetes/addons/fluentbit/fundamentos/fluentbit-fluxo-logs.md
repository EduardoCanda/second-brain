---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
Show! Vamos decodificar os **logs do próprio container do [[fluentbit|Fluent Bit]]** — o [[DaemonSet]] que você instalou pelo Helm.

# Onde ver os logs

```bash
# Seguir logs de todos os pods do Fluent Bit
kubectl -n logging logs -l app.kubernetes.io/name=fluent-bit -f --tail=200

# (Opcional) escolher um pod específico
POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
kubectl -n logging logs "$POD" -f --tail=200
```

# Aumentar/ajustar a verbosidade

No `values` do chart, em `[SERVICE]`:

```ini
[SERVICE]
  Log_Level  info     # valores: error | warn | info | debug | trace
```

Coloque **`debug`** (ou `trace`) temporariamente quando estiver investigando. Depois aplique com `helm upgrade`.

# Como “ler” uma linha de log

Formato típico:

```
[2025/08/31 19:22:05] [info] [engine] started (pid=1)
^^^^^^^ timestamp     ^^^^^ nível  ^^^^^^ componente/subcomponente
```

Outros exemplos e o que significam:

**Inicialização**

```
[info] [engine] started (pid=1)
[info] [storage] version=..., initializing...
[info] [sp] stream processor started
```

→ Processo subiu; storage (buffer em disco) inicializado; stream processor ativo.

**Input `tail` (leitura de arquivos do nó)**

```
[info] [input:tail:tail.0] inotify inode=..., file=/var/log/containers/...
[debug] [input:tail:tail.0] rotated: new file detected
```

→ Está observando `*.log`; detectou arquivo novo/rotação.

**Filter `kubernetes` (enriquecimento)**

```
[info]  [filter:kubernetes:kubernetes.0] using k8s-req API: https://kubernetes.default.svc:443
[warn]  [filter:kubernetes:kubernetes.0] could not get meta for POD ... (retrying)
```

→ Conectou na API do cluster; se aparecer `could not get meta`/`403`, revise RBAC e conectividade.

**Parser/Multiline**

```
[debug] [parser:json] invalid JSON map   # JSON quebrado no campo "log"
[debug] [multiline] new state: start     # começou a juntar linhas (stacktrace)
```

→ JSON inválido no log ou multiline em ação (útil p/ Java/Go).

**Output (ex.: `file`, `stdout`, `http`, `loki`, etc.)**

```
[info]  [output:file:file.0] opening /out/fluentbit.log
[warn]  [output:http:http.0] http_do=POST, status=429; retry in 10 seconds
[error] [output:loki:loki.0] cannot flush records, retrying
```

→ `file` abriu/escreveu; `http/loki` sinalizam backoff quando o destino falha (429/5xx).

**Buffer/Backpressure (storage)**

```
[warn]  [storage] backlog: queueing chunks on filesystem
[info]  [engine] flush chunk 'tail.0:...': retry in 10 seconds
```

→ Destino indisponível: dados vão para o **buffer em disco** (se você configurou `storage.path`), e o engine faz **retry**.

---

## Checklist de diagnóstico rápido

**Não sai nada nos logs do Fluent Bit**

- Confirme o seletor: `kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit`
    
- Suba o nível: `Log_Level=debug`.
    
- Veja se o **input `tail`** está lendo o caminho certo (`/var/log/containers/*.log`) e se os **volumes hostPath** estão montados.
    

**Mensagens do `kubernetes` filter com erro**

- RBAC: o chart com `rbac.create: true` costuma resolver.
    
- DNS/API: o pod acessa `kubernetes.default.svc:443`? (`kubectl exec` e `wget -qO- https://kubernetes.default.svc` com token).
    

**Logs duplicados ou bagunçados (stacktraces quebrados)**

- Ajuste `multiline.parser` (ex.: `cri,java,go`) e a ordem.
    
- Se o app já manda **JSON por linha**, mantenha o filter `parser` no `Key_Name log`.
    

**Backoff/Retry constante no output**

- O destino está recebendo? Teste conectividade de dentro do pod (`curl`).
    
- Habilite **buffer em disco** (em `[SERVICE]`: `storage.path` e no input `storage.type filesystem`) para não perder dados.
    

---

## Comandos úteis

```bash
# Ver detalhes do pod (montagens, args)
kubectl -n logging describe pod "$POD"

# Ver a config efetiva (se gerada via ConfigMap/ENV)
kubectl -n logging exec -it "$POD" -- cat /fluent-bit/etc/fluent-bit.conf

# Conferir health/metrics (se HTTP_Server On)
kubectl -n logging exec -it "$POD" -- wget -qO- http://127.0.0.1:2020
kubectl -n logging exec -it "$POD" -- wget -qO- http://127.0.0.1:2020/api/v1/metrics/prometheus | head
```

Se quiser, cole aqui **algumas linhas dos seus logs do Fluent Bit** (principalmente as que aparecem como `warn`/`error`), que eu te digo exatamente o que estão sinalizando e como corrigir no seu `values.yaml`.