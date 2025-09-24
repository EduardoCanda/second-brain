---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
mandou bem! 🎉  
Usar o `HOSTNAME` para “trocar” dinamicamente o diretório do `storage.path` é um jeito simples e eficaz — principalmente quando o chart não deixa expor `spec.nodeName` via `env.valueFrom`.

Abaixo deixo o **pacote didático**: como montar, o que observar, pontos de atenção e como endurecer.

---

# 1) Exemplo mínimo (anotado)

```ini
[SERVICE]
  Flush                     1
  Grace                     10
  Log_Level                 info
  HTTP_Server               On
  HTTP_Listen               0.0.0.0
  HTTP_Port                 2020

  # ← diretório dinâmico por POD usando a env HOSTNAME
  storage.path              /var/fluent-bit/state/${HOSTNAME}
  storage.sync              normal
  storage.backlog.mem_limit 200M

[INPUT]
  Name           tail
  Path           /var/log/containers/*.log
  Parser         cri
  Tag            kube.app

  # fila durável
  storage.type   filesystem

  # offsets do tail juntos do storage do POD:
  DB             /var/fluent-bit/state/${HOSTNAME}/tail.db
  DB.Sync        normal

[OUTPUT]
  Name        loki
  Match       kube.*
  Host        loki-gateway.loki.svc.cluster.local
  Port        80
  URI         /loki/api/v1/push
  Line_Format json

  # ← crítico para não descartar chunks quando o destino cai
  Retry_Limit  False
  # (opcional) escoar mais rápido quando voltar:
  # workers     2
```

> Dica: garanta que **o volume** (hostPath/[[pvc|PVC]]) está montado em `/var/fluent-bit/state`. O `${HOSTNAME}` só cria o **subdiretório**.

---

# 2) Por que isso funciona

- O [[Kubernetes]] **injeta** `HOSTNAME` no ambiente do container (nome do POD).
    
- O [[fluentbit|Fluent Bit]] **expande env vars** no arquivo de configuração, então `/var/fluent-bit/state/${HOSTNAME}` resolve para algo como:  
    `/var/fluent-bit/state/fluent-bit-7m9d2`.
    

---

# 3) Pontos de atenção (o que você já está comprando)

- **Diretório por [[POD]] (não por nó)**: a cada _restart/rollout_, o nome do POD muda ⇒ você ganha **um subdiretório novo**.
    
    - Vantagem: isola instâncias e evita corrida.
        
    - Cuidado: ficam **diretórios órfãos** do POD antigo (ver limpeza abaixo).
        
- **Backlog “antigo” não migra** para o POD novo automaticamente (o agente não lê pastas de outros PODs).
    
    - Em geral ok — o novo POD segue produzindo no seu próprio diretório.
        
    - Se quer reprocessar alguma coisa, isso vira um passo manual/cron de coleta.
        

---

# 4) Hardening rápido (recomendado)

1. **Volume**
    
    - Se puder, prefira **hostPath** (desempenho e simplicidade).
        
    - Se usar **PVC RWX**, tudo bem — continue isolando por `${HOSTNAME}`.
        
2. **Retries**
    
    - Já está com `Retry_Limit False` → ótimo (sem perda por expiração).
        
3. **Flush/Grace**
    
    - `Flush 1–2` (latência baixa) e `Grace 10–15` (tempo de drenagem ao terminar) costumam ir bem.
        
4. **Métricas**
    
    - Cole o endpoint `:2020/api/v1/metrics/prometheus` e `/api/v1/storage` para monitorar **retries**, **chunks fs/mem** e **backlog**.
        
5. **Terminação suave** (opcional)
    
    - Dê tempo ao Fluent Bit para drenar no shutdown do POD:
        
        ```yaml
        terminationGracePeriodSeconds: 30
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh","-c","sleep 10"]
        ```
        
        (o `Grace` do `[SERVICE]` cuida do flush; o `sleep` só garante janela)
        

---

# 5) Limpeza de diretórios órfãos (se quiser deixar redondo)

Com RWX (ou mesmo hostPath), é normal sobrar `state-<pod-antigo>`. Dá pra limpar com um **CronJob** simples:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: fb-state-cleanup
  namespace: logging
spec:
  schedule: "0 3 * * *"  # diariamente às 03:00
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: cleaner
            image: alpine:3.19
            command:
              - sh
              - -lc
              - |
                set -e
                BASE="/var/fluent-bit/state"
                # exemplo: remove dirs de POD com +7 dias sem tocar no atual
                find "$BASE" -maxdepth 1 -mindepth 1 -type d -mtime +7 -print -exec rm -rf {} +
            volumeMounts:
              - name: state
                mountPath: /var/fluent-bit/state
          volumes:
            - name: state
              # hostPath OU seu PVC RWX
              hostPath:
                path: /var/fluent-bit/state
                type: DirectoryOrCreate
```

> Ajuste política/retention conforme sua realidade.

---

# 6) Validação (rapidinha)

```bash
# ver subpasta resolvida
POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
kubectl -n logging exec -it "$POD" -- sh -lc 'echo "STATE=$(readlink -f /var/fluent-bit/state)"; du -sh "$STATE" || true'

# simular queda do Loki e ver backlog crescer
kubectl -n logging scale deploy loki-gateway --replicas=0   # (exemplo)
kubectl -n logging exec -it "$POD" -- sh -lc 'du -sh /var/fluent-bit/state/${HOSTNAME}'
```

---

## Resumo

- Sua solução com `${HOSTNAME}` é **válida** e **segura** para evitar corrida entre instâncias do DaemonSet.
    
- Só fique atento à **acumulação de diretórios órfãos** (um CronJob resolve) e mantenha `Retry_Limit False` + **storage em disco** para que o backlog sobreviva às quedas do destino.
    
- Se um dia o chart permitir `env.valueFrom`, migrar para `${NODE_NAME}` deixaria o diretório **estável por nó** (menos “churn” em rollouts), mas não é obrigatório.
    

Se quiser, eu formo um **diff** do seu `values.yaml` com essas sugestões (Flush/Grace, workers no Loki, metrics) e um **CronJob de limpeza** pronto pra colar.