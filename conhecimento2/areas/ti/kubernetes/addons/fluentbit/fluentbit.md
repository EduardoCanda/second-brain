---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
perfeito — “essentials-first” pra você documentar, e depois já deixo o caminho de estudos de **inputs**.

# Fluent Bit — o que é (para documentação)

- **Definição**: agente **leve** de logs que **lê → transforma → envia** eventos em **stream** (baixa latência).
    
- **Onde roda**: edge (nós de K8s via **[[DaemonSet]]**), VMs, IoT.
    
- **Para que serve**: coletar stdout/stderr (e arquivos), enriquecer (ex.: metadados do K8s) e despachar para [[Loki]]/Elastic/OpenSearch/S3/[[Kafka]]/CloudWatch/HTTP etc.
    
- **Arquitetura interna**: blocos declarativos
    
    ```
    [INPUT] → [FILTER] → [OUTPUT]   (+ Parsers / Multiline)
    ```
    
- **Conceitos-chave**:
    
    - **[[fluentbit-tags|Tag]]**: rótulo de roteamento dado no [[fluentbit-input|INPUT]]; **Match**/Match_Regex seleciona o que cada [[fluentbit-filter|FILTER]]/[[fluentbit-output|OUTPUT]] processa.
        
    - **[[fluentbit-parsers|Parsers]]** (JSON/regex) e **multiline** (juntar stacktraces).
        
    - **Buffer/Backpressure**: `storage.path` + `storage.type filesystem` evitam perda sob pico/falha do destino.
        
    - **Métricas**: HTTP em `:2020` → `/api/v1/metrics/prometheus`.
        

## Em [[Kubernetes]] (padrão)

- **Implantação**: **DaemonSet** (um pod por nó).
    
- **Coleta**: `tail /var/log/containers/*.log` (formato CRI).
    
- **Enriquecimento**: filtro `kubernetes` ([[namespace]]/[[pod]]/container/[[labels]]).
    
- **RBAC**: `get/list/watch` de Pods/Namespaces.
    
- **Volumes**: hostPath para `/var/log` e diretório de **state** (buffer/DB do tail).
    

## Principais usos

1. Coleta de logs de **todos os pods** e envio para um backend (Loki/Elastic).
    
2. **Fan-out**: mesmo log para dois destinos (ex.: Loki + S3).
    
3. Normalização/limpeza: JSON por linha, multiline, `grep`/mask de PII.
    
4. Sidecar ou agente em VMs (journald/syslog/arquivos).
    

## Vantagens x limites

- **Vantagens**: leve, rápido, fácil de operar, muitos plugins de saída, ótimo em K8s.
    
- **Limites**: transformações pesadas/roteamento muito complexo → melhor usar **Fluentd** como agregador central.
    

## Performance (checklist rápido)

- **Filtre cedo** (`grep`) → depois `kubernetes`/`parser`.
    
- **Multiline/JSON** só onde precisa.
    
- **Buffer em disco** sempre (`storage.path` + `storage.type filesystem`).
    
- **Tail DB**: `DB .../tail.db` + `DB.Sync normal`.
    
- Evite **CPU limit** apertado no DaemonSet.
    

## Mini exemplo (mínimo e didático)

```ini
[SERVICE]
  Parsers_File parsers.conf
  HTTP_Server On
  HTTP_Listen 0.0.0.0
  HTTP_Port 2020
  storage.path /var/fluent-bit/state
  storage.sync normal

[INPUT]
  Name   tail
  Path   /var/log/containers/*.log
  Tag    kube.app
  Parser cri
  DB     /var/fluent-bit/state/tail.db
  DB.Sync normal
  storage.type filesystem
  multiline.parser cri

[FILTER]
  Name  kubernetes
  Match kube.*

[FILTER]
  Name      parser
  Match     kube.*
  Key_Name  log
  Parser    json
  Reserve_Data On

[OUTPUT]
  Name  stdout
  Match kube.*
  Format json_lines
```

## Comandos úteis

- Logs do agente: `kubectl -n logging logs -l app.kubernetes.io/name=fluent-bit -f`
    
- Config efetiva: `kubectl exec ... -- cat /fluent-bit/etc/fluent-bit.conf`
    
- Métricas locais: `curl 127.0.0.1:2020/api/v1/metrics/prometheus`
    

---

# Como aprofundar (foco em **inputs**)

**Trilha sugerida (curta):**

1. **Inputs base**: `tail`, `systemd`, `tcp`, `http`.
    
2. **Tail em K8s**: opções críticas (`DB`, `Read_from_Head`, `Ignore_Older`, `Mem_Buf_Limit`, `storage.type`).
    
3. **Multiline** atrelado ao `tail` (Java/Go) e interação com parsers.
    
4. **Roteamento por Tag** desde o INPUT; duplicação com `rewrite_tag` (se precisar).
    
5. **Inputs menos comuns**: `syslog`, `kafka`, `exec` (quando faz sentido).
    

**Próximo passo**: me diga qual **INPUT** você quer dominar primeiro (ex.: `tail` em K8s), que eu te mando um **guia essencial** desse input com opções-chave, gotchas e um `values.yaml` de referência.