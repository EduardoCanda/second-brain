---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
perfeito — vamos tratar **[[pv]]/[[pvc]] para o [[fluentbit-storage|storage]] do [[fluentbit|Fluent Bit]]** (quando o output cai) e a sua pergunta central: **há race condition entre as instâncias do [[DaemonSet]]?** Como evitar? Vou no formato didático.

---

# 1) Objetivo

Garantir **resiliência do buffer** ([[fluentbit-chunks|chunks]]) quando o destino está fora, **sem corrupção/conflito** entre os _collectors_ do **DaemonSet** e com comportamento previsível em _failures_.

---

# 2) Visão rápida

- **Fluent Bit DS** = **1 pod por nó**.
    
- O **storage.path** do Fluent Bit (chunks + `tail.db`) **não é multi-writer seguro** entre **processos diferentes**.
    
- Se **duas instâncias** escreverem no **mesmo diretório** (mesmo PV/mesmo path), você abre espaço para **race** (colisão de arquivos, índice, bloqueios) e/ou **corrupção**.
    
- Logo, cada instância precisa de **um diretório exclusivo**.
    

> Regra de ouro: **1 instância ⇔ 1 diretório de storage exclusivo**.

---

# 3) Existe “race condition” em DaemonSet?

**Existe, se você compartilhar o mesmo PV/mesmo diretório entre instâncias.**  
Cenários típicos que causam problema:

- **[[pv-rwo-rwx|RWX]] (NFS/CephFS) com o mesmo path** montado em todos os pods do DaemonSet → **multi-writer no mesmo diretório**.
    
- **RWO PVC único** tentando ser montado por vários pods do DS → **nem agenda** (RWO não permite multi-attach), e você acaba quebrando a premissa do DaemonSet.
    

Mesmo quando o FS suporta múltiplos escritores (RWX), o **storage engine** do Fluent Bit **não** foi projetado para **compartilhar `storage.path`** entre processos distintos → risco de **corrupção de chunks**, **índices inconsistentes**, e **`tail.db` inválido**.

---

# 4) Padrões corretos (como resolver)

## Opção A — **[[node]]-local (recomendado)**: `hostPath`

- Cada pod do DS grava em **/var/fluent-bit/state** do **nó** onde está rodando.
    
- Vantagens: **sem race**, **I/O local** (rápido), persiste ao **restart do pod** no mesmo nó.
    
- Desvantagem: **perde** backlog se o **nó** morrer definitivamente (DR de nó não é coberto).
    

**Values (trecho)**

```yaml
extraVolumes:
  - name: state
    hostPath:
      path: /var/fluent-bit/state
      type: DirectoryOrCreate
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state

config:
  service: |
    [SERVICE]
      storage.path /var/fluent-bit/state
      storage.sync normal
  inputs: |
    [INPUT]
      Name           tail
      storage.type   filesystem
      DB             /var/fluent-bit/state/tail.db
```

## Opção B — **RWX compartilhado, mas com isolamento por nó** (quando você _precisa_ de PVC)

- Monte **um PVC RWX** em todos os pods, **mas** use um **subdiretório único por nó/pod**, evitando colisão.
    
- Duas formas:
    

### B1) Isolar pelo **subPathExpr** (mais limpo)

```yaml
# expõe o nome do nó como env p/ usar no subPathExpr
env:
  - name: NODE_NAME
    valueFrom:
      fieldRef: { fieldPath: spec.nodeName }

# PVC único RWX
extraVolumes:
  - name: state
    persistentVolumeClaim:
      claimName: fluentbit-state-rwx

# monta cada pod em um diretório diferente dentro do mesmo PVC
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state
    subPathExpr: state-$(NODE_NAME)   # ← diretório exclusivo por nó

config:
  service: |
    [SERVICE]
      storage.path /var/fluent-bit/state
```

### B2) Isolar pelo **caminho no storage.path** (se não puder usar subPathExpr)

- Mantém o mount comum e usa **env var** no `storage.path`:
    

```yaml
env:
  - name: NODE_NAME
    valueFrom:
      fieldRef: { fieldPath: spec.nodeName }

config:
  service: |
    [SERVICE]
      storage.path /var/fluent-bit/state/${NODE_NAME}
```

> Confirme se sua versão do Fluent Bit expande **`${VAR}`** no config (as builds atuais suportam).

**Atenção com RWX:**

- **Performance** pior que disco local (NFS em especial) — considere `storage.sync normal` (não `full`) para evitar IOPS excessivo.
    
- **Rede do cluster** passa a ser dependência do buffer (se a rede falhar, você perde também a “rede de segurança”).
    

## Opção C — **Agregador central com PVC** (arquitetura)

- DS com **hostPath** + um **aggregator** (Fluentd/Vector) em **Deployment/StatefulSet** com **PVC RWO** **único** (apenas esse agregador escreve).
    
- DS → `forward` → agregador (buffer & roteamento pesados) → destinos.
    
- Evita multi-writer no mesmo diretório; concentra persistência durável num **único processo**.
    

---

# 5) O que **não** fazer

- **Mesma PVC + mesmo path** em todos os pods do DS (RWX) → **race**.
    
- **RWO PVC único** na spec do DS → pods **não** sobem (não compartilhável).
    
- **Montar rede remota para “aguentar nó caído”** e depois usar o **mesmo diretório** para todo mundo.
    

---

# 6) DR e expectativas (o que cada opção cobre)

|Opção|Output fora do ar|Pod reinicia|Nó morre|Comentário|
|---|---|---|---|---|
|A) hostPath|✅ segura|✅ segura|❌ perde backlog do nó|Melhor desempenho; cobre 90% (queda do destino)|
|B) RWX por subdir|✅ segura|✅ segura|✅ backlog persiste no PVC|Mais lento; complexidade de RWX; ainda **não** relê logs de outro nó|
|C) Agregador com PVC|✅ segura|✅ segura|✅ (centralizado)|Arquitetura mais robusta (um writer), melhor p/ compliance/DR|

> Observação importante: mesmo com RWX, **o Fluent Bit do nó B não vai “reprocessar” o backlog do nó A** automaticamente (seria outro _ownership model_). Para “centralizar a durabilidade”, **Opção C** é a forma clássica.

---

# 7) Validação (checklist)

1. **Exclusividade**: confirme que **cada pod** do DS escreve em **um path único** (`/var/fluent-bit/state`, ou subdir por nó).
    
2. **Sem compartilhamento**: garanta que **nenhum** par de pods escreve no **mesmo diretório**.
    
3. **Backlog real**: derrube o output, gere logs, veja `du -sh` crescer:
    
    ```bash
    POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
    kubectl -n logging exec -it "$POD" -- sh -lc 'du -sh /var/fluent-bit/state; find /var/fluent-bit/state -maxdepth 2 -type f | head'
    ```
    
4. **Métricas do storage**:
    
    ```bash
    kubectl -n logging exec -it "$POD" -- wget -qO- http://127.0.0.1:2020/api/v1/storage
    ```
    
    Veja `fs_chunks` subindo com o destino fora.
    

---

# 8) Erros comuns & como corrigir

- **“Fiz RWX e os arquivos sumiram/corromperam”** → múltiplos pods no **mesmo diretório**. **Isole por subPathExpr** ou volte para **hostPath**.
    
- **“Meu DS não agenda com PVC RWO”** → RWO **não** permite multi-attach; use **hostPath** ou RWX com **subdir por nó**.
    
- **“Buffer ficou lento”** → RWX (NFS) com `storage.sync full`. Troque para `normal`; avalie `Flush 2–3s`; mantenha **retry infinito** no output.
    
- **“Quero DR de nó”** → não conte com DS lendo backlog de outro nó; **agregue** (Opção C) ou **fan-out** (ex.: Loki + S3) para ter cópia “externa”.
    

---

## Resumo de bolso

- **Sim, há race** se várias instâncias do DaemonSet escreverem no **mesmo diretório** de um PV.
    
- **Solução**: **exclusividade por instância** → **hostPath** (recomendado) **ou** **RWX com subPathExpr**/**storage.path** por nó/pod.
    
- Para **DR real** além de “output fora”, prefira **agregador central com PVC** ou **fan-out para armazenamento durável** (S3/Kafka).
    

Se quiser, te mando dois `values.yaml`:

1. **hostPath** (performático e simples),
    
2. **RWX com `subPathExpr: $(NODE_NAME)`** (sem race, DR melhor),  
    ambos já com `Retry_Limit False`, métricas, e um mini “roteiro de teste de queda de output”.